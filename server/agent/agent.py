"""
Intervu AI Voice Agent — LiveKit-based Socratic Technical Interviewer

This module implements the real-time voice agent that conducts technical interviews.
It runs as a LiveKit worker that joins each interview room and interacts with the
candidate via speech (STT → LLM → TTS pipeline).

Architecture:
  ┌─────────────┐   LiveKit Data    ┌──────────────────┐
  │  Frontend   │ ◄──────────────► │  Python Agent    │
  │  (React)    │   (code, problem) │  (this file)     │
  └──────┬──────┘                   └────────┬─────────┘
         │                                   │
         │  REST API                         │  Groq LLM
         │  (submit, start)                  │  (llama-3.3-70b)
         ▼                                   ▼
  ┌─────────────┐                   ┌──────────────────┐
  │  Express    │                   │  Deepgram STT/TTS│
  │  Server     │                   │  (nova-2 / aura) │
  └─────────────┘                   └──────────────────┘

Question Template Flow (how the agent knows what to ask):
  1. POST /start selects random questions from QUESTION_BANK
  2. Frontend receives the first question and sends it to this agent
     via LiveKit data channel as a "problem" message (title + description)
  3. This agent receives the problem context in on_data_received()
  4. It injects the problem title, description, and live code into the
     Socratic prompt via build_interview_instructions()
  5. As the candidate types, the frontend sends "code" messages with the
     latest editor content, which the agent dynamically injects into its
     instructions so it can reference specific lines during the conversation

Key Components:
  - build_interview_instructions(): Constructs the Socratic prompt with live context
  - on_data_received: Handles data packets (problem context + code updates) from frontend
  - entrypoint: Main agent lifecycle — connects to room, waits for context, greets candidate
"""

import asyncio
import logging
import os
import json
from dotenv import load_dotenv

from livekit.agents import (
    cli,
    WorkerOptions,
    JobContext,
    AgentSession,
    ChatContext,
    ChatMessage,
    ChatRole,
)
from livekit.plugins import deepgram, openai, silero
import livekit.agents.voice as voice

# --- Deepgram/TTS fix ---
# Patches a known issue with the Deepgram TTS plugin in the current
# livekit-agents SDK version. Without this, TTS calls may fail silently.
from deepgram_patch import patch_deepgram_tts
patch_deepgram_tts()

load_dotenv()

logger = logging.getLogger("intervu-ai-agent")
logger.setLevel(logging.INFO)


# ============================================================================
# SOCRATIC INTERVIEWER PROMPT BUILDER
# ============================================================================

def build_interview_instructions(problem_title="the coding task", problem_desc="the problem description", current_code="// No code yet") -> str:
    """
    Constructs the Socratic interview instructions with real-time context injected.

    This function is the heart of the agent's question template system. It takes
    three pieces of live context and embeds them into a structured prompt that
    instructs the LLM to act as a Socratic technical interviewer.

    Parameters:
      problem_title: The title of the current question (e.g., "Reverse Linked List")
      problem_desc:  The full problem description with constraints
      current_code:  The candidate's latest code from the editor (updated in real-time)

    The prompt is designed to:
      1. Give the agent full visibility of the problem and candidate's code
      2. Enforce Socratic behavior — ask guiding questions, never give answers
      3. Structure the interview into stages: approach review → silent observation → inquiry
      4. Keep responses concise (under 2 sentences) for natural conversation flow

    Dynamic Re-injection:
      Every time the candidate's code changes, the frontend sends a "code" data packet.
      The on_data_received handler calls this function again with the new code and
      calls agent.update_instructions() to hot-swap the prompt mid-interview.
      This is how the agent can reference specific lines like "I'm looking at line 12..."
    """
    return f"""# ROLE: INTERVU AI - Senior Technical Interviewer

You are Intervu AI, a calm, professional Senior Software Engineer.
You are currently evaluating the candidate one-on-one.

## LIVE CONTEXT (THE ONLY SOURCE OF TRUTH)
1. **[CURRENT PROBLEM]**: {problem_title}
   - Description: {problem_desc}
   - **IMPORTANT**: If they ask "What is the problem?", briefly remind them of the title. BUT DO NOT ask them "What is the problem?". YOU SEE IT.
2. **[CANDIDATE CODE]**: 
```javascript
{current_code}
```

## INTERVIEW STAGES
1. **Approach Review**: BEFORE they code, ask them to explain their plan.
2. **Silent Observation**: While they type, STAY SILENT. If they pause for >30s, comment on a SPECIFIC line of their code.
3. **Socratic Inquiry**: If they make a mistake, do not give the answer. Instead, ask: "I'm looking at line X... how would that handle [edge case]?"

## GUARDRAILS
- **No Direct Answers**: Never write code for them.
- **Concise**: Keep responses under 2 sentences.
- **Stay in Context**: Use the [CANDIDATE CODE] above to make your questions specific. Avoid generic feedback.
"""


# ============================================================================
# MAIN AGENT ENTRYPOINT
# ============================================================================

async def entrypoint(ctx: JobContext):
    """
    Main entrypoint for the voice agent — called once per interview room.

    Lifecycle:
      1. Initialize STT (Deepgram nova-2), LLM (Groq llama-3.3-70b), TTS (Deepgram aura)
      2. Create the voice agent with initial Socratic instructions
      3. Register data packet handlers for problem context and code updates
      4. Connect to the LiveKit room and start the session
      5. Wait for the frontend to send problem context (with 30s timeout)
      6. Send a personalized greeting referencing the specific problem title
      7. Keep the session alive until the participant disconnects

    The agent is idle until the frontend sends a "problem" data packet with
    the question title and description. This happens automatically when the
    candidate's browser loads the interview page.
    """
    logger.info(f"[ENTRYPOINT] Starting agent for room '{ctx.room.name}'")

    # Local state — stores the current problem context and latest code.
    # These are updated by data packets from the frontend and injected
    # into the Socratic prompt via build_interview_instructions().
    interview_state = {
        "problem_title": "the coding task",
        "problem_desc": "the problem description",
        "latest_code": "// Preparing your environment...",
    }
    
    # Event to signal when problem context is ready.
    # The agent waits on this before sending the greeting, ensuring
    # it knows which question to reference in the opening line.
    problem_context_received = asyncio.Event()

    # --- Step 1: Setup Models ---
    
    # Voice Activity Detection (VAD) — detects when the candidate is speaking
    # vs. silence. Pre-warmed in the prewarm function for faster startup.
    vad = ctx.proc.userdata.get("vad")
    if vad is None:
        logger.info("[ENTRYPOINT] VAD not found in userdata, loading now...")
        vad = silero.VAD.load()
        ctx.proc.userdata["vad"] = vad
    
    # LLM — Groq-hosted Llama 3.3 70B for generating interview responses.
    # Uses the Groq OpenAI-compatible API endpoint.
    groq_llm = openai.LLM(
        base_url="https://api.groq.com/openai/v1",
        api_key=os.environ.get("GROQ_API_KEY"),
        model="llama-3.3-70b-versatile"
    )
    
    # Speech-to-Text — Deepgram Nova-2 for transcribing candidate's speech in real-time
    deepgram_stt = deepgram.STT(model="nova-2-general")
    # Text-to-Speech — Deepgram Aura Helios for natural-sounding agent voice
    deepgram_tts = deepgram.TTS(model="aura-helios-en")

    # --- Step 2: Define the Agent ---
    # The voice agent with initial (placeholder) instructions.
    # Instructions are updated dynamically once problem context arrives.
    logic_agent = voice.Agent(
        instructions=build_interview_instructions(),
        chat_ctx=ChatContext()
    )

    # --- Step 3: Setup Session ---
    # AgentSession wires together VAD → STT → LLM → TTS into a single
    # conversation loop. The agent listens, thinks, and speaks automatically.
    session = AgentSession(
        vad=vad,
        stt=deepgram_stt,
        llm=groq_llm,
        tts=deepgram_tts,
    )

    # --- Step 4: Handle Data Interactions ---
    # This handler processes data packets sent from the frontend via LiveKit.
    # Two packet types are critical for the question template system:
    #   - "problem": Contains the question title + description (sent once at start)
    #   - "code":    Contains the candidate's latest editor content (sent on every keystroke debounce)
    @ctx.room.on("data_received")
    def on_data_received(data_packet):
        try:
            payload = json.loads(data_packet.data.decode('utf-8'))
            msg_type = payload.get("type")
            
            logger.info(f"[DATA] Received packet type: {msg_type}")
            
            if msg_type == "problem":
                # Frontend sent the problem context — this is the question template
                # that was selected by POST /start. Store it in local state and
                # signal the greeting logic that context is ready.
                title = payload.get('title', 'Unknown')
                logger.info(f"[CONTEXT] Problem context received: {title}")
                interview_state["problem_title"] = title
                interview_state["problem_desc"] = payload.get("description", "")
                problem_context_received.set()
                
                # Handshake: Send acknowledgment back to frontend so it stops
                # re-sending the problem context every 500ms.
                confirmation = json.dumps({"type": "problem_ack", "title": interview_state["problem_title"]})
                if ctx.room.local_participant:
                     asyncio.create_task(ctx.room.local_participant.publish_data(confirmation, reliable=True))
                     logger.info("[DATA] Sent problem_ack to frontend")
            
            elif msg_type == "code":
                # Candidate's latest code from the editor. This is sent every
                # ~500ms (debounced) by the frontend. We store it so the
                # dynamic instruction update can embed it in the Socratic prompt.
                interview_state["latest_code"] = payload.get("content", "// No code")
            
            # CRITICAL: Dynamic Instruction Injection
            # After processing either packet type, rebuild the Socratic prompt
            # with the latest context (problem title, description, and code)
            # and hot-swap the agent's instructions. This is what enables the
            # agent to reference specific code lines and problem details.
            #
            # We only do this after we've received actual problem context
            # (not the placeholder defaults) to avoid injecting garbage.
            if interview_state["problem_title"] != "the coding task":
                asyncio.create_task(logic_agent.update_instructions(
                    build_interview_instructions(
                        interview_state["problem_title"],
                        interview_state["problem_desc"],
                        interview_state["latest_code"]
                    )
                ))
            
        except Exception as e:
            logger.error(f"[DATA] Error processing packet: {e}")

    # --- Step 5: Connect and Start ---
    try:
        logger.info("[STEP 5] Calling session.start...")
        await session.start(agent=logic_agent, room=ctx.room)
        logger.info("[STEP 5] Session started successfully")

        # --- Step 6: Send Greeting ---
        # Wait for the frontend to send problem context before greeting.
        # This ensures the greeting references the actual question title.
        logger.info("[STEP 5.5] Waiting for problem context...")
        try:
            # Wait up to 30 seconds for the frontend to send the "problem" packet.
            # If the frontend is slow to load or the API is delayed, this gives
            # a generous window. After timeout, fall back to a generic greeting.
            await asyncio.wait_for(problem_context_received.wait(), timeout=30.0)
            logger.info(f"[STEP 5.5] Context received: {interview_state['problem_title']}")
            
            # Stabilization delay: Give the frontend a moment to subscribe to
            # the audio track. This prevents the greeting from being cut off
            # or lost during WebRTC connection setup.
            await asyncio.sleep(1.0)

            # Personalized greeting that references the specific problem title.
            # This immediately signals to the candidate that the AI knows what
            # they're working on and sets up the "approach review" interview stage.
            greeting_text = f"Hello! I'm Intervu AI. I see we're working on '{interview_state['problem_title']}'. Walk me through your approach before we start coding."
            logger.info(f"[STEP 6] Sending greeting: {greeting_text}")
            await session.say(greeting_text, allow_interruptions=False)

        except asyncio.TimeoutError:
            # Fallback: If no problem context arrives within 30s, ask the candidate
            # to describe the problem themselves. This prevents a dead-air situation.
            logger.error("[STEP 5.5] CRITICAL: Timed out waiting for context!")
            fallback_text = "Hello! I'm ready to start. Could you tell me which problem we are working on today?"
            logger.info(f"[STEP 6] Sending FALLBACK greeting: {fallback_text}")
            await session.say(fallback_text, allow_interruptions=False)
        
        # Keep the session alive until the participant disconnects.
        # The room will be cleaned up automatically by LiveKit.
        while ctx.room.is_connected:
            await asyncio.sleep(1)

    except Exception as e:
        logger.error(f"[ENTRYPOINT] Crash: {e}")
    finally:
        logger.info("[ENTRYPOINT] Session ended. Report will be generated by the server.")


async def prewarm(proc):
    """
    Pre-warm hook — loads the VAD model before the first interview starts.
    
    This is called by the LiveKit CLI during worker initialization so that
    the silero VAD model is already in memory when the first candidate connects,
    reducing cold-start latency.
    """
    logger.info("[PREWARM] Loading VAD model...")
    proc.userdata["vad"] = silero.VAD.load()
    logger.info("[PREWARM] VAD loaded successfully")


if __name__ == "__main__":
    # Start the LiveKit agent worker.
    # cli.run_app connects to the LiveKit server and dispatches the entrypoint
    # function for each new room that matches the agent's subscription.
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )

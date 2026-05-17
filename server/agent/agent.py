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
from deepgram_patch import patch_deepgram_tts
patch_deepgram_tts()

load_dotenv()

logger = logging.getLogger("intervu-ai-agent")
logger.setLevel(logging.INFO)

# ============================================================================
# SOCRATIC INTERVIEWER PROMPT
# ============================================================================

def build_interview_instructions(problem_title="the coding task", problem_desc="the problem description", current_code="// No code yet") -> str:
    """
    Constructs the Socratic instructions with real-time context injected.
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
# FORENSIC REPORT GENERATOR (SINGLE AGENT MODE)
# ============================================================================


async def entrypoint(ctx: JobContext):
    logger.info(f"[ENTRYPOINT] Starting agent for room '{ctx.room.name}'")

    # Local state
    interview_state = {
        "problem_title": "the coding task",
        "problem_desc": "the problem description",
        "latest_code": "// Preparing your environment...",
    }
    
    # Event to signal when problem context is ready
    problem_context_received = asyncio.Event()

    # 1. Setup Models
    vad = ctx.proc.userdata.get("vad")
    if vad is None:
        logger.info("[ENTRYPOINT] VAD not found in userdata, loading now...")
        vad = silero.VAD.load()
        ctx.proc.userdata["vad"] = vad
    
    groq_llm = openai.LLM(
        base_url="https://api.groq.com/openai/v1",
        api_key=os.environ.get("GROQ_API_KEY"),
        model="llama-3.3-70b-versatile"
    )
    
    deepgram_stt = deepgram.STT(model="nova-2-general")
    deepgram_tts = deepgram.TTS(model="aura-helios-en")

    # 2. Define the Agent
    logic_agent = voice.Agent(
        instructions=build_interview_instructions(),
        chat_ctx=ChatContext()
    )

    # 3. Setup Session
    session = AgentSession(
        vad=vad,
        stt=deepgram_stt,
        llm=groq_llm,
        tts=deepgram_tts,
    )

    # 4. Handle Data Interactions
    @ctx.room.on("data_received")
    def on_data_received(data_packet):
        try:
            payload = json.loads(data_packet.data.decode('utf-8'))
            msg_type = payload.get("type")
            
            # Log ONLY the type to avoid huge logs
            logger.info(f"[DATA] Received packet type: {msg_type}")
            
            if msg_type == "problem":
                title = payload.get('title', 'Unknown')
                logger.info(f"[CONTEXT] Problem context received: {title}")
                interview_state["problem_title"] = title
                interview_state["problem_desc"] = payload.get("description", "")
                problem_context_received.set()
                
                # Handshake: Acknowledge receipt so frontend stops spamming
                confirmation = json.dumps({"type": "problem_ack", "title": interview_state["problem_title"]})
                # Ensure we use the current participant to send
                if ctx.room.local_participant:
                     asyncio.create_task(ctx.room.local_participant.publish_data(confirmation, reliable=True))
                     logger.info("[DATA] Sent problem_ack to frontend")
            
            elif msg_type == "code":
                interview_state["latest_code"] = payload.get("content", "// No code")
            
            # CRITICAL: Dynamic Injection - Update agent instructions in real-time
            # Only update if we actually have context
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

    # 5. Connect and Start
    try:
        logger.info("[STEP 5] Calling session.start...")
        await session.start(agent=logic_agent, room=ctx.room)
        logger.info("[STEP 5] Session started successfully")

        # 6. Send Greeting
        # 6. Send Greeting
        # Wait for context (with long safety timeout)
        logger.info("[STEP 5.5] Waiting for problem context...")
        try:
            # Wait up to 30 seconds for context
            await asyncio.wait_for(problem_context_received.wait(), timeout=30.0)
            logger.info(f"[STEP 5.5] Context received: {interview_state['problem_title']}")
            
            # Stabilization delay: Give the frontend a moment to subscribe to the audio track
            # This prevents the greeting from being cut off or lost during connection stabilization
            await asyncio.sleep(1.0)

            greeting_text = f"Hello! I'm Intervu AI. I see we're working on '{interview_state['problem_title']}'. Walk me through your approach before we start coding."
            logger.info(f"[STEP 6] Sending greeting: {greeting_text}")
            await session.say(greeting_text, allow_interruptions=False)

        except asyncio.TimeoutError:
            logger.error("[STEP 5.5] CRITICAL: Timed out waiting for context!")
            # Fallback: Just ask the user to describe it, don't hallucinate.
            fallback_text = "Hello! I'm ready to start. Could you tell me which problem we are working on today?"
            logger.info(f"[STEP 6] Sending FALLBACK greeting: {fallback_text}")
            await session.say(fallback_text, allow_interruptions=False)
        
        # Run until participant disconnects
        while ctx.room.is_connected:
            await asyncio.sleep(1)

    except Exception as e:
        logger.error(f"[ENTRYPOINT] Crash: {e}")
    finally:
        logger.info("[ENTRYPOINT] Session ended. Report will be generated by the server.")

async def prewarm(proc):
    logger.info("[PREWARM] Loading VAD model...")
    proc.userdata["vad"] = silero.VAD.load()
    logger.info("[PREWARM] VAD loaded successfully")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )

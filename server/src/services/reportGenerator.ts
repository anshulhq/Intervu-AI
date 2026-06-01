/**
 * Report Generator — Post-Interview Forensic Evaluation Engine
 *
 * This module generates detailed interview evaluation reports using Groq's LLM.
 * It is triggered as a fire-and-forget task from POST /submit after the
 * candidate finishes the interview.
 *
 * How it connects to the question template system:
 *   1. The session document contains the question title, description, candidate's
 *      final code, and the full conversation transcript.
 *   2. This module formats all of that into a structured prompt for the LLM.
 *   3. The LLM produces a JSON evaluation covering code correctness, communication
 *      quality, and problem-solving ability.
 *   4. The evaluation is saved back to the session's `feedback` field.
 *
 * Alternative path: The Python voice agent can also generate reports independently
 * and save them via POST /save-analysis. Both paths write to the same `feedback` field.
 *
 * Error handling:
 *   If the LLM call fails (rate limit, malformed JSON, etc.), a fallback report
 *   with score 0 is saved so the frontend can still render the results page.
 */

import Groq from 'groq-sdk';
import Session from '../models/Session';

// Singleton Groq client — lazily initialized on first use.
// Avoids creating a new client instance on every report generation call.
let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

/**
 * SYSTEM_PROMPT — The meta-prompt that instructs the LLM to act as a
 * forensic technical interview evaluator.
 *
 * Design philosophy:
 *   - "Ruthlessly Detailed": Every minor error should be flagged with specific
 *     line numbers and variable names — no vague feedback like "improve error handling"
 *   - "Evidence-Based": Every claim must cite a line number, variable name, or
 *     exact transcript quote
 *   - "No Filler": No praise for attendance or politeness — only technical merit
 *
 * The prompt enforces three mandatory analysis rules:
 *   RULE 1 (Code Audit): Detects everything from syntax errors to logic bugs
 *     to best practice violations. If no code was submitted, generates an error.
 *   RULE 2 (Transcript Forensics): Analyzes spoken responses for precision,
 *     clarity, and responsiveness to hints. Short/empty transcripts get flagged.
 *   RULE 3 (Structure): Forces the output into a strict JSON schema so the
 *     frontend can parse and render it reliably.
 *
 * Output JSON structure:
 *   {
 *     overall_score: 1-10,
 *     correctness: boolean,
 *     dimension_scores: { problem_solving, algorithmic_thinking, ... },
 *     code_issues: [{ line_number, code_snippet, issue, suggestion, severity }],
 *     transcript_issues: [{ quote, issue, what_should_have_been_said, category }],
 *     feedback_markdown: "### Summary\n### Strengths\n### Areas for Improvement\n### Problem-Solving\n### Communication\n### Code Review"
 *   }
 */
const SYSTEM_PROMPT = `# INTERVU AI REPORT AGENT - IDENTITY

You are the Intervu AI Report Agent, an elite, hyper-critical technical interview evaluator for top-tier tech companies (Google, Netflix, HFT firms).
The interview has concluded. Your job is to provide a Forensic, Deep-Dive Analysis.

## YOUR CHARACTERISTICS:
- Ruthlessly Detailed: Do not glaze over minor errors. Address everything.
- Pinpoint Specificity: Never say "improve error handling". Say "Line 45 catches a generic Exception which masks the specific internal error."
- Direct & Professional: Use clear, high-impact language.
- Evidence-Based: You MUST cite specific line numbers, variable names, and exact transcript quotes for every claim.
- No Filler: Never praise "Attendance" or "Politeness". Only praise technical or communication skills.

# MANDATORY OUTPUT REQUIREMENTS

## RULE 1: DEEP CODE AUDIT
- IF CODE IS EMPTY: Generate a code_issue at Line 1 with severity "error" and issue "Missing Implementation".
- IF CODE EXISTS: List EVERY issue found.
- Syntactical: Typos, missing semicolons, wrong strict types.
- Logical: Infinite loops, off-by-one errors, unnecessary computations.
- Best Practices: Variable naming, lack of comments, magic numbers.

## RULE 2: TRANSCRIPT FORENSICS
- IF TRANSCRIPT IS SHORT/EMPTY: Generate a transcript_issue with severity "error" stating "Lack of Communication".
- Identify SPECIFIC issues in the spoken responses.
- Precision: Did they say "Hashtable" when they meant "HashSet"?
- Clarity: Did they ramble?
- Responsiveness: Did they ignore a hint from the interviewer?

## RULE 3: Structure
- Your response MUST be valid JSON with this exact structure:

{
  "overall_score": <number 1-10>,
  "correctness": <boolean>,
  "dimension_scores": {
    "problem_solving": <1-10>,
    "algorithmic_thinking": <1-10>,
    "code_implementation": <1-10>,
    "testing": <1-10>,
    "time_management": <1-10>,
    "communication": <1-10>
  },
  "code_issues": [
    {
      "line_number": <number>,
      "code_snippet": "<exact code or 'N/A'>",
      "issue": "<what is wrong>",
      "suggestion": "<how to fix>",
      "severity": "error" | "warning" | "info"
    }
  ],
  "transcript_issues": [
    {
      "quote": "<exact quote or 'Silence'>",
      "issue": "<critique>",
      "what_should_have_been_said": "<better phrasing>",
      "category": "communication" | "technical" | "behavior"
    }
  ],
  "feedback_markdown": "<full markdown report>"
}

The feedback_markdown MUST use these EXACT headers and follow this deep analysis style:

### Summary
Provide a thorough, detailed overview of the interview performance. Discuss the candidate's core approach, efficiency, and how they handled the overall structure of the interview. Include specific details about their progress and key takeaways. Avoid generic sentences and write at least 2-3 detailed paragraphs.

### Strengths
Identify and elaborate on specific technical, algorithmic, and coding strengths demonstrated by the candidate during the interview, citing concrete examples (e.g., specific lines of code, concepts mentioned, or optimal decisions). Do NOT just list brief bullets. Each bullet point must be a detailed 2-3 sentence analysis.

### Areas for Improvement
Provide a detailed, constructive critique of areas where the candidate struggled, made suboptimal choices, or could optimize further. Refer to specific lines in their code or quotes from their transcript to justify these points. Each point must be detailed, comprehensive, and actionable.

### Problem-Solving
Evaluate the candidate's problem-solving strategy, logical progression, edge case handling, and ability to break down the problem. Detail how they structured their thoughts, whether they identified key insights on their own or required hints, and how effectively they translated their plan into a working algorithm. Provide a thorough, detailed paragraphs-based analysis.

### Communication
Analyze the candidate's verbal clarity, precision in technical terminology, and interactive behavior. Critique how well they explained their thought process before and during coding, how they responded to questions or hints from the interviewer, and the overall structured quality of their explanations. Write a detailed analysis with specific quotes/observations from the transcript.

### Code Review
Provide a comprehensive, line-by-line or component-by-component technical critique of their submitted code. Analyze time and space complexities in detail (citing Big-O notation), coding style, naming conventions, safety (e.g., null checks, bounds checks), and structural design. Give precise suggestions for refactoring.

Do NOT output any text before or after the JSON.`;


/**
 * generateReport — Main report generation function.
 *
 * Flow:
 *   1. Fetch the session from MongoDB (including question, code, transcript)
 *   2. Skip if feedback already exists (idempotency guard)
 *   3. Format the interview artifacts into a user prompt for the LLM:
 *      - Problem context (title + description from the question template)
 *      - Candidate's final code
 *      - Full conversation transcript (formatted as CANDIDATE/INTERVU AI dialogue)
 *   4. Call Groq LLM (llama-3.3-70b-versatile) with low temperature (0.3)
 *      for consistent, deterministic evaluations
 *   5. Strip any markdown code fences from the response (LLMs sometimes
 *      wrap JSON in ```json ... ```)
 *   6. Parse the JSON and save it to session.feedback
 *
 * If anything fails, a fallback report with score 0 is saved so the
 * frontend doesn't get stuck waiting for a report that will never come.
 *
 * @param sessionId - The session ID to generate a report for
 */
export async function generateReport(sessionId: string): Promise<void> {
  console.log(`[Report] Starting report generation for session: ${sessionId}`);

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      console.error(`[Report] Session not found: ${sessionId}`);
      return;
    }

    // Idempotency: If the agent already saved a report via /save-analysis,
    // don't overwrite it with a Node-generated one.
    if (session.feedback) {
      console.log(`[Report] Session already has feedback, skipping.`);
      return;
    }

    // Extract the question context — this is the same question that was
    // selected by POST /start and sent to the Python agent during the interview.
    const problemTitle = session.question?.title || 'Unknown Problem';
    const problemDesc = session.question?.description || '';
    const code = session.code || '// No code submitted';

    // Format the conversation transcript as a readable dialogue.
    // Each message is prefixed with CANDIDATE or INTERVU AI for clarity.
    let transcript = '';
    if (session.transcript && session.transcript.length > 0) {
      for (const msg of session.transcript) {
        const role = msg.role === 'user' ? 'CANDIDATE' : 'INTERVU AI';
        transcript += `${role}: ${msg.content}\n`;
      }
    } else {
      // No verbal communication — the LLM will flag this as an error
      // per RULE 2 (Transcript Forensics) in the system prompt.
      transcript = '(No verbal communication during the session)';
    }

    // Build the user prompt with all interview artifacts.
    // This gives the LLM the full picture: what was asked, what was coded,
    // and what was said during the interview.
    const userContent = `# INTERVIEW ARTIFACTS TO ANALYZE

## PROBLEM CONTEXT
**Problem:** ${problemTitle}
**Description:** ${problemDesc}

## CANDIDATE'S FINAL CODE
\`\`\`
${code}
\`\`\`

## INTERVIEW TRANSCRIPT
${transcript}

---

Generate the JSON evaluation now. Output ONLY valid JSON, no other text.`;

    console.log(`[Report] Calling Groq LLM for analysis...`);

    // Call Groq LLM with low temperature for consistent evaluations.
    // Temperature 0.3 keeps the analysis focused and reproducible while
    // still allowing slight variation in wording.
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    let contentStr = response.choices[0]?.message?.content || '';
    if (!contentStr) {
      console.error(`[Report] Empty response from LLM`);
      return;
    }

    // Strip markdown code fences that some LLMs add around JSON output.
    // Handles both ```json and plain ``` variants.
    contentStr = contentStr.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    // Parse the JSON evaluation and save it to the session.
    const analysis = JSON.parse(contentStr);
    console.log(`[Report] Analysis generated. Score: ${analysis.overall_score}`);

    session.feedback = analysis;
    session.status = 'completed';
    await session.save();

    console.log(`[Report] Successfully saved report for session: ${sessionId}`);
  } catch (error) {
    console.error(`[Report] Failed to generate report for ${sessionId}:`, error);

    // Save a fallback report so the frontend can still render the results page.
    // Score is 0 and all dimensions are 0 — clearly indicating the evaluation failed.
    // The feedback_markdown includes the error message for debugging.
    try {
      await Session.updateOne(
        { sessionId },
        {
          $set: {
            feedback: {
              overall_score: 0,
              correctness: false,
              dimension_scores: {
                problem_solving: 0,
                algorithmic_thinking: 0,
                code_implementation: 0,
                testing: 0,
                time_management: 0,
                communication: 0,
              },
              code_issues: [],
              transcript_issues: [],
              feedback_markdown: `### Summary\nReport generation failed. Please try another interview.\n\n### Error\n${error instanceof Error ? error.message : 'Unknown error'}\n\n### Strengths\n- N/A\n\n### Areas for Improvement\n- N/A\n\n### Problem-Solving\n- N/A\n\n### Communication\n- N/A\n\n### Code Review\n- N/A`,
            },
            status: 'completed',
          },
        }
      );
      console.log(`[Report] Saved fallback feedback for session: ${sessionId}`);
    } catch (saveErr) {
      console.error(`[Report] Failed to save fallback feedback:`, saveErr);
    }
  }
}

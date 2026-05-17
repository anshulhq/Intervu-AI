import Groq from 'groq-sdk';
import Session from '../models/Session';

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

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

The feedback_markdown MUST use these EXACT headers:
### Summary
### Strengths
### Areas for Improvement
### Code Review

Do NOT output any text before or after the JSON.`;

export async function generateReport(sessionId: string): Promise<void> {
  console.log(`[Report] Starting report generation for session: ${sessionId}`);

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      console.error(`[Report] Session not found: ${sessionId}`);
      return;
    }

    if (session.feedback) {
      console.log(`[Report] Session already has feedback, skipping.`);
      return;
    }

    const problemTitle = session.question?.title || 'Unknown Problem';
    const problemDesc = session.question?.description || '';
    const code = session.code || '// No code submitted';

    let transcript = '';
    if (session.transcript && session.transcript.length > 0) {
      for (const msg of session.transcript) {
        const role = msg.role === 'user' ? 'CANDIDATE' : 'INTERVU AI';
        transcript += `${role}: ${msg.content}\n`;
      }
    } else {
      transcript = '(No verbal communication during the session)';
    }

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

    contentStr = contentStr.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    const analysis = JSON.parse(contentStr);
    console.log(`[Report] Analysis generated. Score: ${analysis.overall_score}`);

    session.feedback = analysis;
    session.status = 'completed';
    await session.save();

    console.log(`[Report] Successfully saved report for session: ${sessionId}`);
  } catch (error) {
    console.error(`[Report] Failed to generate report for ${sessionId}:`, error);

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
              feedback_markdown: `### Summary\nReport generation failed. Please try another interview.\n\n### Error\n${error instanceof Error ? error.message : 'Unknown error'}`,
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

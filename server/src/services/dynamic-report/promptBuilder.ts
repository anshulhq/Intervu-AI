/**
 * Prompt Builder — Dynamically Constructs LLM Prompts Per Question
 *
 * Instead of one generic system prompt for all questions, this module
 * builds a tailored prompt that includes:
 *   - Category-specific evaluation criteria (from dimensions.ts)
 *   - Difficulty-adjusted expectations (harder grading for easy problems)
 *   - The actual problem context, code, and transcript
 *
 * This makes the LLM's evaluation more relevant and precise for each
 * question type rather than applying a one-size-fits-all rubric.
 */

import {
  InterviewData,
  PromptContext,
  TranscriptMessage,
} from './types';
import { EVALUATION_DIMENSIONS, getGuidanceForCategory } from './dimensions';

function buildDimensionInstructions(category: string): string {
  return EVALUATION_DIMENSIONS.map((dim) => {
    const guidance = getGuidanceForCategory(dim.key, category);
    return `### ${dim.label} (${dim.key})
Weight: ${(dim.weight * 100).toFixed(0)}%
${dim.description}
Category-specific criteria: ${guidance}`;
  }).join('\n\n');
}

function buildDifficultyContext(
  difficulty: string,
  codeLineCount: number,
): string {
  const expectations: Record<string, string> = {
    easy: `This is an EASY problem. The bar is high:
- A correct optimal solution is expected (not a brute-force workaround)
- Code should be clean and bug-free on first attempt
- Communication should be clear and proactive
- Deduct points heavily for bugs that a senior engineer would not make at this level`,
    medium: `This is a MEDIUM problem. Balanced expectations:
- A correct solution is expected; sub-optimal but working is acceptable with explanation
- Minor bugs are forgivable if the core logic is sound
- Communication should show structured thinking
- Partial credit for recognizing the approach even if implementation has gaps`,
    hard: `This is a HARD problem. More lenient evaluation:
- A working solution is excellent even if not fully optimal
- Clear pseudo-code or partial implementation shows strong ability
- Focus on whether they identified the key insight
- Verbal explanation quality matters more than perfect code`,
  };

  return (
    expectations[difficulty] || expectations['medium'] +
    `\n\nCode submitted: ${codeLineCount} lines.`
  );
}

function formatTranscript(messages: TranscriptMessage[]): string {
  if (!messages || messages.length === 0) {
    return '(No verbal communication during the session)';
  }

  return messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'CANDIDATE' : 'INTERVU AI';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
}

function buildSystemPrompt(category: string, difficulty: string): string {
  const dimensionInstructions = buildDimensionInstructions(category);

  return `# INTERVU AI — Dynamic Report Agent

You are an elite technical interview evaluator. The interview has concluded.
Generate a forensic, evidence-based evaluation of the candidate's performance.

## EVALUATION PHILOSOPHY
- **Ruthlessly Detailed**: Flag every minor error with line numbers and variable names
- **Evidence-Based**: Cite specific line numbers, variable names, or exact transcript quotes for EVERY claim
- **No Filler**: Never praise attendance or politeness — only technical and communication merit
- **Context-Aware**: Your evaluation criteria adapt to the question's category and difficulty

## EVALUATION DIMENSIONS
You MUST score each of these dimensions from 1-10:

${dimensionInstructions}

## ${buildDifficultyContext(difficulty, 0)}

## MANDATORY ANALYSIS RULES

### RULE 1: CODE AUDIT
- IF CODE IS EMPTY or only contains starter code: Generate a code_issue at Line 1 with severity "error" and issue "No Implementation — only starter code was submitted"
- IF CODE EXISTS: Audit every line for:
  - Syntactical errors (typos, missing semicolons, wrong types)
  - Logical errors (infinite loops, off-by-one, incorrect conditions)
  - Best practice violations (naming, magic numbers, unnecessary variables)
  - Missing edge case handling specific to this problem type

### RULE 2: TRANSCRIPT FORENSICS
- IF TRANSCRIPT IS EMPTY or very short: Flag as "Lack of Communication" with severity "error"
- Analyze spoken responses for:
  - Precision: Correct terminology? ("HashMap" vs "Hashtable")
  - Clarity: Rambling or concise?
  - Responsiveness: Did they address hints or ignore them?
  - Proactiveness: Did they volunteer complexity analysis or wait to be asked?

### RULE 3: OUTPUT STRUCTURE
Your response MUST be valid JSON with this EXACT structure:

{
  "overall_score": <number 1-10>,
  "correctness": <boolean — does the code solve the problem?>,
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
      "code_snippet": "<exact code fragment or 'N/A'>",
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
}

function buildUserPrompt(data: InterviewData): string {
  const transcript = formatTranscript(data.transcript);
  const codeLineCount = data.code.split('\n').filter((l) => l.trim()).length;

  const submissionContext =
    data.submissions.length > 0
      ? `\n## SUBMISSION HISTORY\n${data.submissions.length} question(s) were submitted during this session.`
      : '';

  const durationContext = data.durationMinutes
    ? `\n**Interview Duration:** ${data.durationMinutes} minutes`
    : '';

  return `# INTERVIEW ARTIFACTS TO ANALYZE

## PROBLEM CONTEXT
**Problem:** ${data.question.title}
**Difficulty:** ${data.question.difficulty}
**Category:** ${data.question.category}
**Tags:** ${data.question.tags.join(', ')}
**Description:** ${data.question.description}

${data.question.examples.length > 0 ? `## EXAMPLES\n${data.question.examples.join('\n\n')}` : ''}
${durationContext}
${submissionContext}

## CANDIDATE'S FINAL CODE
\`\`\`${data.language}
${data.code}
\`\`\`
(${codeLineCount} non-empty lines)

## INTERVIEW TRANSCRIPT
${transcript}
(${data.transcript.filter((m) => m.role === 'user').length} candidate messages)

---

Generate the JSON evaluation now. Output ONLY valid JSON, no other text.`;
}

export function buildPrompt(data: InterviewData): PromptContext {
  const codeLineCount = data.code.split('\n').filter((l) => l.trim()).length;
  const systemPrompt = buildSystemPrompt(
    data.question.category,
    data.question.difficulty,
  ).replace(
    `Code submitted: 0 lines.`,
    `Code submitted: ${codeLineCount} lines.`,
  );

  return {
    systemPrompt,
    userPrompt: buildUserPrompt(data),
  };
}

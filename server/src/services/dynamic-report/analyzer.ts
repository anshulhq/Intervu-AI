/**
 * Analyzer — Pre-Processing Helpers for Code and Transcript Data
 *
 * Before sending data to the LLM, these helpers extract quantitative
 * signals that help with:
 *   1. Enriching the prompt with contextual metadata
 *   2. Flagging obvious issues (empty code, no communication) early
 *   3. Providing heuristics for the formatter to cross-check LLM scores
 *
 * These do NOT replace the LLM's evaluation — they just provide
 * structured signals that make the LLM's job easier and the output
 * more consistent.
 */

import {
  InterviewData,
  TranscriptMessage,
  CodeIssue,
  TranscriptIssue,
} from './types';

export interface AnalysisSignals {
  codeIsEmpty: boolean;
  codeIsStarterOnly: boolean;
  codeLineCount: number;
  codeNonEmptyLineCount: number;
  transcriptIsEmpty: boolean;
  candidateMessageCount: number;
  totalMessageCount: number;
  averageCandidateMessageLength: number;
  submissionCount: number;
  hasMultipleSubmissions: boolean;
  obviousCodeIssues: CodeIssue[];
  obviousTranscriptIssues: TranscriptIssue[];
}

export function analyzeCode(code: string, starterCode?: string): {
  isEmpty: boolean;
  isStarterOnly: boolean;
  lineCount: number;
  nonEmptyLineCount: number;
  issues: CodeIssue[];
} {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter((l) => l.trim().length > 0);
  const commentOnlyLines = nonEmptyLines.filter(
    (l) =>
      l.trim().startsWith('//') ||
      l.trim().startsWith('*') ||
      l.trim().startsWith('/*') ||
      l.trim().startsWith('/**'),
  );
  const codeLines = nonEmptyLines.filter(
    (l) =>
      !l.trim().startsWith('//') &&
      !l.trim().startsWith('*') &&
      !l.trim().startsWith('/*') &&
      !l.trim().startsWith('/**'),
  );

  const issues: CodeIssue[] = [];

  const isEmpty = codeLines.length === 0;
  const isStarterOnly =
    !isEmpty &&
    starterCode !== undefined &&
    code.trim() === starterCode.trim();

  if (isEmpty) {
    issues.push({
      line_number: 1,
      code_snippet: 'N/A',
      issue: 'No implementation — code is empty or contains only comments',
      suggestion: 'Implement a solution to the given problem',
      severity: 'error',
    });
  }

  if (isStarterOnly) {
    issues.push({
      line_number: 1,
      code_snippet: code.split('\n')[0]?.substring(0, 50) || 'N/A',
      issue:
        'No implementation — only starter code was submitted without modifications',
      suggestion:
        'Replace the TODO/placeholder comments with actual logic',
      severity: 'error',
    });
  }

  return {
    isEmpty,
    isStarterOnly,
    lineCount: lines.length,
    nonEmptyLineCount: nonEmptyLines.length,
    issues,
  };
}

export function analyzeTranscript(
  messages: TranscriptMessage[],
): {
  isEmpty: boolean;
  candidateCount: number;
  totalCount: number;
  avgCandidateLength: number;
  issues: TranscriptIssue[];
} {
  const candidateMessages = messages.filter((m) => m.role === 'user');
  const isEmpty = messages.length === 0;
  const candidateCount = candidateMessages.length;
  const totalCount = messages.length;

  const avgCandidateLength =
    candidateCount > 0
      ? candidateMessages.reduce((sum, m) => sum + m.content.length, 0) /
        candidateCount
      : 0;

  const issues: TranscriptIssue[] = [];

  if (isEmpty) {
    issues.push({
      quote: 'Silence',
      issue:
        'No verbal communication during the entire interview session',
      what_should_have_been_said:
        'Candidate should explain their approach before coding and narrate their thought process throughout',
      category: 'communication',
    });
  } else if (candidateCount === 0) {
    issues.push({
      quote: 'No candidate responses',
      issue:
        'The candidate did not speak at all — only the interviewer spoke',
      what_should_have_been_said:
        'Acknowledge the problem, state your approach, and respond to questions',
      category: 'communication',
    });
  } else if (candidateCount <= 2) {
    issues.push({
      quote:
        candidateMessages[0]?.content?.substring(0, 80) || 'Brief response',
      issue:
        'Very limited communication — only 1-2 candidate responses in the entire session',
      what_should_have_been_said:
        'Engage in a back-and-forth dialogue: explain approach, answer follow-ups, narrate coding',
      category: 'communication',
    });
  }

  if (candidateCount > 0 && avgCandidateLength < 20) {
    issues.push({
      quote: candidateMessages[0]?.content || '',
      issue:
        'Candidate responses are extremely short (average < 20 chars) — indicates minimal engagement',
      what_should_have_been_said:
        'Provide more detailed explanations with reasoning, not just one-word answers',
      category: 'communication',
    });
  }

  return {
    isEmpty,
    candidateCount,
    totalCount,
    avgCandidateLength: Math.round(avgCandidateLength),
    issues,
  };
}

export function analyzeInterview(data: InterviewData): AnalysisSignals {
  const codeAnalysis = analyzeCode(data.code, data.question.description);
  const transcriptAnalysis = analyzeTranscript(data.transcript);

  return {
    codeIsEmpty: codeAnalysis.isEmpty,
    codeIsStarterOnly: codeAnalysis.isStarterOnly,
    codeLineCount: codeAnalysis.lineCount,
    codeNonEmptyLineCount: codeAnalysis.nonEmptyLineCount,
    transcriptIsEmpty: transcriptAnalysis.isEmpty,
    candidateMessageCount: transcriptAnalysis.candidateCount,
    totalMessageCount: transcriptAnalysis.totalCount,
    averageCandidateMessageLength: transcriptAnalysis.avgCandidateLength,
    submissionCount: data.submissions.length,
    hasMultipleSubmissions: data.submissions.length > 1,
    obviousCodeIssues: codeAnalysis.issues,
    obviousTranscriptIssues: transcriptAnalysis.issues,
  };
}

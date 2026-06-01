/**
 * Formatter — Validates and Normalizes LLM Output for the Frontend
 *
 * The LLM sometimes returns incomplete or malformed data. This module:
 *   1. Validates every field in the RawLLMResponse
 *   2. Clamps scores to the 1-10 range
 *   3. Fills missing optional fields with safe defaults
 *   4. Adds metadata (timestamps, counts) for the frontend
 *   5. Ensures the output matches the exact shape the result page expects
 *
 * If validation fails entirely, it produces a fallback report so the
 * frontend can still render something useful instead of crashing.
 */

import {
  RawLLMResponse,
  DynamicReport,
  ReportMetadata,
  DimensionScores,
  CodeIssue,
  TranscriptIssue,
  InterviewData,
} from './types';
import { computeWeightedScore } from './dimensions';
import { AnalysisSignals } from './analyzer';

function clampScore(value: any, min: number = 1, max: number = 10): number {
  if (typeof value !== 'number' || isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function validateDimensionScores(
  raw: any,
): DimensionScores {
  const defaults: DimensionScores = {
    problem_solving: 1,
    algorithmic_thinking: 1,
    code_implementation: 1,
    testing: 1,
    time_management: 1,
    communication: 1,
  };

  if (!raw || typeof raw !== 'object') return defaults;

  return {
    problem_solving: clampScore(raw.problem_solving),
    algorithmic_thinking: clampScore(raw.algorithmic_thinking),
    code_implementation: clampScore(raw.code_implementation),
    testing: clampScore(raw.testing),
    time_management: clampScore(raw.time_management),
    communication: clampScore(raw.communication),
  };
}

function validateCodeIssues(raw: any[]): CodeIssue[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((issue) => issue && typeof issue === 'object')
    .map((issue) => ({
      line_number: typeof issue.line_number === 'number' ? issue.line_number : 1,
      code_snippet: String(issue.code_snippet || 'N/A'),
      issue: String(issue.issue || 'Unspecified issue'),
      suggestion: String(issue.suggestion || 'No suggestion provided'),
      severity:
        issue.severity === 'error' || issue.severity === 'warning' || issue.severity === 'info'
          ? issue.severity
          : 'info',
    }));
}

function validateTranscriptIssues(raw: any[]): TranscriptIssue[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((issue) => issue && typeof issue === 'object')
    .map((issue) => ({
      quote: String(issue.quote || 'N/A'),
      issue: String(issue.issue || 'Unspecified issue'),
      what_should_have_been_said: String(
        issue.what_should_have_been_said || 'No suggestion provided',
      ),
      category:
        issue.category === 'communication' ||
        issue.category === 'technical' ||
        issue.category === 'behavior'
          ? issue.category
          : 'communication',
    }));
}

function validateMarkdown(raw: any): string {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return '### Summary\nReport generation produced no feedback content.\n\n### Strengths\n- N/A\n\n### Areas for Improvement\n- N/A\n\n### Problem-Solving\n- N/A\n\n### Communication\n- N/A\n\n### Code Review\n- N/A';
  }
  return raw;
}

function buildMetadata(
  data: InterviewData,
  signals: AnalysisSignals,
): ReportMetadata {
  return {
    generatedAt: new Date(),
    model: 'llama-3.3-70b-versatile',
    questionTitle: data.question.title,
    questionCategory: data.question.category,
    durationMinutes: data.durationMinutes ?? null,
    totalSubmissions: data.submissions.length,
    transcriptLength: signals.candidateMessageCount,
    codeLineCount: signals.codeNonEmptyLineCount,
  };
}

export function formatReport(
  raw: RawLLMResponse,
  data: InterviewData,
  signals: AnalysisSignals,
): DynamicReport {
  const dimensionScores = validateDimensionScores(raw.dimension_scores);

  const computedOverall = computeWeightedScore(dimensionScores as unknown as Record<string, number>);
  const llmOverall = clampScore(raw.overall_score);
  const overallScore = Math.round((computedOverall + llmOverall) / 2 * 10) / 10;

  return {
    overall_score: Math.min(10, Math.max(1, Math.round(overallScore))),
    correctness: typeof raw.correctness === 'boolean' ? raw.correctness : false,
    dimension_scores: dimensionScores,
    code_issues: validateCodeIssues(raw.code_issues),
    transcript_issues: validateTranscriptIssues(raw.transcript_issues),
    feedback_markdown: validateMarkdown(raw.feedback_markdown),
    metadata: buildMetadata(data, signals),
  };
}

export function createFallbackReport(
  data: InterviewData,
  signals: AnalysisSignals,
  errorMessage: string,
): DynamicReport {
  return {
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
    code_issues: signals.obviousCodeIssues,
    transcript_issues: signals.obviousTranscriptIssues,
    feedback_markdown: `### Summary\nReport generation failed: ${errorMessage}\n\n### Strengths\n- N/A\n\n### Areas for Improvement\n- N/A\n\n### Problem-Solving\n- N/A\n\n### Communication\n- N/A\n\n### Code Review\n- N/A`,
    metadata: buildMetadata(data, signals),
  };
}

export { validateDimensionScores, validateCodeIssues, validateTranscriptIssues, clampScore };

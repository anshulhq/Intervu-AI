import {
  validateDimensionScores,
  validateCodeIssues,
  validateTranscriptIssues,
  clampScore,
  formatReport,
  createFallbackReport,
} from '../formatter';
import { RawLLMResponse, InterviewData, DimensionScores } from '../types';
import { AnalysisSignals } from '../analyzer';

const baseSignals: AnalysisSignals = {
  codeIsEmpty: false,
  codeIsStarterOnly: false,
  codeLineCount: 15,
  codeNonEmptyLineCount: 12,
  transcriptIsEmpty: false,
  candidateMessageCount: 5,
  totalMessageCount: 10,
  averageCandidateMessageLength: 85,
  submissionCount: 1,
  hasMultipleSubmissions: false,
  obviousCodeIssues: [],
  obviousTranscriptIssues: [],
};

const baseData: InterviewData = {
  sessionId: 'test-session',
  question: {
    title: 'Two Sum',
    description: 'Find two numbers adding to target.',
    examples: [],
    difficulty: 'easy',
    category: 'Arrays & Hashing',
    tags: ['array'],
  },
  code: 'class Solution { public int[] twoSum(int[] nums, int t) { return null; } }',
  language: 'java',
  transcript: [],
  submissions: [],
};

describe('clampScore', () => {
  it('clamps values to 1-10', () => {
    expect(clampScore(15)).toBe(10);
    expect(clampScore(-3)).toBe(1);
    expect(clampScore(7)).toBe(7);
    expect(clampScore(0)).toBe(1);
  });

  it('handles NaN and non-numbers', () => {
    expect(clampScore(NaN)).toBe(1);
    expect(clampScore('abc' as any)).toBe(1);
    expect(clampScore(undefined)).toBe(1);
  });
});

describe('validateDimensionScores', () => {
  it('returns defaults for null input', () => {
    const result = validateDimensionScores(null);
    expect(result.problem_solving).toBe(1);
    expect(result.communication).toBe(1);
  });

  it('clamps out-of-range scores', () => {
    const result = validateDimensionScores({
      problem_solving: 15,
      algorithmic_thinking: -2,
      code_implementation: 8,
      testing: 5,
      time_management: 10,
      communication: 3,
    });
    expect(result.problem_solving).toBe(10);
    expect(result.algorithmic_thinking).toBe(1);
    expect(result.code_implementation).toBe(8);
  });
});

describe('validateCodeIssues', () => {
  it('handles non-array input', () => {
    expect(validateCodeIssues(null as any)).toEqual([]);
    expect(validateCodeIssues(undefined as any)).toEqual([]);
  });

  it('filters null entries and fills defaults', () => {
    const result = validateCodeIssues([
      null as any,
      { line_number: 5, issue: 'bad code' },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].line_number).toBe(5);
    expect(result[0].severity).toBe('info');
    expect(result[0].code_snippet).toBe('N/A');
  });

  it('preserves valid severity levels', () => {
    const result = validateCodeIssues([
      { line_number: 1, code_snippet: 'x', issue: 'i', suggestion: 's', severity: 'error' },
      { line_number: 2, code_snippet: 'y', issue: 'i', suggestion: 's', severity: 'warning' },
      { line_number: 3, code_snippet: 'z', issue: 'i', suggestion: 's', severity: 'invalid' },
    ]);
    expect(result[0].severity).toBe('error');
    expect(result[1].severity).toBe('warning');
    expect(result[2].severity).toBe('info');
  });
});

describe('validateTranscriptIssues', () => {
  it('handles non-array input', () => {
    expect(validateTranscriptIssues(null as any)).toEqual([]);
  });

  it('fills defaults and validates category', () => {
    const result = validateTranscriptIssues([
      { quote: 'I said hashmap', issue: 'wrong term', what_should_have_been_said: 'hash set', category: 'technical' },
      { quote: 'x', issue: 'y', what_should_have_been_said: 'z', category: 'invalid_cat' },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('technical');
    expect(result[1].category).toBe('communication');
  });
});

describe('formatReport', () => {
  it('formats a valid LLM response into a DynamicReport', () => {
    const raw: RawLLMResponse = {
      overall_score: 7,
      correctness: true,
      dimension_scores: {
        problem_solving: 8,
        algorithmic_thinking: 7,
        code_implementation: 7,
        testing: 5,
        time_management: 6,
        communication: 8,
      },
      code_issues: [],
      transcript_issues: [],
      feedback_markdown: '### Summary\nGood work.',
    };

    const report = formatReport(raw, baseData, baseSignals);

    expect(report.overall_score).toBeGreaterThanOrEqual(1);
    expect(report.overall_score).toBeLessThanOrEqual(10);
    expect(report.correctness).toBe(true);
    expect(report.dimension_scores.problem_solving).toBe(8);
    expect(report.metadata.questionTitle).toBe('Two Sum');
    expect(report.metadata.questionCategory).toBe('Arrays & Hashing');
    expect(report.metadata.generatedAt).toBeInstanceOf(Date);
  });

  it('handles malformed LLM response gracefully', () => {
    const raw = {} as RawLLMResponse;
    const report = formatReport(raw, baseData, baseSignals);

    expect(report.correctness).toBe(false);
    expect(report.dimension_scores.problem_solving).toBe(1);
    expect(report.code_issues).toEqual([]);
    expect(report.feedback_markdown).toContain('no feedback content');
  });
});

describe('createFallbackReport', () => {
  it('creates a zero-score fallback with error message', () => {
    const report = createFallbackReport(baseData, baseSignals, 'LLM timeout');

    expect(report.overall_score).toBe(0);
    expect(report.correctness).toBe(false);
    expect(report.dimension_scores.problem_solving).toBe(0);
    expect(report.feedback_markdown).toContain('LLM timeout');
    expect(report.metadata.questionTitle).toBe('Two Sum');
  });

  it('includes obvious issues from pre-analysis', () => {
    const signalsWithIssues: AnalysisSignals = {
      ...baseSignals,
      obviousCodeIssues: [
        { line_number: 1, code_snippet: 'N/A', issue: 'No code', suggestion: 'Write code', severity: 'error' as const },
      ],
      obviousTranscriptIssues: [
        { quote: 'Silence', issue: 'No speech', what_should_have_been_said: 'Talk', category: 'communication' as const },
      ],
    };

    const report = createFallbackReport(baseData, signalsWithIssues, 'error');
    expect(report.code_issues).toHaveLength(1);
    expect(report.transcript_issues).toHaveLength(1);
  });
});

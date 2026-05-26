/**
 * Dynamic Report System — Type Definitions
 *
 * All TypeScript interfaces that define the shape of data flowing through
 * the dynamic report generation pipeline.
 *
 * Pipeline flow:
 *   InterviewData → PromptBuilder → LLM → RawLLMResponse → Formatter → DynamicReport
 */

export interface QuestionContext {
  title: string;
  description: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
}

export interface TranscriptMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp?: Date;
}

export interface SubmissionSnapshot {
  questionIndex: number;
  code: string;
  transcript: TranscriptMessage[];
  submittedAt: Date;
}

export interface InterviewData {
  sessionId: string;
  question: QuestionContext;
  code: string;
  language: string;
  transcript: TranscriptMessage[];
  submissions: SubmissionSnapshot[];
  durationMinutes?: number;
}

export interface DimensionScore {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  rubric: string;
}

export interface CodeIssue {
  line_number: number;
  code_snippet: string;
  issue: string;
  suggestion: string;
  severity: 'error' | 'warning' | 'info';
}

export interface TranscriptIssue {
  quote: string;
  issue: string;
  what_should_have_been_said: string;
  category: 'communication' | 'technical' | 'behavior';
}

export interface DimensionScores {
  problem_solving: number;
  algorithmic_thinking: number;
  code_implementation: number;
  testing: number;
  time_management: number;
  communication: number;
}

export interface RawLLMResponse {
  overall_score: number;
  correctness: boolean;
  dimension_scores: DimensionScores;
  code_issues: CodeIssue[];
  transcript_issues: TranscriptIssue[];
  feedback_markdown: string;
}

export interface DynamicReport {
  overall_score: number;
  correctness: boolean;
  dimension_scores: DimensionScores;
  code_issues: CodeIssue[];
  transcript_issues: TranscriptIssue[];
  feedback_markdown: string;
  metadata: ReportMetadata;
}

export interface ReportMetadata {
  generatedAt: Date;
  model: string;
  questionTitle: string;
  questionCategory: string;
  durationMinutes: number | null;
  totalSubmissions: number;
  transcriptLength: number;
  codeLineCount: number;
}

export type SeverityLevel = 'error' | 'warning' | 'info';

export type EvaluationDimension =
  | 'problem_solving'
  | 'algorithmic_thinking'
  | 'code_implementation'
  | 'testing'
  | 'time_management'
  | 'communication';

export interface DimensionDefinition {
  key: EvaluationDimension;
  label: string;
  description: string;
  weight: number;
  categorySpecificGuidance: Record<string, string>;
}

export interface PromptContext {
  systemPrompt: string;
  userPrompt: string;
}

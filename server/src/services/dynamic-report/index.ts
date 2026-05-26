/**
 * Dynamic Report System — Orchestrator
 *
 * Single entry point that wires together the full pipeline:
 *   InterviewData → Analyzer → PromptBuilder → Generator → Formatter → DynamicReport
 *
 * This module is standalone. It does NOT touch the existing
 * reportGenerator.ts or any Express routes. Integration comes later.
 */

import {
  InterviewData,
  DynamicReport,
} from './types';
import { analyzeInterview, AnalysisSignals } from './analyzer';
import { generateRawReport } from './generator';
import { formatReport, createFallbackReport } from './formatter';

export type { InterviewData, DynamicReport } from './types';
export { analyzeInterview } from './analyzer';
export { buildPrompt } from './promptBuilder';
export { EVALUATION_DIMENSIONS } from './dimensions';

export interface DynamicReportResult {
  report: DynamicReport;
  signals: AnalysisSignals;
  success: boolean;
  error: string | null;
}

/**
 * generateDynamicReport — The main public function.
 *
 * Takes structured interview data, runs the full evaluation pipeline,
 * and returns a validated DynamicReport that matches the frontend's
 * expected JSON shape.
 *
 * @param data - All interview artifacts (question, code, transcript, submissions)
 * @returns DynamicReportResult with the report, analysis signals, and status
 */
export async function generateDynamicReport(
  data: InterviewData,
): Promise<DynamicReportResult> {
  console.log(
    `[DynamicReport] Starting for session=${data.sessionId}, question="${data.question.title}"`,
  );

  const signals = analyzeInterview(data);

  console.log(
    `[DynamicReport] Pre-analysis: codeEmpty=${signals.codeIsEmpty}, starterOnly=${signals.codeIsStarterOnly}, transcriptEmpty=${signals.transcriptIsEmpty}, candidateMsgs=${signals.candidateMessageCount}`,
  );

  if (signals.codeIsEmpty && signals.transcriptIsEmpty) {
    console.log(
      `[DynamicReport] Session has no code and no transcript — generating minimal fallback.`,
    );
    const report = createFallbackReport(
      data,
      signals,
      'No code submitted and no verbal communication during the session',
    );
    return { report, signals, success: false, error: 'No data to evaluate' };
  }

  const result = await generateRawReport(data);

  if (!result.success || !result.data) {
    console.error(
      `[DynamicReport] LLM generation failed: ${result.error}`,
    );
    const report = createFallbackReport(data, signals, result.error || 'LLM call failed');
    return { report, signals, success: false, error: result.error };
  }

  const report = formatReport(result.data, data, signals);

  console.log(
    `[DynamicReport] Complete: score=${report.overall_score}, correct=${report.correctness}, issues=${report.code_issues.length} code + ${report.transcript_issues.length} transcript`,
  );

  return { report, signals, success: true, error: null };
}

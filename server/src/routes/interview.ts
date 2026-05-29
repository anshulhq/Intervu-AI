/**
 * Interview Routes — Question Selection, Session Lifecycle & Submission Handlers
 *
 * This module defines all Express routes that power the interview experience:
 *
 *   POST /start              → Create a new session with randomly selected questions
 *   POST /submit-question    → Submit current question answer & advance to next
 *   POST /advance-question   → Agent-triggered question advancement (no code save)
 *   POST /submit             → Final submission triggering report generation
 *   POST /livekit/token      → Generate LiveKit access token for voice channel
 *   POST /save-analysis      → Webhook for Python agent to save its evaluation
 *   GET  /questions          → List all questions in the bank (metadata only)
 *   GET  /session/:id        → Fetch current session state (polling endpoint)
 *
 * Question Selection Flow:
 *   1. POST /start calls selectRandomQuestions() which shuffles QUESTION_BANK
 *      using Fisher-Yates and slices the first 2 questions.
 *   2. The first question becomes the "active" question immediately.
 *   3. All selected questions are persisted in the Session document so the
 *      agent can later decide whether to advance to question 2 based on
 *      the candidate's performance.
 *   4. The agent calls POST /advance-question when it decides the candidate
 *      needs a second problem, or the candidate can use POST /submit-question
 *      to manually advance.
 */

import express, { Request, Response } from 'express';
import Session from '../models/Session';
import { AccessToken } from 'livekit-server-sdk';
import { generateDynamicReport } from '../services/dynamic-report';
import type { InterviewData } from '../services/dynamic-report';
import { QUESTION_BANK, QuestionDef } from '../data/questions';

const router = express.Router();

import redis from '../lib/redis';

// ============================================================================
// DYNAMIC QUESTION SELECTION - Randomizes question order for each session
// ============================================================================

/**
 * Fisher-Yates shuffle algorithm for randomizing question order.
 *
 * Why Fisher-Yates? It produces an unbiased permutation — every possible
 * ordering is equally likely. This prevents question-order bias across
 * candidates and makes it harder to cheat by memorizing a fixed sequence.
 *
 * Creates a new array (does not mutate the input) so QUESTION_BANK
 * remains stable across concurrent requests.
 *
 * @param array - Array to shuffle
 * @returns Shuffled copy of the array
 */
function shuffleQuestions<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Select a random subset of questions from the full question pool.
 *
 * This is called once when a session starts (POST /start). It:
 *   1. Shuffles the entire QUESTION_BANK
 *   2. Takes the first `count` entries (default: 2)
 *   3. Returns them as the session's question set
 *
 * The count is capped at the pool size to avoid slicing beyond the array.
 * These selected questions are then stored in MongoDB via the Session model
 * and cached in the in-memory sessionCache for fast reads.
 *
 * @param pool - Full question pool (typically QUESTION_BANK)
 * @param count - Number of questions to select (default: 2)
 * @returns Randomly selected and shuffled questions
 */
function selectRandomQuestions(pool: QuestionDef[], count: number = 2): QuestionDef[] {
  const shuffled = shuffleQuestions(pool);
  return shuffled.slice(0, Math.min(count, pool.length));
}

/**
 * In-memory session cache (Map<sessionId, sessionObject>).
 *
 * Purpose: Avoid hitting MongoDB on every poll/transcript update during
 * an active interview. The session is written to both this cache and
 * MongoDB on every state change so they stay in sync.
 *
 * Limitation: This is per-process — if the server restarts, the cache
 * is rebuilt from MongoDB on the next GET /session/:id call.
 */
const sessionCache = new Map<string, any>();

// ============================================================================
// POST /livekit/token — Generate a LiveKit access token for the voice channel
// ============================================================================
// This is called by the frontend after the user clicks "Begin Session".
// The token allows the candidate's browser to connect to the LiveKit room
// where the Python voice agent is already waiting. The room name equals
// the sessionId, creating a 1:1 mapping between interview sessions and
// voice rooms.
router.post('/livekit/token', async (req: Request, res: Response) => {
  const { sessionId, participantName } = req.body;

  if (!sessionId || !participantName) {
    return res.status(400).json({ error: 'sessionId and participantName are required' });
  }

  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return res.status(500).json({ error: 'LiveKit configuration is missing' });
    }

    // Create a JWT access token granting the participant permission to
    // join the room, publish their microphone audio, and subscribe to
    // the agent's audio track.
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    at.addGrant({
      roomJoin: true,
      room: sessionId,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    console.log(`[Token] Generated for Room: ${sessionId}, Participant: ${participantName}`);
    console.log(`[Token] Using LiveKit URL: ${wsUrl}`);

    res.json({
      token,
      url: wsUrl,
    });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// ============================================================================
// POST /save-analysis — Webhook called by the Python Agent to save the final report
// ============================================================================
// After the voice interview ends, the Python agent may independently generate
// an evaluation report and POST it here. This is an alternative to the
// Node-based reportGenerator — the system supports both paths.
router.post('/save-analysis', async (req: Request, res: Response) => {
  const { sessionId, analysis } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Overwrite any existing feedback with the agent's analysis
    // and mark the session as completed so the frontend shows the report.
    session.feedback = analysis;
    session.status = 'completed';

    await session.save();
    sessionCache.set(sessionId, session.toObject());

    console.log(`[Analysis] Report saved for session ${sessionId} (from Agent)`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving analysis:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// ============================================================================
// GET /questions — List all available questions in the bank (metadata only)
// ============================================================================
// Returns a lightweight summary (id, title, difficulty, category, tags) for
// each question. Used by the frontend landing page to show available topics.
// Does NOT include starterCode or description to keep the payload small.
router.get('/questions', (_req: Request, res: Response) => {
  const questions = QUESTION_BANK.map(({ id, title, difficulty, category, tags }) => ({
    id,
    title,
    difficulty,
    category,
    tags,
  }));
  res.json({ questions, total: questions.length });
});

// ============================================================================
// POST /start — Create a new interview session with random questions
// ============================================================================
// This is the main entry point for the interview flow. It:
//   1. Selects 2 random questions from QUESTION_BANK (or fewer if the bank is smaller)
//   2. Creates/overwrites a session document in MongoDB with:
//      - The full list of selected questions
//      - The first question as the "active" question
//      - The starter code pre-loaded in the editor
//   3. Caches the session in memory for fast access
//   4. Returns the active question details to the frontend
//
// Note: Currently uses a fixed sessionId ("intervu-ai-interview") meaning
// only one session can exist at a time. This is a known limitation for
// the MVP — the upsert on findOneAndUpdate ensures the session is refreshed.
router.post('/start', async (req: Request, res: Response) => {
  try {
    // Select up to 2 random questions from the bank for this session
    const allQuestions = selectRandomQuestions(QUESTION_BANK, Math.min(QUESTION_BANK.length, 2));
    const numQuestionsToShow = allQuestions.length;

    // Fixed session ID — only one active interview at a time (MVP limitation)
    const sessionId = "intervu-ai-interview";

    // The first question becomes the active question shown to the candidate
    const firstQuestion = allQuestions[0];

    console.log(`[Dynamic Questions] Selected questions: ${allQuestions.map(q => q.title).join(', ')}`);
    console.log(`[Dynamic Questions] Starting with: "${firstQuestion.title}"`);

    // Build the full session document to persist in MongoDB.
    // `questions` stores ALL selected questions for later advancement.
    // `question` is the currently active question the candidate sees.
    // `code` is initialized with the starter code of the first question.
    const sessionData = {
      sessionId,
      questions: allQuestions,
      currentQuestionIndex: 0,
      submissions: [],
      question: {
        title: firstQuestion.title,
        description: firstQuestion.description,
        examples: firstQuestion.examples,
        starterCode: firstQuestion.starterCode,
        language: firstQuestion.language,
        fileName: firstQuestion.fileName,
        visualization: firstQuestion.visualization,
        difficulty: firstQuestion.difficulty,
        category: firstQuestion.category,
        tags: firstQuestion.tags,
      },
      code: firstQuestion.starterCode,
      language: firstQuestion.language,
      transcript: [],
      status: 'active'
    };

    // Upsert: create the session or replace the existing one (since sessionId is fixed)
    const session = await Session.findOneAndUpdate(
      { sessionId },
      sessionData,
      { new: true, upsert: true }
    );

    // Cache in memory so subsequent requests don't need a DB round-trip
    sessionCache.set(sessionId, sessionData);
    console.log(`[Cache] Session ${sessionId} cached. Agent will decide if second question is needed.`);

    // Response sent to the frontend — includes only what's needed to render
    // the first question in the editor and problem panel.
    const response = {
      sessionId,
      question: session.question,
      totalQuestions: numQuestionsToShow,
      currentQuestionIndex: 0,
      language: firstQuestion.language,
      fileName: firstQuestion.fileName,
    };
    console.log(`[API /start] Sending response:`, JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});


// ============================================================================
// POST /submit-question — Submit current question answer & advance to next
// ============================================================================
// Called by the frontend when the candidate clicks "Next" to move from one
// question to the next. This:
//   1. Saves the current code + transcript as a submission record
//   2. If more questions remain: advances to the next question, resets transcript
//   3. If all questions are done: marks session as completed
//
// After completion, the Python agent independently generates a report via
// POST /save-analysis — this endpoint does NOT trigger report generation.
router.post('/submit-question', async (req: Request, res: Response) => {
  const { sessionId, code, transcript = [] } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentIndex = session.currentQuestionIndex;
    const totalQuestions = session.questions.length;

    // Save the candidate's code and transcript for this question as a
    // submission record. This is used by the report generator to evaluate
    // per-question performance.
    session.submissions.push({
      questionIndex: currentIndex,
      code: code,
      transcript: transcript,
      submittedAt: new Date()
    });

    // Check if there are more questions remaining in the session
    if (currentIndex + 1 < totalQuestions) {
      // Advance to the next question:
      // - Update the active question in the session
      // - Reset the code to the next question's starter code
      // - Clear the transcript so it starts fresh for the new question
      const nextQuestion = session.questions[currentIndex + 1];
      session.currentQuestionIndex = currentIndex + 1;
      session.question = nextQuestion;
      session.code = nextQuestion.starterCode;
      session.transcript = []; // Reset transcript for new question

      await session.save();
      sessionCache.set(sessionId, session.toObject());

      console.log(`[Session] Advanced to question ${currentIndex + 2}/${totalQuestions}`);

      res.json({
        status: 'next_question',
        question: nextQuestion,
        currentQuestionIndex: currentIndex + 1,
        totalQuestions: totalQuestions,
        message: `Moving to question ${currentIndex + 2} of ${totalQuestions}`
      });
    } else {
      // All questions have been answered — mark the session as completed.
      // The Python agent will detect the session end and generate the report
      // via POST /save-analysis. We do NOT evaluate here.
      session.code = code;
      session.transcript = transcript;
      session.status = 'completed';

      console.log("Session completed. Waiting for Agent analysis...");

      session.status = 'completed';
      await session.save();
      sessionCache.set(sessionId, session.toObject());

      res.json({
        status: 'completed',
        message: 'Interview completed! Generating report...'
      });
    }
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Failed to submit question' });
  }
});

// ============================================================================
// POST /advance-question — Agent-triggered question advancement
// ============================================================================
// Unlike /submit-question, this is called by the Python voice agent (not the
// frontend) when it autonomously decides the candidate needs a second question.
// Key difference: it does NOT save code/transcript — it only advances the
// active question pointer. The transcript is intentionally preserved to keep
// the conversation flowing naturally across question boundaries.
router.post('/advance-question', async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentIndex = session.currentQuestionIndex;
    const totalQuestions = session.questions.length;

    if (currentIndex + 1 < totalQuestions) {
      // Advance to the next question without saving any code/transcript.
      // The transcript is deliberately NOT reset here (unlike /submit-question)
      // because the agent's conversation should flow continuously.
      const nextQuestion = session.questions[currentIndex + 1];
      session.currentQuestionIndex = currentIndex + 1;
      session.question = nextQuestion;
      session.code = nextQuestion.starterCode;

      await session.save();
      sessionCache.set(sessionId, session.toObject());

      console.log(`[Agent Decision] Advanced to question ${currentIndex + 2}/${totalQuestions}`);

      res.json({
        status: 'advanced',
        question: nextQuestion,
        currentQuestionIndex: currentIndex + 1,
        totalQuestions: totalQuestions,
        message: `Agent advanced to question ${currentIndex + 2}`
      });
    } else {
      res.json({
        status: 'no_more_questions',
        message: 'No more questions available'
      });
    }
  } catch (error) {
    console.error('Error advancing question:', error);
    res.status(500).json({ error: 'Failed to advance question' });
  }
});


// ============================================================================
// POST /submit — Final submission with dynamic report generation
// ============================================================================
// Primary submission endpoint. This endpoint:
//   1. Saves the final code and transcript to the session
//   2. Triggers the dynamic report generator (dynamic-report/) which uses
//      pre-analysis, category-adaptive prompts, and weighted dimensions
//      to produce a forensic evaluation via Groq LLM
//   3. Returns immediately — the client polls GET /session/:id for the report
//
// The dynamic report pipeline:
//   InterviewData → Analyzer → PromptBuilder → Generator → Formatter → DynamicReport
//
// Alternative path: The Python voice agent can also generate reports independently
// and save them via POST /save-analysis. Both paths write to the same `feedback` field.
router.post('/submit', async (req: Request, res: Response) => {
  const { sessionId, code, transcript = [] } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.code = code;
    session.transcript = transcript;
    session.status = 'completed';

    await session.save();

    // Update cache
    sessionCache.set(sessionId, session.toObject());

    console.log(`[API /submit] Session ${sessionId} submitted. Triggering dynamic report generation...`);

    const reportPromise = (async () => {
      try {
        const freshSession = await Session.findOne({ sessionId });
        if (!freshSession) return;

        const interviewData: InterviewData = {
          sessionId: freshSession.sessionId,
          question: {
            title: freshSession.question?.title || 'Unknown',
            description: freshSession.question?.description || '',
            examples: freshSession.question?.examples || [],
            difficulty: (freshSession.question as any)?.difficulty || 'medium',
            category: (freshSession.question as any)?.category || 'General',
            tags: (freshSession.question as any)?.tags || [],
          },
          code: freshSession.code || '',
          language: freshSession.language || 'java',
          transcript: (freshSession.transcript || []).map((t: any) => ({
            role: t.role,
            content: t.content,
          })),
          submissions: (freshSession.submissions || []).map((s: any) => ({
            questionIndex: s.questionIndex,
            code: s.code,
            transcript: (s.transcript || []).map((t: any) => ({
              role: t.role,
              content: t.content,
            })),
            submittedAt: s.submittedAt,
          })),
        };

        const result = await generateDynamicReport(interviewData);

        freshSession.feedback = {
          overall_score: result.report.overall_score,
          correctness: result.report.correctness,
          dimension_scores: result.report.dimension_scores,
          code_issues: result.report.code_issues,
          transcript_issues: result.report.transcript_issues,
          feedback_markdown: result.report.feedback_markdown,
        };
        freshSession.status = 'completed';
        await freshSession.save();
        sessionCache.set(sessionId, freshSession.toObject());

        console.log(`[DynamicReport] Saved report for ${sessionId}: score=${result.report.overall_score}, success=${result.success}`);
      } catch (err) {
        console.error(`[DynamicReport] Failed for ${sessionId}:`, err);
      }
    })();

    reportPromise.catch((err) => {
      console.error(`[API /submit] Dynamic report generation error for ${sessionId}:`, err);
    });

    res.json({
      status: 'completed',
      message: 'Session submitted. Analysis pending.'
    });
  } catch (error) {
    console.error('Error submitting session:', error);
    res.status(500).json({ error: 'Failed to submit session' });
  }
});

// ============================================================================
// GET /session/:sessionId — Fetch current session state (polling endpoint)
// ============================================================================
// The frontend polls this endpoint after submission to check if the report
// has been generated. Once session.feedback is populated (by either the
// agent's /save-analysis call or the Node report generator), the frontend
// redirects to the results page.
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionObj = session.toObject();
    sessionCache.set(sessionId, sessionObj);

    // Include computed fields for the frontend
    res.json({
      ...sessionObj,
      totalQuestions: session.questions?.length || 1,
      currentQuestionIndex: session.currentQuestionIndex || 0
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

export default router;

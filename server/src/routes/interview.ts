import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session';
import { AccessToken } from 'livekit-server-sdk';
import { generateReport } from '../services/reportGenerator';
import { QUESTION_BANK, QuestionDef } from '../data/questions';

const router = express.Router();

import redis from '../lib/redis';

// ============================================================================
// DYNAMIC QUESTION SELECTION - Randomizes question order for each session
// ============================================================================

/**
 * Fisher-Yates shuffle algorithm for randomizing question order
 * @param array - Array to shuffle (creates a new shuffled array, doesn't mutate)
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
 * Select a random subset of questions from the pool
 * @param pool - Full question pool
 * @param count - Number of questions to select (default: 2)
 * @returns Randomly selected and shuffled questions
 */
function selectRandomQuestions(pool: QuestionDef[], count: number = 2): QuestionDef[] {
  const shuffled = shuffleQuestions(pool);
  return shuffled.slice(0, Math.min(count, pool.length));
}

// In-memory cache for sessions
const sessionCache = new Map<string, any>();

// POST /livekit/token
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
// POST /save-analysis - Called by Python Agent to save the final report
router.post('/save-analysis', async (req: Request, res: Response) => {
  const { sessionId, analysis } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.feedback = analysis;
    // Mark as completed if not already
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

// GET /questions - List all available questions in the bank
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

// POST /start
router.post('/start', async (req: Request, res: Response) => {
  try {
    const allQuestions = selectRandomQuestions(QUESTION_BANK, Math.min(QUESTION_BANK.length, 2));
    const numQuestionsToShow = allQuestions.length;

    const sessionId = "intervu-ai-interview";

    const firstQuestion = allQuestions[0];

    console.log(`[Dynamic Questions] Selected questions: ${allQuestions.map(q => q.title).join(', ')}`);
    console.log(`[Dynamic Questions] Starting with: "${firstQuestion.title}"`);

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
      },
      code: firstQuestion.starterCode,
      language: firstQuestion.language,
      transcript: [],
      status: 'active'
    };

    const session = await Session.findOneAndUpdate(
      { sessionId },
      sessionData,
      { new: true, upsert: true }
    );

    // Cache in memory
    sessionCache.set(sessionId, sessionData);
    console.log(`[Cache] Session ${sessionId} cached. Agent will decide if second question is needed.`);

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


// POST /submit-question - Submit current question and advance to next
router.post('/submit-question', async (req: Request, res: Response) => {
  const { sessionId, code, transcript = [] } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentIndex = session.currentQuestionIndex;
    const totalQuestions = session.questions.length;

    // Save current submission
    session.submissions.push({
      questionIndex: currentIndex,
      code: code,
      transcript: transcript,
      submittedAt: new Date()
    });

    // Check if there are more questions
    if (currentIndex + 1 < totalQuestions) {
      // Advance to next question
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
      // All questions completed - trigger final evaluation
      session.code = code;
      session.transcript = transcript;
      session.status = 'completed';

      console.log("Session completed. Waiting for Agent analysis...");
      // DO NOT EVALUATE HERE. The Python Agent will generate the report and call /save-analysis

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

// POST /advance-question - Agent calls this when it decides candidate needs a second question
// This is different from submit-question as it doesn't save code, just advances the question
router.post('/advance-question', async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentIndex = session.currentQuestionIndex;
    const totalQuestions = session.questions.length;

    // Check if there are more questions available
    if (currentIndex + 1 < totalQuestions) {
      const nextQuestion = session.questions[currentIndex + 1];
      session.currentQuestionIndex = currentIndex + 1;
      session.question = nextQuestion;
      session.code = nextQuestion.starterCode;
      // Don't reset transcript - keep conversation flowing

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


// POST /submit
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

    console.log(`[API /submit] Session ${sessionId} submitted. Triggering report generation...`);

    // Fire-and-forget report generation — client polls for result
    generateReport(sessionId).catch((err) => {
      console.error(`[API /submit] Report generation error for ${sessionId}:`, err);
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

// GET /session/:sessionId
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionObj = session.toObject();
    sessionCache.set(sessionId, sessionObj);

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

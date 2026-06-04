import { QUESTION_BANK, QuestionDef, getQuestionById } from '../data/questions';
import Session from '../models/Session';

/**
 * QuestionSelectionService — Core service for selecting specific questions
 * and initializing interview sessions with pre-selected questions.
 *
 * This lays the database/logic foundation for the custom question selection system.
 */
export class QuestionSelectionService {
  /**
   * Retrieves all available questions in the question bank.
   * Useful for the selection screen on the frontend.
   */
  static getAllQuestions(): QuestionDef[] {
    return QUESTION_BANK;
  }

  /**
   * Checks if a question ID exists in the master question bank.
   */
  static isValidQuestion(questionId: string): boolean {
    return QUESTION_BANK.some(q => q.id === questionId);
  }

  /**
   * Prepares session initialization data starting with a user-selected question.
   *
   * @param primaryQuestionId - The ID of the question the user selected.
   * @param backupCount - Number of follow-up questions to select (default: 1).
   * @returns Prepared session data structure ready for DB upsert.
   */
  static prepareSessionData(primaryQuestionId: string, backupCount: number = 1) {
    const primaryQuestion = getQuestionById(primaryQuestionId);
    if (!primaryQuestion) {
      throw new Error(`Question with ID "${primaryQuestionId}" not found in the bank.`);
    }

    // Filter out the selected question to avoid duplicates in backup choices
    const remainingPool = QUESTION_BANK.filter(q => q.id !== primaryQuestionId);
    
    // Shuffle the remaining pool using Fisher-Yates
    const shuffledRemaining = [...remainingPool];
    for (let i = shuffledRemaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRemaining[i], shuffledRemaining[j]] = [shuffledRemaining[j], shuffledRemaining[i]];
    }

    // Compose the list of questions: selected first, followed by backups
    const selectedQuestions = [
      primaryQuestion,
      ...shuffledRemaining.slice(0, Math.min(backupCount, shuffledRemaining.length))
    ];

    const sessionId = "intervu-ai-interview"; // Matches existing MVP session identifier

    return {
      sessionId,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      submissions: [],
      question: {
        title: primaryQuestion.title,
        description: primaryQuestion.description,
        examples: primaryQuestion.examples,
        starterCode: primaryQuestion.starterCode,
        language: primaryQuestion.language,
        fileName: primaryQuestion.fileName,
        visualization: primaryQuestion.visualization,
        difficulty: primaryQuestion.difficulty,
        category: primaryQuestion.category,
        tags: primaryQuestion.tags,
      },
      code: primaryQuestion.starterCode,
      language: primaryQuestion.language,
      transcript: [],
      status: 'active' as const
    };
  }
}

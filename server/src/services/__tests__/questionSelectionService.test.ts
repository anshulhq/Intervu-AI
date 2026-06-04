import { QuestionSelectionService } from '../questionSelectionService';
import { QUESTION_BANK } from '../../data/questions';

describe('QuestionSelectionService', () => {
  it('should retrieve all questions from the question bank', () => {
    const questions = QuestionSelectionService.getAllQuestions();
    expect(questions).toBeDefined();
    expect(questions.length).toBe(QUESTION_BANK.length);
  });

  it('should validate valid and invalid question IDs correctly', () => {
    expect(QuestionSelectionService.isValidQuestion('two-sum')).toBe(true);
    expect(QuestionSelectionService.isValidQuestion('reverse-linked-list')).toBe(true);
    expect(QuestionSelectionService.isValidQuestion('non-existent-question-id')).toBe(false);
  });

  it('should prepare session data starting with the selected question', () => {
    const selectedId = 'two-sum';
    const backupCount = 1;
    const sessionData = QuestionSelectionService.prepareSessionData(selectedId, backupCount);

    expect(sessionData.sessionId).toBe('intervu-ai-interview');
    expect(sessionData.currentQuestionIndex).toBe(0);
    expect(sessionData.status).toBe('active');
    expect(sessionData.question.title).toBe('Two Sum');
    expect(sessionData.code).toBe(sessionData.question.starterCode);
    expect(sessionData.questions.length).toBe(2);
    expect(sessionData.questions[0].title).toBe('Two Sum');
  });

  it('should throw an error for non-existent question ID', () => {
    expect(() => {
      QuestionSelectionService.prepareSessionData('invalid-id');
    }).toThrow();
  });
});

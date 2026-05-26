import { buildPrompt } from '../promptBuilder';
import { InterviewData } from '../types';

const baseData: InterviewData = {
  sessionId: 'test-session',
  question: {
    title: 'Two Sum',
    description: 'Find two numbers that add up to target.',
    examples: ['Input: [2,7], target=9 → Output: [0,1]'],
    difficulty: 'easy',
    category: 'Arrays & Hashing',
    tags: ['array', 'hash-map'],
  },
  code: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        return new int[]{};\n    }\n}',
  language: 'java',
  transcript: [
    { role: 'user', content: 'I will use a hash map for O(n) time.' },
    { role: 'ai', content: 'Good approach. Proceed.' },
  ],
  submissions: [
    { questionIndex: 0, code: 'prev code', transcript: [], submittedAt: new Date() },
  ],
};

describe('buildPrompt', () => {
  it('returns both system and user prompts', () => {
    const result = buildPrompt(baseData);
    expect(result.systemPrompt).toBeDefined();
    expect(result.userPrompt).toBeDefined();
    expect(result.systemPrompt.length).toBeGreaterThan(100);
    expect(result.userPrompt.length).toBeGreaterThan(100);
  });

  it('includes question title in user prompt', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('Two Sum');
  });

  it('includes question category in user prompt', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('Arrays & Hashing');
  });

  it('includes difficulty level', () => {
    const result = buildPrompt(baseData);
    expect(result.systemPrompt).toContain('EASY');
  });

  it('includes code in user prompt', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('HashMap');
  });

  it('includes transcript in user prompt', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('hash map');
    expect(result.userPrompt).toContain('CANDIDATE');
    expect(result.userPrompt).toContain('INTERVU AI');
  });

  it('handles empty transcript', () => {
    const data: InterviewData = { ...baseData, transcript: [] };
    const result = buildPrompt(data);
    expect(result.userPrompt).toContain('No verbal communication');
  });

  it('adapts for different categories', () => {
    const linkedListData: InterviewData = {
      ...baseData,
      question: {
        ...baseData.question,
        title: 'Reverse Linked List',
        category: 'Linked Lists',
        tags: ['linked-list'],
      },
    };
    const result = buildPrompt(linkedListData);
    expect(result.systemPrompt).toContain('pointer manipulation');
  });

  it('adapts difficulty expectations', () => {
    const hardData: InterviewData = {
      ...baseData,
      question: { ...baseData.question, difficulty: 'hard' },
    };
    const result = buildPrompt(hardData);
    expect(result.systemPrompt).toContain('HARD');
    expect(result.systemPrompt).toContain('More lenient');
  });

  it('includes submission count for multi-question sessions', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('1 question(s)');
  });

  it('includes examples', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('Input: [2,7]');
  });

  it('includes tags', () => {
    const result = buildPrompt(baseData);
    expect(result.userPrompt).toContain('hash-map');
  });
});

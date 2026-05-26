import { analyzeCode, analyzeTranscript, analyzeInterview } from '../analyzer';
import { InterviewData } from '../types';

describe('analyzeCode', () => {
  it('detects empty code', () => {
    const result = analyzeCode('');
    expect(result.isEmpty).toBe(true);
    expect(result.isStarterOnly).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].severity).toBe('error');
    expect(result.issues[0].issue).toContain('No implementation');
  });

  it('detects comment-only code as empty', () => {
    const result = analyzeCode('// TODO: implement\n/* placeholder */');
    expect(result.isEmpty).toBe(true);
    expect(result.issues).toHaveLength(1);
  });

  it('detects starter-only code', () => {
    const starter = 'class Solution {\n    public int solve() {\n        \n    }\n}';
    const result = analyzeCode(starter, starter);
    expect(result.isEmpty).toBe(false);
    expect(result.isStarterOnly).toBe(true);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].severity).toBe('error');
    expect(result.issues[0].issue).toContain('starter code');
  });

  it('returns no issues for real code', () => {
    const code = 'class Solution {\n    public int solve() {\n        return 42;\n    }\n}';
    const result = analyzeCode(code, 'different starter');
    expect(result.isEmpty).toBe(false);
    expect(result.isStarterOnly).toBe(false);
    expect(result.issues).toHaveLength(0);
    expect(result.nonEmptyLineCount).toBe(5);
  });

  it('counts lines correctly', () => {
    const code = 'line1\n\nline3\n  \nline5';
    const result = analyzeCode(code);
    expect(result.lineCount).toBe(5);
    expect(result.nonEmptyLineCount).toBe(3);
  });
});

describe('analyzeTranscript', () => {
  it('detects empty transcript', () => {
    const result = analyzeTranscript([]);
    expect(result.isEmpty).toBe(true);
    expect(result.candidateCount).toBe(0);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].quote).toBe('Silence');
  });

  it('detects no candidate messages', () => {
    const messages = [{ role: 'ai' as const, content: 'Hello!' }];
    const result = analyzeTranscript(messages);
    expect(result.isEmpty).toBe(false);
    expect(result.candidateCount).toBe(0);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].issue).toContain('did not speak');
  });

  it('flags very few candidate messages', () => {
    const messages = [
      { role: 'ai' as const, content: 'Question?' },
      { role: 'user' as const, content: 'Yes I know this problem well and will use an iterative approach with pointers' },
    ];
    const result = analyzeTranscript(messages);
    expect(result.candidateCount).toBe(1);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].issue).toContain('limited communication');
  });

  it('flags short candidate responses', () => {
    const messages = [
      { role: 'ai' as const, content: 'Explain your approach' },
      { role: 'user' as const, content: 'ok' },
      { role: 'ai' as const, content: 'Tell me more' },
      { role: 'user' as const, content: 'hm' },
      { role: 'ai' as const, content: 'Go on' },
      { role: 'user' as const, content: 'idk' },
    ];
    const result = analyzeTranscript(messages);
    expect(result.candidateCount).toBe(3);
    expect(result.avgCandidateLength).toBeLessThan(20);
    expect(result.issues.some((i) => i.issue.includes('extremely short'))).toBe(true);
  });

  it('returns no issues for healthy transcript', () => {
    const messages = [
      { role: 'ai' as const, content: 'Can you solve this?' },
      { role: 'user' as const, content: 'Sure, I will use a hash map to store complements and achieve O(n) time complexity.' },
      { role: 'ai' as const, content: 'Good. What about space?' },
      { role: 'user' as const, content: 'O(n) worst case if all elements need to be stored in the map before finding the pair.' },
      { role: 'ai' as const, content: 'Go ahead and code it.' },
      { role: 'user' as const, content: 'Done. I iterate through nums, check if target minus current exists in the map, and return the indices.' },
    ];
    const result = analyzeTranscript(messages);
    expect(result.candidateCount).toBe(3);
    expect(result.issues).toHaveLength(0);
  });
});

describe('analyzeInterview', () => {
  const baseData: InterviewData = {
    sessionId: 'test-session',
    question: {
      title: 'Two Sum',
      description: 'Find two numbers that add up to target.',
      examples: ['Input: [2,7,11,15], target=9 → Output: [0,1]'],
      difficulty: 'easy',
      category: 'Arrays & Hashing',
      tags: ['array', 'hash-map'],
    },
    code: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}',
    language: 'java',
    transcript: [
      { role: 'user', content: 'I will use a hash map approach for O(n) time.' },
      { role: 'ai', content: 'Explain more.' },
      { role: 'user', content: 'Store complements in a map as we iterate through the array.' },
      { role: 'ai', content: 'Good. Proceed.' },
      { role: 'user', content: 'The implementation handles edge cases like empty arrays and single elements.' },
    ],
    submissions: [],
  };

  it('returns all analysis signals', () => {
    const result = analyzeInterview(baseData);
    expect(result.codeIsEmpty).toBe(false);
    expect(result.codeIsStarterOnly).toBe(false);
    expect(result.transcriptIsEmpty).toBe(false);
    expect(result.candidateMessageCount).toBe(3);
    expect(result.obviousCodeIssues).toHaveLength(0);
    expect(result.obviousTranscriptIssues).toHaveLength(0);
  });

  it('detects empty session', () => {
    const emptyData: InterviewData = {
      ...baseData,
      code: '',
      transcript: [],
    };
    const result = analyzeInterview(emptyData);
    expect(result.codeIsEmpty).toBe(true);
    expect(result.transcriptIsEmpty).toBe(true);
    expect(result.obviousCodeIssues).toHaveLength(1);
    expect(result.obviousTranscriptIssues).toHaveLength(1);
  });

  it('detects multiple submissions', () => {
    const multiData: InterviewData = {
      ...baseData,
      submissions: [
        { questionIndex: 0, code: 'code1', transcript: [], submittedAt: new Date() },
        { questionIndex: 1, code: 'code2', transcript: [], submittedAt: new Date() },
      ],
    };
    const result = analyzeInterview(multiData);
    expect(result.submissionCount).toBe(2);
    expect(result.hasMultipleSubmissions).toBe(true);
  });
});

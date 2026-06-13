import {
  EVALUATION_DIMENSIONS,
  getDimension,
  getGuidanceForCategory,
  computeWeightedScore,
  DEFAULT_GUIDANCE,
} from '../dimensions';

describe('EVALUATION_DIMENSIONS', () => {
  it('has exactly 6 dimensions', () => {
    expect(EVALUATION_DIMENSIONS).toHaveLength(6);
  });

  it('has all expected dimension keys', () => {
    const keys = EVALUATION_DIMENSIONS.map((d) => d.key);
    expect(keys).toContain('problem_solving');
    expect(keys).toContain('algorithmic_thinking');
    expect(keys).toContain('code_implementation');
    expect(keys).toContain('testing');
    expect(keys).toContain('time_management');
    expect(keys).toContain('communication');
  });

  it('weights sum to 1.0', () => {
    const totalWeight = EVALUATION_DIMENSIONS.reduce(
      (sum, d) => sum + d.weight,
      0,
    );
    expect(totalWeight).toBeCloseTo(1.0, 5);
  });

  it('every dimension has category-specific guidance for known categories', () => {
    const categories = [
      'Linked Lists',
      'Arrays & Hashing',
      'Stacks',
      'Binary Search',
      'Heaps & Priority Queues',
    ];

    for (const dim of EVALUATION_DIMENSIONS) {
      for (const category of categories) {
        expect(dim.categorySpecificGuidance[category]).toBeDefined();
        expect(dim.categorySpecificGuidance[category].length).toBeGreaterThan(10);
      }
    }
  });
});

describe('getDimension', () => {
  it('returns the correct dimension by key', () => {
    const dim = getDimension('problem_solving');
    expect(dim).toBeDefined();
    expect(dim!.label).toBe('Problem Solving');
  });

  it('returns undefined for unknown key', () => {
    expect(getDimension('nonexistent')).toBeUndefined();
  });
});

describe('getGuidanceForCategory', () => {
  it('returns specific guidance for known category', () => {
    const guidance = getGuidanceForCategory('problem_solving', 'Linked Lists');
    expect(guidance).toContain('pointer');
  });

  it('returns default guidance for unknown category', () => {
    const guidance = getGuidanceForCategory('problem_solving', 'Unknown Category');
    expect(guidance).toBe(DEFAULT_GUIDANCE);
  });

  it('returns default for unknown dimension', () => {
    const guidance = getGuidanceForCategory('nonexistent', 'Linked Lists');
    expect(guidance).toBe(DEFAULT_GUIDANCE);
  });
});

describe('computeWeightedScore', () => {
  it('computes weighted average correctly', () => {
    const scores = {
      problem_solving: 10,
      algorithmic_thinking: 10,
      code_implementation: 10,
      testing: 10,
      time_management: 10,
      communication: 10,
    };
    expect(computeWeightedScore(scores)).toBe(10);
  });

  it('handles all-zero scores', () => {
    const scores = {
      problem_solving: 0,
      algorithmic_thinking: 0,
      code_implementation: 0,
      testing: 0,
      time_management: 0,
      communication: 0,
    };
    expect(computeWeightedScore(scores)).toBe(0);
  });

  it('handles partial scores', () => {
    const scores = {
      problem_solving: 8,
      algorithmic_thinking: 6,
      code_implementation: 7,
      testing: 4,
      time_management: 5,
      communication: 9,
    };
    const result = computeWeightedScore(scores);
    expect(result).toBeGreaterThan(5);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('handles empty object', () => {
    expect(computeWeightedScore({})).toBe(0);
  });
});

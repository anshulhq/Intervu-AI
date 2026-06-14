/**
 * Evaluation Dimensions — Scoring Axes and Category-Specific Guidance
 *
 * Each dimension defines what "good" looks like across all question categories,
 * plus category-specific evaluation criteria so the LLM knows what matters
 * for a linked-list problem vs. a binary-search problem.
 *
 * The `weight` field controls how much each dimension influences the overall
 * score (used by the formatter when computing the aggregate).
 */

import { DimensionDefinition } from './types';

export const EVALUATION_DIMENSIONS: DimensionDefinition[] = [
  {
    key: 'problem_solving',
    label: 'Problem Solving',
    description:
      'Ability to understand the problem, identify edge cases, decompose into sub-problems, and select an appropriate strategy before coding.',
    weight: 0.25,
    categorySpecificGuidance: {
      'Linked Lists':
        'Evaluate pointer manipulation reasoning, cycle detection awareness, and whether they considered sentinel nodes or dummy heads.',
      'Arrays & Hashing':
        'Evaluate hash-map usage, prefix-sum reasoning, two-pointer strategy selection, and sliding window identification.',
      'Stacks':
        'Evaluate bracket-matching logic, stack invariant understanding, and whether they recognized LIFO applicability.',
      'Binary Search':
        'Evaluate ability to identify monotonic search space, correct mid-point calculation, and boundary condition handling.',
      'Heaps & Priority Queues':
        'Evaluate min-heap vs max-heap choice, understanding of k-size limitation, and identification of Heap vs Quickselect trade-offs.',
      'Patterns':
        'Evaluate ability to decompose the shape into upper and lower triangles, recognize the mirror symmetry, and derive the per-row spaces/stars formula from the row index before coding.',
    },
  },
  {
    key: 'algorithmic_thinking',
    label: 'Algorithmic Thinking',
    description:
      'Correctness and optimality of the chosen algorithm, time/space complexity analysis, and awareness of alternative approaches.',
    weight: 0.20,
    categorySpecificGuidance: {
      'Linked Lists':
        'Check if they chose iterative vs. recursive appropriately, identified O(n) single-pass solutions, and avoided O(n²) pointer chasing.',
      'Arrays & Hashing':
        'Check if they achieved O(n) with hash maps instead of O(n²) brute force, and correctly identified when sorting is acceptable.',
      'Stacks':
        'Check if they achieved O(n) time, understood why stack gives O(1) per-element amortized, and recognized this is a "last unmatched" pattern.',
      'Binary Search':
        'Check if they achieved O(log n), handled the rotated-array pivot logic correctly, and identified which half is sorted.',
      'Heaps & Priority Queues':
        'Check if they achieved O(n log k) time complexity and O(k) space complexity, and understood why a heap is optimal for streaming data.',
      'Patterns':
        'Check if they identified the O(n) row-by-row approach with the arithmetic relationship (spaces = n - i, stars = 2i - 1) rather than a brute-force nested accumulation, and correctly bounded the total row count.',
    },
  },
  {
    key: 'code_implementation',
    label: 'Code Implementation',
    description:
      'Code correctness, variable naming, edge case handling, off-by-one errors, null checks, and overall code cleanliness.',
    weight: 0.20,
    categorySpecificGuidance: {
      'Linked Lists':
        'Check null-head guard, correct pointer reassignment order (save next before reversing), and loop termination condition.',
      'Arrays & Hashing':
        'Check array bounds, correct hash-map key selection, proper complement calculation, and off-by-one in index-based solutions.',
      'Stacks':
        'Check push/pop ordering, empty-stack handling, character-to-bracket mapping, and early termination on mismatches.',
      'Binary Search':
        'Check left/right boundary updates (avoid infinite loops), mid calculation overflow safety, and correct return values.',
      'Heaps & Priority Queues':
        'Check heap initialization, correct comparison function/ordering, and size-limit upkeep (polling when size exceeds k).',
      'Patterns':
        'Check correct loop bounds (1 to 2n - 1), accurate space/star counts, off-by-one errors when mirroring the lower half, and proper newline handling per row.',
    },
  },
  {
    key: 'testing',
    label: 'Testing & Verification',
    description:
      'Whether the candidate traced through examples, proposed edge cases, verified their code manually, or discussed testing strategy.',
    weight: 0.10,
    categorySpecificGuidance: {
      'Linked Lists':
        'Did they trace with empty list, single node, even/odd length? Did they draw pointer states?',
      'Arrays & Hashing':
        'Did they test with duplicate elements, negative numbers, empty array, single element? Did they verify the complement logic?',
      'Stacks':
        'Did they test nested brackets, interleaved types, single character, empty string, odd-length strings?',
      'Binary Search':
        'Did they test target at boundaries, not-found case, single-element array, rotated vs. non-rotated?',
      'Heaps & Priority Queues':
        'Did they test with k equal to array length, k = 1, duplicate elements, negative values, and empty/small arrays?',
      'Patterns':
        'Did they test n = 1 (single star), verify left-right and top-bottom symmetry, and trace a couple of rows by hand to confirm the space/star counts?',
    },
  },
  {
    key: 'time_management',
    label: 'Time Management',
    description:
      'Pacing of the interview — did they spend too long on one aspect, rush to code without thinking, or finish with time to review?',
    weight: 0.10,
    categorySpecificGuidance: {
      'Linked Lists':
        'A clean iterative solution should be achievable in 15-20 min. Spending 30+ min may indicate poor time use.',
      'Arrays & Hashing':
        'Hash-map solutions should be quick (10-15 min). If they started with brute force, did they pivot efficiently?',
      'Stacks':
        'This is typically a quick problem (10-15 min). Lingering suggests conceptual gaps.',
      'Binary Search':
        'Standard binary search is fast (10 min). Rotated array variations may take 20-25 min — judge accordingly.',
      'Heaps & Priority Queues':
        'A heap-based solution should take 15-20 min. If they implemented Quickselect, judge their pacing accordingly.',
      'Patterns':
        'A straightforward pattern problem should take 10-15 min. Lingering often indicates confusion over the space/star formula or mirror logic.',
    },
  },
  {
    key: 'communication',
    label: 'Communication',
    description:
      'Clarity of verbal explanation, proactive complexity analysis, narrating while coding, and responsiveness to hints.',
    weight: 0.15,
    categorySpecificGuidance: {
      'Linked Lists':
        'Did they explain the pointer state at each step? Did they verbalize the invariant ("everything before curr is reversed")?',
      'Arrays & Hashing':
        'Did they explain why a hash map is needed? Did they walk through the complement lookup before coding?',
      'Stacks':
        'Did they explain the stack invariant clearly? Did they connect the bracket-matching to LIFO intuitively?',
      'Binary Search':
        'Did they explain which half is sorted and why? Did they verbalize the elimination logic at each step?',
      'Heaps & Priority Queues':
        'Did they explain why a min-heap stores the largest elements? Did they verbalize how elements bubble up and down in the heap?',
      'Patterns':
        'Did they explain the spaces/stars formula before coding? Did they verbalize the mirror symmetry between the upper and lower triangles?',
    },
  },
];

export const DEFAULT_GUIDANCE =
  'Evaluate using standard interview criteria for this problem type.';

export function getDimension(key: string): DimensionDefinition | undefined {
  return EVALUATION_DIMENSIONS.find((d) => d.key === key);
}

export function getGuidanceForCategory(
  dimensionKey: string,
  category: string,
): string {
  const dim = getDimension(dimensionKey);
  if (!dim) return DEFAULT_GUIDANCE;
  return dim.categorySpecificGuidance[category] || DEFAULT_GUIDANCE;
}

export function computeWeightedScore(
  dimensionScores: Record<string, number>,
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const dim of EVALUATION_DIMENSIONS) {
    const score = dimensionScores[dim.key];
    if (score !== undefined) {
      weightedSum += score * dim.weight;
      totalWeight += dim.weight;
    }
  }

  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
}

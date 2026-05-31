/**
 * Question Bank — Scalable Interview Question Registry
 *
 * This module serves as the single source of truth for all interview questions
 * used during live Intervu AI sessions. Each question is defined as a `QuestionDef`
 * object and registered in the `QUESTION_BANK` array.
 *
 * Architecture:
 *   - When a session starts (POST /start), the route handler calls `selectRandomQuestions()`
 *     which shuffles the bank and picks a subset (typically 2 questions).
 *   - The first question is sent to the frontend immediately; the rest are stored
 *     in the session for the agent to potentially advance to later.
 *   - The Python voice agent receives the problem context via LiveKit data channels
 *     and injects it into its Socratic prompt so it can guide the candidate in real-time.
 *
 * To add a new question:
 *   1. Create an object matching the `QuestionDef` interface below
 *   2. Push it into the `QUESTION_BANK` array
 *   3. If it needs a visualization, set `visualization` to a unique key
 *      and register the corresponding component on the frontend
 *      (see client/components/interview/visualizations/registry.tsx)
 *
 * That's it. No other files need to change.
 */

// Supported difficulty levels for question classification.
// Used by the frontend for display and by the agent to calibrate expectations.
export type Difficulty = "easy" | "medium" | "hard";

/**
 * QuestionDef — The shape of a single interview question.
 *
 * Each question contains everything needed to present the problem to the candidate
 * and for the AI agent to evaluate responses:
 *   - `id`: Unique slug used as the primary key for lookups (e.g., "two-sum")
 *   - `title`: Human-readable name shown in the UI header and agent greeting
 *   - `description`: Full problem statement with constraints (shown in the Problem tab)
 *   - `examples`: Input/output pairs displayed below the description
 *   - `starterCode`: Pre-populated code skeleton in the editor (language-specific)
 *   - `language` / `fileName`: Editor language mode and filename for the code panel
 *   - `difficulty`: Easy/medium/hard classification for adaptive interview logic
 *   - `category`: Broad topic area (e.g., "Arrays & Hashing", "Linked Lists")
 *   - `tags`: Fine-grained topic tags for filtering and future recommendation logic
 *   - `visualization`: Optional key that maps to a React component for interactive
 *     visual aids (e.g., linked list node animations). If undefined, no viz is shown.
 */
export interface QuestionDef {
  id: string;
  title: string;
  description: string;
  examples: string[];
  starterCode: string;
  language: string;
  fileName: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  visualization?: string;
}

/**
 * QUESTION_BANK — The master registry of all available interview questions.
 *
 * At session creation time (POST /start), `selectRandomQuestions()` shuffles this
 * array and picks the first N entries. This ensures every candidate gets a different
 * question order, reducing the chance of leaked answers being useful.
 *
 * Currently contains 7 questions spanning:
 *   - Linked Lists (Reverse Linked List — with live visualization)
 *   - Arrays & Hashing (Two Sum)
 *   - Arrays & Hashing (Subarray Sum Equals K)
 *   - Stacks (Valid Parentheses)
 *   - Binary Search (Binary Search)
 *   - Binary Search (Search in Rotated Sorted Array)
 *   - Heaps & Priority Queues (Find Median from Data Stream)
 */
export const QUESTION_BANK: QuestionDef[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
      "Input: head = [1,2]\nOutput: [2,1]",
      "Input: head = []\nOutput: []",
    ],
    starterCode: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Linked Lists",
    tags: ["linked-list", "recursion", "iteration"],
    // Links to the LinkedListVisualization component on the frontend.
    // When the candidate is on this question, the Problem tab renders
    // an interactive linked-list diagram showing node pointer reversal.
    visualization: "linked-list-reversal",
  },
  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
      "Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
      "Input: nums = [3,3], target = 6\nOutput: [0,1]",
    ],
    starterCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Arrays & Hashing",
    tags: ["array", "hash-map"],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      'Input: s = "()"\nOutput: true',
      'Input: s = "()[]{}"\nOutput: true',
      'Input: s = "(]"\nOutput: false',
    ],
    starterCode: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Stacks",
    tags: ["stack", "string"],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      "Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4",
      "Input: nums = [-1,0,3,5,9,12], target = 2\nOutput: -1\nExplanation: 2 does not exist in nums so return -1",
    ],
    starterCode: `class Solution {
    public int search(int[] nums, int target) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Binary Search",
    tags: ["array", "binary-search", "divide-and-conquer"],
  },
  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    description:
      "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nConstraints:\n- 1 <= nums.length <= 5000\n- -10^4 <= nums[i] <= 10^4\n- All values of nums are unique\n- nums is an ascending array that is possibly rotated\n- -10^4 <= target <= 10^4",
    examples: [
      "Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\nExplanation: The array was rotated at pivot index 4. Target 0 is found at index 4.",
      "Input: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\nExplanation: Target 3 does not exist in the array.",
      "Input: nums = [1], target = 0\nOutput: -1\nExplanation: Single element array does not contain target 0.",
      "Input: nums = [1,3], target = 3\nOutput: 1\nExplanation: Target 3 is at index 1.",
    ],
    starterCode: `class Solution {
    public int search(int[] nums, int target) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Binary Search",
    tags: ["array", "binary-search"],
  },
  {
    id: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    description:
      "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\nConstraints:\n- 1 <= nums.length <= 2 * 10^4\n- -1000 <= nums[i] <= 1000\n- -10^7 <= k <= 10^7",
    examples: [
      "Input: nums = [1,1,1], k = 2\nOutput: 2\nExplanation: Subarrays [1,1] found at indices (0,1) and (1,2).",
      "Input: nums = [1,2,3], k = 3\nOutput: 2\nExplanation: Subarrays [1,2] and [3] both sum to 3.",
      "Input: nums = [1,-1,0], k = 0\nOutput: 3\nExplanation: Subarrays [1,-1], [-1,0], and [0] all sum to 0.",
    ],
    starterCode: `class Solution {
    public int subarraySum(int[] nums, int k) {
        // Hint: Consider using a HashMap to store prefix sums
        // for O(n) time complexity.
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "hash-map", "prefix-sum"],
  },
  {
    id: "median-from-data-stream",
    title: "Find Median from Data Stream",
    description:
      "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.\n\nFor example, for arr = [2,3,4], the median is 3.\nFor example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.\n\nImplement the MedianFinder class:\n- MedianFinder() initializes the MedianFinder object.\n- void addNum(int num) appends the integer num from the data stream to the data structure.\n- double findMedian() returns the median of all elements so far. Answers within 10^-5 of the actual answer will be accepted.\n\nConstraints:\n- -10^5 <= num <= 10^5\n- There will be at least one element in the data structure before calling findMedian.\n- At most 5 * 10^4 calls will be made to addNum and findMedian.\n\nFollow up:\n1. If all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?\n2. If 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?",
    examples: [
      "Input\n[\"MedianFinder\", \"addNum\", \"addNum\", \"findMedian\", \"addNum\", \"findMedian\"]\n[[], [1], [2], [], [3], []]\nOutput\n[null, null, null, 1.5, null, 2.0]\nExplanation:\nMedianFinder medianFinder = new MedianFinder();\nmedianFinder.addNum(1);    // arr = [1]\nmedianFinder.addNum(2);    // arr = [1, 2]\nmedianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)\nmedianFinder.addNum(3);    // arr[1, 2, 3]\nmedianFinder.findMedian(); // return 2.0",
      "Input\n[\"MedianFinder\", \"addNum\", \"addNum\", \"findMedian\", \"addNum\", \"findMedian\"]\n[[], [-1], [-2], [], [-3], []]\nOutput\n[null, null, null, -1.5, null, -2.0]\nExplanation:\nMedianFinder medianFinder = new MedianFinder();\nmedianFinder.addNum(-1);    // arr = [-1]\nmedianFinder.addNum(-2);    // arr = [-2, -1]\nmedianFinder.findMedian();  // return -1.5\nmedianFinder.addNum(-3);    // arr = [-3, -2, -1]\nmedianFinder.findMedian();  // return -2.0",
    ],
    starterCode: `class MedianFinder {
    // Hint: Consider using two heaps (priority queues):
    //   - A max-heap for the lower half of the numbers
    //   - A min-heap for the upper half of the numbers
    // This allows O(log n) insertions and O(1) median lookup.

    public MedianFinder() {
        
    }
    
    public void addNum(int num) {
        
    }
    
    public double findMedian() {
        
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Heaps & Priority Queues",
    tags: ["heap", "priority-queue", "data-stream", "sorting", "design"],
  },
];

/**
 * Lookup a single question by its unique `id` slug.
 * Used when the agent or a route needs to reference a specific question.
 */
export function getQuestionById(id: string): QuestionDef | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}

/**
 * Filter questions by their broad category (e.g., "Linked Lists", "Arrays & Hashing").
 * Useful for building category-specific interview flows in the future.
 */
export function getQuestionsByCategory(category: string): QuestionDef[] {
  return QUESTION_BANK.filter((q) => q.category === category);
}

/**
 * Filter questions by difficulty level.
 * Can be used to implement adaptive difficulty — e.g., start easy,
 * escalate to medium/hard if the candidate performs well.
 */
export function getQuestionsByDifficulty(difficulty: Difficulty): QuestionDef[] {
  return QUESTION_BANK.filter((q) => q.difficulty === difficulty);
}

/**
 * Filter questions by a specific tag (e.g., "hash-map", "recursion").
 * Tags enable fine-grained topic targeting for focused practice sessions.
 */
export function getQuestionsByTag(tag: string): QuestionDef[] {
  return QUESTION_BANK.filter((q) => q.tags.includes(tag));
}

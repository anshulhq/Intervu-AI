/**
 * Question Bank — Scalable Interview Question Registry
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

export type Difficulty = "easy" | "medium" | "hard";

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
];

export function getQuestionById(id: string): QuestionDef | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}

export function getQuestionsByCategory(category: string): QuestionDef[] {
  return QUESTION_BANK.filter((q) => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: Difficulty): QuestionDef[] {
  return QUESTION_BANK.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByTag(tag: string): QuestionDef[] {
  return QUESTION_BANK.filter((q) => q.tags.includes(tag));
}

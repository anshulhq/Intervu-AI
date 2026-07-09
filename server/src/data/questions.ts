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
 * Currently contains 34 questions spanning:
 *   - Linked Lists (Reverse Linked List — with live visualization)
 *   - Linked Lists (Linked List Cycle — with live visualization)
 *   - Arrays & Hashing (Two Sum)
 *   - Arrays & Hashing (Three Sum)
 *   - Arrays & Hashing (Rotate Array — with live visualization)
 *   - Arrays & Hashing (Subarray Sum Equals K)
 *   - Arrays & Hashing (Count Pairs That Form a Complete Day — with live visualization)
 *   - Arrays & Hashing (First Missing Positive — with live visualization)
 *   - Arrays & Hashing (Sort Colors / Dutch National Flag — with live visualization)
 *   - Arrays & Hashing (Trapping Rain Water)
 *   - Arrays & Hashing (Merge Intervals)
 *   - Arrays & Hashing (Best Time to Buy and Sell Stock)
 *   - Stacks (Valid Parentheses)
 *   - Stacks (Longest Valid Parentheses)
 *   - Stacks (Largest Rectangle in Histogram — with live visualization)
 *   - Binary Search (Binary Search)
 *   - Binary Search (Search in Rotated Sorted Array)
 *   - Binary Search (Pow(x, n) — with live visualization)
 *   - Binary Search (Median of Two Sorted Arrays — with live visualization)
 *   - Heaps & Priority Queues (Find Median from Data Stream)
 *   - Heaps & Priority Queues (Kth Largest Element — with live visualization)
 *   - Dynamic Programming (Unique Paths — with live visualization)
 *   - Patterns (Print Diamond Pattern — with live visualization)
 *   - Sliding Window (Minimum Window Substring — with live visualization)
 *   - Sliding Window (Longest Substring Without Repeating Characters)
 *   - Graphs (Course Schedule)
 *   - Trees (Validate Binary Search Tree)
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
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.",
    examples: [
      "Input: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
      "Input: head = [1,2], pos = 0\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 0th node.",
      "Input: head = [1], pos = -1\nOutput: false\nExplanation: There is no cycle in the linked list.",
    ],
    starterCode: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Linked Lists",
    tags: ["linked-list", "two-pointers", "hash-table"],
    visualization: "linked-list-cycle",
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
  {
    id: "rotate-array",
    title: "Rotate Array",
    description:
      "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.\n\nTry to solve it in-place with O(1) extra space.",
    examples: [
      "Input: nums = [1,2,3,4,5,6,7], k = 3\nOutput: [5,6,7,1,2,3,4]\nExplanation:\nrotate 1 steps to the right: [7,1,2,3,4,5,6]\nrotate 2 steps to the right: [6,7,1,2,3,4,5]\nrotate 3 steps to the right: [5,6,7,1,2,3,4]",
      "Input: nums = [-1,-100,3,99], k = 2\nOutput: [3,99,-1,-100]\nExplanation:\nrotate 1 steps to the right: [99,-1,-100,3]\nrotate 2 steps to the right: [3,99,-1,-100]",
    ],
    starterCode: `class Solution {
    public void rotate(int[] nums, int k) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "two-pointers", "math"],
    visualization: "rotate-array",
  },
  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    description:
      "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.\n\nConstraints:\n- 1 <= heights.length <= 10^5\n- 0 <= heights[i] <= 10^4",
    examples: [
      "Input: heights = [2,1,5,6,2,3]\nOutput: 10\nExplanation: The largest rectangle is formed by bars of height 5 and 6, spanning from index 2 to 3, with a width of 2 and an area of 5 * 2 = 10.",
      "Input: heights = [2,4]\nOutput: 4\nExplanation: The largest rectangle has an area of 4 (height = 4, width = 1).",
    ],
    starterCode: `class Solution {
    public int largestRectangleArea(int[] heights) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Stacks",
    tags: ["array", "stack", "monotonic-stack"],
    visualization: "largest-rectangle-in-histogram",
  },
  {
    id: "unique-paths",
    title: "Unique Paths",
    description:
      "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nThe test cases are generated so that the answer will be less than or equal to 2 * 10^9.",
    examples: [
      "Input: m = 3, n = 7\nOutput: 28",
      "Input: m = 3, n = 2\nOutput: 3\nExplanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Down -> Right\n3. Down -> Right -> Down",
      "Input: m = 7, n = 3\nOutput: 28",
      "Input: m = 3, n = 3\nOutput: 6",
    ],
    starterCode: `class Solution {
    public int uniquePaths(int m, int n) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Dynamic Programming",
    tags: ["dynamic-programming", "array", "math"],
    visualization: "unique-paths",
  },
  {
    id: "pow-x-n",
    title: "Pow(x, n)",
    description:
      "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).\n\nConstraints:\n- Solve this without using any built-in exponentiation or library functions (like Math.pow in Java/JavaScript, pow in C/C++, or ** in Python/JavaScript).\n- -100.0 < x < 100.0\n- -2^31 <= n <= 2^31 - 1\n- n is an integer.\n- Either x is not zero or n > 0.\n- -10^4 <= x^n <= 10^4",
    examples: [
      "Input: x = 2.00000, n = 10\nOutput: 1024.00000",
      "Input: x = 2.10000, n = 3\nOutput: 9.26100",
      "Input: x = 2.00000, n = -2\nOutput: 0.25000\nExplanation: 2^-2 = 1/(2^2) = 1/4 = 0.25",
    ],
    starterCode: `class Solution {
    public double myPow(double x, int n) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Binary Search",
    tags: ["math", "binary-search", "recursion", "divide-and-conquer"],
    visualization: "pow-x-n",
  },
  {
    id: "count-hours-complete-day",
    title: "Count Pairs That Form a Complete Day",
    description:
      "Given an integer array hours representing times in hours, return the number of pairs (i, j) such that i < j and hours[i] + hours[j] is a multiple of 24.\n\nA complete day is defined as a multiple of 24 hours. For example, 1 day is 24 hours, 2 days is 48 hours, etc. (i.e., (hours[i] + hours[j]) % 24 == 0).\n\nConstraints:\n- 1 <= hours.length <= 5 * 10^5\n- 1 <= hours[i] <= 10^9",
    examples: [
      "Input: hours = [12,12,30,24,24]\nOutput: 2\nExplanation: The pairs of indices that form a complete day are (0, 1) and (3, 4).",
      "Input: hours = [72,48,24,3]\nOutput: 3\nExplanation: The pairs of indices that form a complete day are (0, 1), (0, 2), and (1, 2).",
    ],
    starterCode: `class Solution {
    public long countCompleteDayPairs(int[] hours) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "hash-table", "math"],
    visualization: "count-hours-complete-day",
  },
  {
    id: "first-missing-positive",
    title: "First Missing Positive",
    description:
      "Given an unsorted integer array nums, return the smallest missing positive integer.\n\nYou must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.\n\nConstraints:\n- 1 <= nums.length <= 10^5\n- -2^31 <= nums[i] <= 2^31 - 1",
    examples: [
      "Input: nums = [1,2,0]\nOutput: 3\nExplanation: The numbers in the range [1,2] are all in the array.",
      "Input: nums = [3,4,-1,1]\nOutput: 2\nExplanation: 1 is in the array but 2 is missing.",
      "Input: nums = [7,8,9,11,12]\nOutput: 1\nExplanation: The smallest positive integer 1 is missing.",
    ],
    starterCode: `class Solution {
    public int firstMissingPositive(int[] nums) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Arrays & Hashing",
    tags: ["array", "hash-table"],
    visualization: "first-missing-positive",
  },
  {
    id: "kth-largest-element",
    title: "Kth Largest Element",
    description:
      "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nConstraints:\n- 1 <= k <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4",
    examples: [
      "Input: nums = [3,2,1,5,6,4], k = 2\nOutput: 5",
      "Input: nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4",
    ],
    starterCode: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Heaps & Priority Queues",
    tags: ["array", "divide-and-conquer", "sorting", "heap", "priority-queue", "quickselect"],
    visualization: "kth-largest-element",
  },
  {
    id: "print-diamond-pattern",
    title: "Print Diamond Pattern",
    description:
      "Given an integer `n` representing the number of rows in the upper half (including the widest middle row), print a diamond pattern using the `*` character.\n\nThe diamond consists of `2n - 1` rows: an upper triangle of `n` rows that widens and a lower triangle of `n - 1` rows that narrows. Each row is centered so that the middle row has `2n - 1` stars and no leading spaces.\n\nFor each row `i` in the upper half (1-indexed), print `n - i` leading spaces followed by `2i - 1` stars. The lower half mirrors the upper half in reverse.\n\nThe pattern should be printed to the console, one row per line.\n\nConstraints:\n- 1 <= n <= 100",
    examples: [
      "Input: n = 5\nOutput:\n    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *",
      "Input: n = 3\nOutput:\n  *\n ***\n*****\n ***\n  *",
      "Input: n = 1\nOutput:\n*",
    ],
    starterCode: `class Solution {
    public void printDiamond(int n) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Patterns",
    tags: ["loops", "patterns", "strings", "simulation"],
    visualization: "print-diamond-pattern",
  },
  {
    id: "level-order-traversal",
    title: "Level Order Traversal",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).\n\nConstraints:\n- The number of nodes in the tree is in the range [0, 2000].\n- -1000 <= Node.val <= 1000",
    examples: [
      "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
      "Input: root = [1]\nOutput: [[1]]",
      "Input: root = []\nOutput: []",
    ],
    starterCode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Trees",
    tags: ["tree", "breadth-first-search", "binary-tree", "queue"],
    visualization: "level-order-traversal",
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    description:
      "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.\n\nConstraints:\n- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4",
    examples: [
      "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (shaded area) the container can contain is 49.",
      "Input: height = [1,1]\nOutput: 1",
    ],
    starterCode: `class Solution {
    public int maxArea(int[] height) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "two-pointers", "greedy"],
    visualization: "container-with-most-water",
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    description:
      "Given the root of a binary tree, invert the tree, and return its root.\n\nConstraints:\n- The number of nodes in the tree is in the range [0, 100].\n- -100 <= Node.val <= 100",
    examples: [
      "Input: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]",
      "Input: root = [2,1,3]\nOutput: [2,3,1]",
      "Input: root = []\nOutput: []",
    ],
    starterCode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Trees",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree", "recursion"],
    visualization: "invert-binary-tree",
  },
  {
    id: "count-inversions",
    title: "Count Inversions",
    description:
      "Given an array of integers `arr`, find the inversion count of the array.\n\nTwo elements `arr[i]` and `arr[j]` form an inversion if `arr[i] > arr[j]` and `i < j`.\n\nInversion Count for an array indicates how far (or close) the array is from being sorted. If the array is already sorted, then the inversion count is 0. If the array is sorted in reverse order, then the inversion count is at its maximum.\n\nConstraints:\n- 1 <= arr.length <= 10^5\n- 1 <= arr[i] <= 10^6",
    examples: [
      "Input: arr = [2, 4, 1, 3, 5]\nOutput: 3\nExplanation: The sequence [2, 4, 1, 3, 5] has 3 inversions: (2, 1), (4, 1), and (4, 3).",
      "Input: arr = [2, 3, 4, 5, 6]\nOutput: 0\nExplanation: The array is already sorted, so there are no inversions.",
      "Input: arr = [10, 10, 10]\nOutput: 0\nExplanation: All elements are identical, so there are no inversions.",
    ],
    starterCode: `class Solution {
    public long inversionCount(long[] arr) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "divide-and-conquer", "sorting", "merge-sort"],
    visualization: "count-inversions",
  },
  {
    id: "reorder-linked-list",
    title: "Reorder Linked List",
    description:
      "You are given the head of a singly linked-list. The list can be represented as:\n\n`L0 → L1 → … → Ln - 1 → Ln`\n\nReorder the list to be on the following form:\n\n`L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …`\n\nYou may not modify the values in the list's nodes. Only nodes themselves may be changed.",
    examples: [
      "Input: head = [1,2,3,4]\nOutput: [1,4,2,3]",
      "Input: head = [1,2,3,4,5]\nOutput: [1,5,2,4,3]",
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
    public void reorderList(ListNode head) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Linked Lists",
    tags: ["linked-list", "two-pointers", "stack", "recursion"],
    visualization: "reorder-linked-list",
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    description:
      "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\nConstraints:\n- nums1.length == m\n- nums2.length == n\n- 0 <= m <= 1000\n- 0 <= n <= 1000\n- 1 <= m + n <= 2000\n- -10^6 <= nums1[i], nums2[i] <= 10^6",
    examples: [
      "Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.",
      "Input: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
    ],
    starterCode: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Binary Search",
    tags: ["array", "binary-search", "divide-and-conquer"],
    visualization: "median-two-sorted-arrays",
  },
  {
    id: "sort-colors",
    title: "Sort Colors (Dutch National Flag)",
    description:
      "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library's sort function.\n\nConstraints:\n- `n == nums.length`\n- `1 <= n <= 300`\n- `nums[i]` is either `0`, `1`, or `2`.\n\nFollow up: Could you come up with a one-pass algorithm using only constant extra space?",
    examples: [
      "Input: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]",
      "Input: nums = [2,0,1]\nOutput: [0,1,2]",
    ],
    starterCode: `class Solution {
    public void sortColors(int[] nums) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "two-pointers", "sorting"],
    visualization: "dutch-national-flag",
  },
  {
    id: "three-sum",
    title: "Three Sum",
    description:
      "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      "Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\nNotice that the order of the output and the order of the triplets does not matter.",
      "Input: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.",
      "Input: nums = [0,0,0]\nOutput: [[0,0,0]]\nExplanation: The only possible triplet sums up to 0.",
    ],
    starterCode: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "two-pointers", "sorting"],
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    description:
      "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      "Input: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\nExplanation: The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6",
      "Input: lists = []\nOutput: []",
      "Input: lists = [[]]\nOutput: []",
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
    public ListNode mergeKLists(ListNode[] lists) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Linked Lists",
    tags: ["linked-list", "divide-and-conquer", "heap", "priority-queue", "merge-sort"],
  },
  {
    id: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    description:
      "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.\n\nConstraints:\n- 0 <= s.length <= 3 * 10^4\n- s[i] is '(' or ')'",
    examples: [
      'Input: s = "(()"\nOutput: 2\nExplanation: The longest valid parentheses substring is "()".',
      'Input: s = ")()())"\nOutput: 4\nExplanation: The longest valid parentheses substring is "()()".',
      'Input: s = ""\nOutput: 0',
    ],
    starterCode: `class Solution {
    public int longestValidParentheses(String s) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Stacks",
    tags: ["string", "stack", "dynamic-programming"],
  },
  {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    description:
      "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\nThe testcases will be generated such that the answer is unique.",
    examples: [
      'Input: s = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"\nExplanation: The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.',
      'Input: s = "a", t = "a"\nOutput: "a"\nExplanation: The entire string s is the minimum window.',
      'Input: s = "a", t = "aa"\nOutput: ""\nExplanation: Both \'a\'s from t must be included in the window.\nSince the largest window of s only has one \'a\', return empty string.'
    ],
    starterCode: `class Solution {
    public String minWindow(String s, String t) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Sliding Window",
    tags: ["string", "sliding-window", "hash-table", "two-pointers"],
    visualization: "minimum-window-substring",
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nConstraints:\n- `n == height.length`\n- `1 <= n <= 2 * 10^4`\n- `0 <= height[i] <= 10^5`",
    examples: [
      "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\nExplanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.",
      "Input: height = [4,2,0,3,2,5]\nOutput: 9",
    ],
    starterCode: `class Solution {
    public int trap(int[] height) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "hard",
    category: "Arrays & Hashing",
    tags: ["array", "two-pointers", "dynamic-programming", "stack", "monotonic-stack"],
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    description:
      "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    examples: [
      "Input: grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]\nOutput: 1",
      "Input: grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]\nOutput: 3",
    ],
    starterCode: `class Solution {
    public int numIslands(char[][] grid) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Graphs",
    tags: ["depth-first-search", "breadth-first-search", "union-find", "matrix", "graphs"],
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    description:
      "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\nConstraints:\n- 1 <= intervals.length <= 10^4\n- intervals[i].length == 2\n- 0 <= start_i <= end_i <= 10^4",
    examples: [
      "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      "Input: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\nExplanation: Intervals [1,4] and [4,5] are considered overlapping.",
    ],
    starterCode: `class Solution {
    public int[][] merge(int[][] intervals) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Arrays & Hashing",
    tags: ["array", "sorting", "intervals"],
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    description:
      "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nFor example, the pair `[0, 1]`, indicates that to take course `0` you have to first take course `1`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.\n\nConstraints:\n- `1 <= numCourses <= 2000`\n- `0 <= prerequisites.length <= 5000`\n- `prerequisites[i].length == 2`\n- `0 <= ai, bi < numCourses`\n- All the pairs prerequisites[i] are unique.",
    examples: [
      "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.",
      "Input: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: false\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible."
    ],
    starterCode: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Graphs",
    tags: ["graphs", "depth-first-search", "breadth-first-search", "topological-sort"],
  },
  {
    id: "course-schedule-python",
    title: "Course Schedule (Python)",
    description:
      "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nFor example, the pair `[0, 1]`, indicates that to take course `0` you have to first take course `1`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.\n\nConstraints:\n- `1 <= numCourses <= 2000`\n- `0 <= prerequisites.length <= 5000`\n- `prerequisites[i].length == 2`\n- `0 <= ai, bi < numCourses`\n- All the pairs prerequisites[i] are unique.",
    examples: [
      "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.",
      "Input: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: false\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible."
    ],
    starterCode: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        pass`,
    language: "python",
    fileName: "solution.py",
    difficulty: "medium",
    category: "Graphs",
    tags: ["graphs", "depth-first-search", "breadth-first-search", "topological-sort"],
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.\n\nConstraints:\n- `0 <= s.length <= 5 * 10^4`\n- `s` consists of English letters, digits, symbols and spaces.",
    examples: [
      "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.",
      "Input: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with the length of 1.",
      "Input: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.\nNotice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
    ],
    starterCode: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Sliding Window",
    tags: ["string", "sliding-window", "hash-table", "two-pointers"],
  },
  {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.",
    examples: [
      "Input: root = [2,1,3]\nOutput: true",
      "Input: root = [5,1,4,null,null,3,6]\nOutput: false\nExplanation: The root node's value is 5, but its right child's value is 4.",
    ],
    starterCode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public boolean isValidBST(TreeNode root) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "medium",
    category: "Trees",
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      "Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.",
      "Input: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.",
    ],
    starterCode: `class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`,
    language: "java",
    fileName: "Solution.java",
    difficulty: "easy",
    category: "Arrays & Hashing",
    tags: ["array", "dynamic-programming", "sliding-window"],
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

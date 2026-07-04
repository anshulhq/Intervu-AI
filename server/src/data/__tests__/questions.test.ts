import { QUESTION_BANK, getQuestionById } from "../questions";

describe("Question Bank", () => {
  it("should have unique IDs for all questions", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should define rotate-array question with all required fields", () => {
    const rotateArray = getQuestionById("rotate-array");
    expect(rotateArray).toBeDefined();
    expect(rotateArray!.title).toBe("Rotate Array");
    expect(rotateArray!.difficulty).toBe("medium");
    expect(rotateArray!.category).toBe("Arrays & Hashing");
    expect(rotateArray!.language).toBe("java");
    expect(rotateArray!.fileName).toBe("Solution.java");
    expect(rotateArray!.tags).toContain("array");
    expect(rotateArray!.tags).toContain("two-pointers");
    expect(rotateArray!.tags).toContain("math");
    expect(rotateArray!.visualization).toBe("rotate-array");
    expect(rotateArray!.starterCode).toContain("public void rotate");
  });

  it("should define largest-rectangle-in-histogram question with all required fields", () => {
    const question = getQuestionById("largest-rectangle-in-histogram");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Largest Rectangle in Histogram");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Stacks");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("stack");
    expect(question!.tags).toContain("monotonic-stack");
    expect(question!.visualization).toBe("largest-rectangle-in-histogram");
    expect(question!.starterCode).toContain("public int largestRectangleArea");
  });

  it("should define linked-list-cycle question with all required fields", () => {
    const question = getQuestionById("linked-list-cycle");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Linked List Cycle");
    expect(question!.difficulty).toBe("easy");
    expect(question!.category).toBe("Linked Lists");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("linked-list");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.tags).toContain("hash-table");
    expect(question!.visualization).toBe("linked-list-cycle");
    expect(question!.starterCode).toContain("public boolean hasCycle");
  });

  it("should define unique-paths question with all required fields", () => {
    const question = getQuestionById("unique-paths");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Unique Paths");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Dynamic Programming");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("dynamic-programming");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("math");
    expect(question!.visualization).toBe("unique-paths");
    expect(question!.starterCode).toContain("public int uniquePaths");
  });

  it("should define pow-x-n question with all required fields", () => {
    const question = getQuestionById("pow-x-n");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Pow(x, n)");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Binary Search");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("math");
    expect(question!.tags).toContain("binary-search");
    expect(question!.tags).toContain("recursion");
    expect(question!.tags).toContain("divide-and-conquer");
    expect(question!.visualization).toBe("pow-x-n");
    expect(question!.starterCode).toContain("public double myPow");
  });

  it("should define count-hours-complete-day question with all required fields", () => {
    const question = getQuestionById("count-hours-complete-day");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Count Pairs That Form a Complete Day");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("hash-table");
    expect(question!.tags).toContain("math");
    expect(question!.visualization).toBe("count-hours-complete-day");
    expect(question!.starterCode).toContain("public long countCompleteDayPairs");
  });

  it("should define first-missing-positive question with all required fields", () => {
    const question = getQuestionById("first-missing-positive");
    expect(question).toBeDefined();
    expect(question!.title).toBe("First Missing Positive");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("hash-table");
    expect(question!.visualization).toBe("first-missing-positive");
    expect(question!.starterCode).toContain("public int firstMissingPositive");
  });

  it("should define kth-largest-element question with all required fields", () => {
    const question = getQuestionById("kth-largest-element");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Kth Largest Element");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Heaps & Priority Queues");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("heap");
    expect(question!.tags).toContain("priority-queue");
    expect(question!.visualization).toBe("kth-largest-element");
    expect(question!.starterCode).toContain("public int findKthLargest");
  });

  it("should define print-diamond-pattern question with all required fields", () => {
    const question = getQuestionById("print-diamond-pattern");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Print Diamond Pattern");
    expect(question!.difficulty).toBe("easy");
    expect(question!.category).toBe("Patterns");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("loops");
    expect(question!.tags).toContain("patterns");
    expect(question!.tags).toContain("strings");
    expect(question!.tags).toContain("simulation");
    expect(question!.visualization).toBe("print-diamond-pattern");
    expect(question!.starterCode).toContain("public void printDiamond");
  });

  it("should define level-order-traversal question with all required fields", () => {
    const question = getQuestionById("level-order-traversal");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Level Order Traversal");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Trees");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("tree");
    expect(question!.tags).toContain("breadth-first-search");
    expect(question!.tags).toContain("binary-tree");
    expect(question!.tags).toContain("queue");
    expect(question!.visualization).toBe("level-order-traversal");
    expect(question!.starterCode).toContain("public List<List<Integer>> levelOrder");
  });

  it("should define container-with-most-water question with all required fields", () => {
    const question = getQuestionById("container-with-most-water");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Container With Most Water");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.tags).toContain("greedy");
    expect(question!.visualization).toBe("container-with-most-water");
    expect(question!.starterCode).toContain("public int maxArea");
  });

  it("should define invert-binary-tree question with all required fields", () => {
    const question = getQuestionById("invert-binary-tree");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Invert Binary Tree");
    expect(question!.difficulty).toBe("easy");
    expect(question!.category).toBe("Trees");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("tree");
    expect(question!.tags).toContain("depth-first-search");
    expect(question!.tags).toContain("binary-tree");
    expect(question!.tags).toContain("recursion");
    expect(question!.visualization).toBe("invert-binary-tree");
    expect(question!.starterCode).toContain("public TreeNode invertTree");
  });

  it("should define count-inversions question with all required fields", () => {
    const question = getQuestionById("count-inversions");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Count Inversions");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("divide-and-conquer");
    expect(question!.tags).toContain("sorting");
    expect(question!.tags).toContain("merge-sort");
    expect(question!.visualization).toBe("count-inversions");
    expect(question!.starterCode).toContain("public long inversionCount");
  });

  it("should define reorder-linked-list question with all required fields", () => {
    const question = getQuestionById("reorder-linked-list");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Reorder Linked List");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Linked Lists");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("linked-list");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.tags).toContain("stack");
    expect(question!.tags).toContain("recursion");
    expect(question!.visualization).toBe("reorder-linked-list");
    expect(question!.starterCode).toContain("public void reorderList");
  });

  it("should define median-of-two-sorted-arrays question with all required fields", () => {
    const question = getQuestionById("median-of-two-sorted-arrays");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Median of Two Sorted Arrays");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Binary Search");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("binary-search");
    expect(question!.tags).toContain("divide-and-conquer");
    expect(question!.visualization).toBe("median-two-sorted-arrays");
    expect(question!.starterCode).toContain("public double findMedianSortedArrays");
  });

  it("should define sort-colors question with all required fields", () => {
    const question = getQuestionById("sort-colors");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Sort Colors (Dutch National Flag)");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.tags).toContain("sorting");
    expect(question!.visualization).toBe("dutch-national-flag");
    expect(question!.starterCode).toContain("public void sortColors");
  });

  it("should define three-sum question with all required fields", () => {
    const question = getQuestionById("three-sum");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Three Sum");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.tags).toContain("sorting");
    expect(question!.starterCode).toContain("public List<List<Integer>> threeSum");
  });

  it("should define merge-k-sorted-lists question with all required fields", () => {
    const question = getQuestionById("merge-k-sorted-lists");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Merge k Sorted Lists");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Linked Lists");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("linked-list");
    expect(question!.tags).toContain("divide-and-conquer");
    expect(question!.tags).toContain("heap");
    expect(question!.tags).toContain("priority-queue");
    expect(question!.tags).toContain("merge-sort");
    expect(question!.starterCode).toContain("public ListNode mergeKLists");
  });

  it("should define longest-valid-parentheses question with all required fields", () => {
    const question = getQuestionById("longest-valid-parentheses");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Longest Valid Parentheses");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Stacks");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("string");
    expect(question!.tags).toContain("stack");
    expect(question!.tags).toContain("dynamic-programming");
    expect(question!.starterCode).toContain("public int longestValidParentheses");
  });

  it("should define minimum-window-substring question with all required fields", () => {
    const question = getQuestionById("minimum-window-substring");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Minimum Window Substring");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Sliding Window");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("string");
    expect(question!.tags).toContain("sliding-window");
    expect(question!.tags).toContain("hash-table");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.visualization).toBe("minimum-window-substring");
    expect(question!.starterCode).toContain("public String minWindow");
  });

  it("should define trapping-rain-water question with all required fields", () => {
    const question = getQuestionById("trapping-rain-water");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Trapping Rain Water");
    expect(question!.difficulty).toBe("hard");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.tags).toContain("dynamic-programming");
    expect(question!.tags).toContain("stack");
    expect(question!.tags).toContain("monotonic-stack");
    expect(question!.starterCode).toContain("public int trap");
  });

  it("should define number-of-islands question with all required fields", () => {
    const question = getQuestionById("number-of-islands");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Number of Islands");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Graphs");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("depth-first-search");
    expect(question!.tags).toContain("breadth-first-search");
    expect(question!.tags).toContain("union-find");
    expect(question!.tags).toContain("matrix");
    expect(question!.tags).toContain("graphs");
    expect(question!.starterCode).toContain("public int numIslands");
  });

  it("should define merge-intervals question with all required fields", () => {
    const question = getQuestionById("merge-intervals");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Merge Intervals");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Arrays & Hashing");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("array");
    expect(question!.tags).toContain("sorting");
    expect(question!.tags).toContain("intervals");
    expect(question!.starterCode).toContain("public int[][] merge");
  });

  it("should define course-schedule question with all required fields", () => {
    const question = getQuestionById("course-schedule");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Course Schedule");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Graphs");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("graphs");
    expect(question!.tags).toContain("depth-first-search");
    expect(question!.tags).toContain("breadth-first-search");
    expect(question!.tags).toContain("topological-sort");
    expect(question!.starterCode).toContain("public boolean canFinish");
  });

  it("should define course-schedule-python question with all required fields", () => {
    const question = getQuestionById("course-schedule-python");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Course Schedule (Python)");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Graphs");
    expect(question!.language).toBe("python");
    expect(question!.fileName).toBe("solution.py");
    expect(question!.tags).toContain("graphs");
    expect(question!.tags).toContain("depth-first-search");
    expect(question!.tags).toContain("breadth-first-search");
    expect(question!.tags).toContain("topological-sort");
    expect(question!.starterCode).toContain("def canFinish");
  });

  it("should define longest-substring-without-repeating-characters question with all required fields", () => {
    const question = getQuestionById("longest-substring-without-repeating-characters");
    expect(question).toBeDefined();
    expect(question!.title).toBe("Longest Substring Without Repeating Characters");
    expect(question!.difficulty).toBe("medium");
    expect(question!.category).toBe("Sliding Window");
    expect(question!.language).toBe("java");
    expect(question!.fileName).toBe("Solution.java");
    expect(question!.tags).toContain("string");
    expect(question!.tags).toContain("sliding-window");
    expect(question!.tags).toContain("hash-table");
    expect(question!.tags).toContain("two-pointers");
    expect(question!.starterCode).toContain("public int lengthOfLongestSubstring");
  });

  it("should verify every question has valid fields", () => {
    for (const question of QUESTION_BANK) {
      expect(question.id).toBeTruthy();
      expect(question.title).toBeTruthy();
      expect(question.description).toBeTruthy();
      expect(Array.isArray(question.examples)).toBe(true);
      expect(question.starterCode).toBeTruthy();
      expect(question.language).toBeTruthy();
      expect(question.fileName).toBeTruthy();
      expect(["easy", "medium", "hard"]).toContain(question.difficulty);
      expect(question.category).toBeTruthy();
      expect(Array.isArray(question.tags)).toBe(true);
    }
  });
});

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

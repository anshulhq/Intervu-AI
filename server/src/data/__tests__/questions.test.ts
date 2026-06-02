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

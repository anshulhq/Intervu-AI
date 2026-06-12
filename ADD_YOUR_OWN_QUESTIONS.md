# How to Add Your Own Custom Questions

Intervu AI features a highly modular, decoupled architecture that makes extending the question bank extremely straightforward. The Python voice agent and Express backend are designed to dynamically stream and ingest question metadata, meaning **you do not need to modify the voice agent or databases to add new questions**.

This guide covers:
1. [Defining a Custom Question](#1-defining-a-custom-question)
2. [Supported Languages & Starter Code](#2-supported-languages--starter-code)
3. [Registering a Custom Visualization (Optional)](#3-registering-a-custom-visualization-optional)
4. [Testing Your Questions](#4-testing-your-questions)

---

## 1. Defining a Custom Question

All interview questions are defined statically as `QuestionDef` objects in the backend's master question bank.

### Step 1: Open the Question Registry
Navigate to:
📂 `server/src/data/questions.ts`

### Step 2: Define your question object
Add a new object matching the `QuestionDef` interface to the `QUESTION_BANK` array:

```typescript
export interface QuestionDef {
  id: string;          // Unique slug used as the identifier (e.g. "two-sum")
  title: string;       // Display title shown in the UI and spoken by the agent
  description: string; // Detailed problem statement (supports Markdown)
  examples: string[];  // Input/output pairs to display in the Problem description tab
  starterCode: string; // Boilerplate code template pre-populated in the Monaco editor
  language: string;    // Language key (e.g. "java", "python", "javascript", "typescript", "cpp")
  fileName: string;    // Default filename displayed above the editor (e.g. "Solution.py")
  difficulty: "easy" | "medium" | "hard";
  category: string;    // Broad category (e.g. "Arrays & Hashing", "Stacks", "Graphs")
  tags: string[];      // Topic tags for filtering (e.g. ["array", "hash-map"])
  visualization?: string; // Optional: Unique key mapping to a frontend React visualizer component
}
```

### Example Question Definition

Here is an example of adding a **Python-based Two Sum** question:

```typescript
{
  id: "two-sum-python",
  title: "Two Sum (Python)",
  description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1]."
  ],
  starterCode: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass`,
  language: "python",
  fileName: "solution.py",
  difficulty: "easy",
  category: "Arrays & Hashing",
  tags: ["array", "hash-map"]
}
```

---

## 2. Supported Languages & Starter Code

The Monaco Editor integrated into the frontend supports the following language values out-of-the-box (defined in `client/lib/questions.ts`):

| `language` Key | Monaco Editor Mode | Default Extension | Default Filename |
|----------------|--------------------|-------------------|------------------|
| `java`         | `java`             | `.java`           | `Solution.java`  |
| `javascript`   | `javascript`       | `.js`             | `Solution.js`    |
| `python`       | `python`           | `.py`             | `Solution.py`    |
| `typescript`   | `typescript`       | `.ts`             | `Solution.ts`    |
| `cpp`          | `cpp`              | `.cpp`            | `Solution.cpp`   |

---

## 3. Registering a Custom Visualization (Optional)

If your question is complex and would benefit from an interactive visual aid (e.g., node list animations or grid paths), you can hook it up to a React component on the frontend.

### Step 1: Create your visualization component
Create a React component in the frontend codebase:
📂 `client/components/interview/MyCustomVisualization.tsx`

This component should render the visual state of the problem.

### Step 2: Register it in the Registry
Open:
📂 `client/components/interview/visualizations/registry.tsx`

Import your component and add it to the `registry` mapping:

```typescript
import { MyCustomVisualization } from "../MyCustomVisualization";

const registry: Record<string, VisualizationComponent> = {
  // Existing visualizations...
  "my-custom-viz-key": MyCustomVisualization,
};
```

### Step 3: Link it to the Question
In your `QuestionDef` object inside `server/src/data/questions.ts`, set the `visualization` field to match your registry key:

```typescript
{
  id: "my-custom-problem",
  title: "My Custom Problem",
  // ...other fields
  visualization: "my-custom-viz-key"
}
```

---

## 4. Testing Your Questions

To prevent duplicate IDs, missing fields, or incorrect formats, a Jest test suite is provided in the backend.

### Run tests locally
Before pushing your changes, run the test suite to ensure all question definitions are valid:

```bash
cd server
npm run test
```

This tests the following validation criteria:
- Every question has a unique `id` slug.
- All required fields (`title`, `description`, `examples`, `starterCode`, `language`, `fileName`, `difficulty`, `category`, `tags`) are populated.
- Difficulty corresponds to either `easy`, `medium`, or `hard`.

If you added a visualization, we recommend also adding a unit test in `server/src/data/__tests__/questions.test.ts` to assert that your specific question definition exists with the correct properties.

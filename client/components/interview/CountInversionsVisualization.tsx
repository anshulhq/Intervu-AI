"use client";

import React, { useState } from "react";

interface InversionPair {
  leftVal: number;
  rightVal: number;
  leftIdx: number;
  rightIdx: number;
}

interface StepInfo {
  title: string;
  description: string;
  leftArray: number[] | null;
  rightArray: number[] | null;
  mergedArray: (number | null)[];
  leftPointer: number | null;
  rightPointer: number | null;
  newInversions: InversionPair[];
  allInversions: InversionPair[];
  codeSnippet: string;
  phase: "init" | "divide" | "merge-sub" | "merge-final-compare" | "complete";
}

export function CountInversionsVisualization() {
  const [step, setStep] = useState(0);
  const originalArray = [2, 4, 1, 3, 5];

  const steps: StepInfo[] = [
    {
      title: "1. Initialization",
      description: "We start with the unsorted array [2, 4, 1, 3, 5] and set our inversion count to 0. We will use a divide-and-conquer Merge Sort approach to count inversions in O(N log N) time.",
      leftArray: null,
      rightArray: null,
      mergedArray: [2, 4, 1, 3, 5],
      leftPointer: null,
      rightPointer: null,
      newInversions: [],
      allInversions: [],
      codeSnippet: "// Initialize counter & start merge sort\nlong inversions = 0;\ninversions = mergeSort(arr, 0, arr.length - 1);",
      phase: "init",
    },
    {
      title: "2. Divide Phase",
      description: "We divide the array into two halves. Left half: [2, 4] (indices 0 to 1), and Right half: [1, 3, 5] (indices 2 to 4). We recursively process both halves first.",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [null, null, null, null, null],
      leftPointer: null,
      rightPointer: null,
      newInversions: [],
      allInversions: [],
      codeSnippet: "int mid = (left + right) / 2;\n// Recurse on left & right halves\ninv += mergeSort(arr, left, mid);\ninv += mergeSort(arr, mid + 1, right);",
      phase: "divide",
    },
    {
      title: "3. Subarrays Sorted",
      description: "After recursion, the left subarray [2, 4] and right subarray [1, 3, 5] are both individually sorted. We now prepare to merge them. Pointer i starts at Left[0] and j starts at Right[0].",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [null, null, null, null, null],
      leftPointer: 0,
      rightPointer: 0,
      newInversions: [],
      allInversions: [],
      codeSnippet: "// Merge sorted arrays Left and Right\nint i = 0, j = 0, k = left;\n// Compare elements at i and j...",
      phase: "merge-sub",
    },
    {
      title: "4. Compare Left[0] (2) and Right[0] (1)",
      description: "Compare Left[0] = 2 and Right[0] = 1. Since 2 > 1, the right element (1) is smaller. We insert 1 into the merged array. Because the left subarray is sorted, all elements from Left[i=0] to the end of Left are greater than 1. This adds (mid - i + 1) = 2 inversions: (2, 1) and (4, 1)!",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [1, null, null, null, null],
      leftPointer: 0,
      rightPointer: 0,
      newInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
      ],
      allInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
      ],
      codeSnippet: "if (left[i] <= right[j]) {\n    arr[k++] = left[i++];\n} else {\n    arr[k++] = right[j++]; // Insert 1\n    inversions += (mid - i + 1); // +2 (2 & 4)\n}",
      phase: "merge-final-compare",
    },
    {
      title: "5. Compare Left[0] (2) and Right[1] (3)",
      description: "Compare Left[0] = 2 and Right[1] = 3. Since 2 <= 3, the left element (2) is smaller. We insert 2 into the merged array and advance pointer i. No new inversions are created.",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [1, 2, null, null, null],
      leftPointer: 0,
      rightPointer: 1,
      newInversions: [],
      allInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
      ],
      codeSnippet: "if (left[i] <= right[j]) { // 2 <= 3\n    arr[k++] = left[i++]; // Insert 2\n} else {\n    arr[k++] = right[j++];\n    inversions += (mid - i + 1);\n}",
      phase: "merge-final-compare",
    },
    {
      title: "6. Compare Left[1] (4) and Right[1] (3)",
      description: "Compare Left[1] = 4 and Right[1] = 3. Since 4 > 3, the right element (3) is smaller. We insert 3 into the merged array. There is 1 element remaining in the left subarray ([4]) which is greater than 3. This adds (mid - i + 1) = 1 inversion: (4, 3)!",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [1, 2, 3, null, null],
      leftPointer: 1,
      rightPointer: 1,
      newInversions: [
        { leftVal: 4, rightVal: 3, leftIdx: 1, rightIdx: 3 },
      ],
      allInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
        { leftVal: 4, rightVal: 3, leftIdx: 1, rightIdx: 3 },
      ],
      codeSnippet: "if (left[i] <= right[j]) {\n    arr[k++] = left[i++];\n} else {\n    arr[k++] = right[j++]; // Insert 3\n    inversions += (mid - i + 1); // +1 (4)\n}",
      phase: "merge-final-compare",
    },
    {
      title: "7. Compare Left[1] (4) and Right[2] (5)",
      description: "Compare Left[1] = 4 and Right[2] = 5. Since 4 <= 5, the left element (4) is smaller. We insert 4 into the merged array. No new inversions are created.",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [1, 2, 3, 4, null],
      leftPointer: 1,
      rightPointer: 2,
      newInversions: [],
      allInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
        { leftVal: 4, rightVal: 3, leftIdx: 1, rightIdx: 3 },
      ],
      codeSnippet: "if (left[i] <= right[j]) { // 4 <= 5\n    arr[k++] = left[i++]; // Insert 4\n} else {\n    arr[k++] = right[j++];\n    inversions += (mid - i + 1);\n}",
      phase: "merge-final-compare",
    },
    {
      title: "8. Copy Remaining Element(s)",
      description: "The left subarray is fully exhausted. We copy the remaining elements of the right subarray (5) directly into the merged array. No new inversions are created.",
      leftArray: [2, 4],
      rightArray: [1, 3, 5],
      mergedArray: [1, 2, 3, 4, 5],
      leftPointer: null,
      rightPointer: 2,
      newInversions: [],
      allInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
        { leftVal: 4, rightVal: 3, leftIdx: 1, rightIdx: 3 },
      ],
      codeSnippet: "// Copy remaining right elements\nwhile (j < right.length) {\n    arr[k++] = right[j++];\n}",
      phase: "merge-final-compare",
    },
    {
      title: "9. Finished counting",
      description: "Merge Sort completes successfully. The array is now fully sorted as [1, 2, 3, 4, 5] and we have found a total of 3 inversions: (2, 1), (4, 1), and (4, 3).",
      leftArray: null,
      rightArray: null,
      mergedArray: [1, 2, 3, 4, 5],
      leftPointer: null,
      rightPointer: null,
      newInversions: [],
      allInversions: [
        { leftVal: 2, rightVal: 1, leftIdx: 0, rightIdx: 2 },
        { leftVal: 4, rightVal: 1, leftIdx: 1, rightIdx: 2 },
        { leftVal: 4, rightVal: 3, leftIdx: 1, rightIdx: 3 },
      ],
      codeSnippet: "return inversions; // Returns 3",
      phase: "complete",
    },
  ];

  const current = steps[step];

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Count Inversions
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N log N) Time & O(N) Space
        </span>
      </div>

      {/* Stepper buttons */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`px-2.5 py-1 text-[11px] rounded-lg transition-all border font-mono ${
              step === idx
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-850 hover:text-zinc-300"
            }`}
          >
            {idx === 0 ? "Init" : idx === steps.length - 1 ? "Result" : `Step ${idx}`}
          </button>
        ))}
      </div>

      {/* Title & Description of Current Step */}
      <div className="mb-6 p-4 bg-black/10 rounded-xl border border-zinc-800/30">
        <h5 className="text-xs font-semibold text-emerald-400 mb-1.5">{current.title}</h5>
        <p className="text-xs text-zinc-300 leading-relaxed">{current.description}</p>
      </div>

      {/* Arrays Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left/Right Arrays (Divide / Compare Phase) */}
        <div className="flex flex-col gap-4 justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Subarrays (Divide & Conquer)
          </p>

          <div className="flex gap-4 items-center">
            {/* Left Subarray Box */}
            <div className="flex-1 p-3.5 bg-black/20 rounded-xl border border-zinc-800/40 relative min-h-[100px]">
              <div className="text-[8px] font-mono text-zinc-500 mb-2 uppercase tracking-wider">
                Left Subarray
              </div>
              {current.leftArray ? (
                <div className="flex gap-2">
                  {current.leftArray.map((val, idx) => {
                    const isPointer = current.leftPointer === idx;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full py-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all duration-300 ${
                            isPointer
                              ? "bg-violet-500/25 border-violet-500 text-violet-300 ring-1 ring-violet-500/30"
                              : "bg-zinc-950/40 border-zinc-850 text-zinc-400"
                          }`}
                        >
                          {val}
                        </div>
                        <span className="text-[8px] font-mono text-zinc-600 mt-1">i = {idx}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-zinc-600 italic flex items-center justify-center h-12">
                  Not active
                </div>
              )}
            </div>

            {/* Split Indicator or Vs label */}
            <div className="text-zinc-600 font-mono text-xs font-bold">VS</div>

            {/* Right Subarray Box */}
            <div className="flex-1 p-3.5 bg-black/20 rounded-xl border border-zinc-800/40 relative min-h-[100px]">
              <div className="text-[8px] font-mono text-zinc-500 mb-2 uppercase tracking-wider">
                Right Subarray
              </div>
              {current.rightArray ? (
                <div className="flex gap-2">
                  {current.rightArray.map((val, idx) => {
                    const isPointer = current.rightPointer === idx;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full py-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all duration-300 ${
                            isPointer
                              ? "bg-sky-500/25 border-sky-500 text-sky-300 ring-1 ring-sky-500/30"
                              : "bg-zinc-950/40 border-zinc-850 text-zinc-400"
                          }`}
                        >
                          {val}
                        </div>
                        <span className="text-[8px] font-mono text-zinc-600 mt-1">j = {idx}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-zinc-600 italic flex items-center justify-center h-12">
                  Not active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Merged Array Box */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {current.phase === "init" ? "Input Array" : "Merged Array (Output)"}
          </p>

          <div className="p-3.5 bg-black/20 rounded-xl border border-zinc-800/40 min-h-[100px] flex flex-col justify-center">
            <div className="flex gap-2 justify-between">
              {current.mergedArray.map((val, idx) => {
                const isPopulated = val !== null;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full py-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all duration-300 ${
                        isPopulated
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                          : "bg-zinc-950/10 border-dashed border-zinc-800 text-zinc-700"
                      }`}
                    >
                      {isPopulated ? val : "-"}
                    </div>
                    <span className="text-[8px] font-mono text-zinc-600 mt-1">k = {idx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Inversions Counter & List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex flex-col justify-center items-center text-center">
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
            Inversion Count
          </span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
            {current.allInversions.length}
          </span>
          {current.newInversions.length > 0 && (
            <span className="text-[10px] text-emerald-400/80 font-mono mt-1.5 animate-pulse">
              +{current.newInversions.length} in this step!
            </span>
          )}
        </div>

        <div className="md:col-span-2 p-4 bg-black/20 border border-zinc-800/40 rounded-xl min-h-[105px]">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono block mb-2">
            Inversions Detected (Left &gt; Right and i &lt; j)
          </span>
          {current.allInversions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[70px] pr-1">
              {current.allInversions.map((pair, idx) => {
                const isNew = current.newInversions.some(
                  (np) => np.leftVal === pair.leftVal && np.rightVal === pair.rightVal
                );
                return (
                  <span
                    key={idx}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono border transition-all duration-300 ${
                      isNew
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-bounce"
                        : "bg-zinc-800/40 text-zinc-400 border-zinc-850"
                    }`}
                  >
                    arr[{pair.leftIdx}] ({pair.leftVal}) &gt; arr[{pair.rightIdx}] ({pair.rightVal})
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-[11px] text-zinc-600 italic flex items-center h-12">
              No inversions detected yet.
            </div>
          )}
        </div>
      </div>

      {/* Code Block */}
      <div className="pt-4 border-t border-zinc-800/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Code Execution
        </p>
        <pre className="p-3.5 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/90 border border-zinc-800/60 overflow-x-auto whitespace-pre leading-relaxed font-semibold">
          {current.codeSnippet}
        </pre>
      </div>
    </div>
  );
}

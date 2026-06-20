"use client";

import React, { useState } from "react";

interface StepInfo {
  title: string;
  description: string;
  low: number;
  high: number;
  i: number | null;
  j: number | null;
  nums1Left: number[];
  nums1Right: number[];
  nums2Left: number[];
  nums2Right: number[];
  nums1MidPointer: number | null;
  nums2MidPointer: number | null;
  comparisonResult: string;
  codeSnippet: string;
  phase: "init" | "partition" | "verify" | "adjust" | "complete";
}

export function MedianTwoSortedArraysVisualization() {
  const [step, setStep] = useState(0);

  const nums1 = [1, 3, 8, 9, 15];
  const nums2 = [7, 11, 18, 19, 21, 25];

  const steps: StepInfo[] = [
    {
      title: "1. Initialization",
      description: "We are given two sorted arrays: nums1 (size 5) and nums2 (size 6). To find the median in O(log(min(m, n))) time, we will perform binary search on the smaller array (nums1). We initialize our binary search range to [low, high] = [0, 5].",
      low: 0,
      high: 5,
      i: null,
      j: null,
      nums1Left: [],
      nums1Right: nums1,
      nums2Left: [],
      nums2Right: nums2,
      nums1MidPointer: null,
      nums2MidPointer: null,
      comparisonResult: "",
      codeSnippet: "// Set search range on smaller array\nint low = 0, high = m;\nint halfLen = (m + n + 1) / 2;",
      phase: "init",
    },
    {
      title: "2. First Partition (i = 2)",
      description: "We choose the midpoint in nums1: i = (0 + 5) / 2 = 2. This partitions nums1 into a left part [1, 3] and a right part [8, 9, 15]. The partition index j in nums2 is calculated as halfLen - i = 6 - 2 = 4, partitioning nums2 into [7, 11, 18, 19] and [21, 25].",
      low: 0,
      high: 5,
      i: 2,
      j: 4,
      nums1Left: [1, 3],
      nums1Right: [8, 9, 15],
      nums2Left: [7, 11, 18, 19],
      nums2Right: [21, 25],
      nums1MidPointer: 2,
      nums2MidPointer: 4,
      comparisonResult: "Compare: nums1[1] (3) <= nums2[4] (21) [OK], but nums2[3] (19) > nums1[2] (8) [NOT OK]!",
      codeSnippet: "int i = (low + high) / 2; // i = 2\nint j = halfLen - i;      // j = 4",
      phase: "partition",
    },
    {
      title: "3. Adjust Search Range (i was too small)",
      description: "Since nums2[j-1] > nums1[i] (19 > 8), it means we have partitioned too far to the left in nums1 (we need larger numbers from nums1 in our left half). We must shift our search range to the right: low = i + 1 = 3.",
      low: 3,
      high: 5,
      i: 2,
      j: 4,
      nums1Left: [1, 3],
      nums1Right: [8, 9, 15],
      nums2Left: [7, 11, 18, 19],
      nums2Right: [21, 25],
      nums1MidPointer: 2,
      nums2MidPointer: 4,
      comparisonResult: "nums2[j-1] > nums1[i] => low = i + 1",
      codeSnippet: "if (j > 0 && i < m && nums2[j-1] > nums1[i]) {\n    low = i + 1; // Search right half of nums1: low = 3\n}",
      phase: "adjust",
    },
    {
      title: "4. Second Partition (i = 4)",
      description: "With [low, high] = [3, 5], we choose the new midpoint: i = (3 + 5) / 2 = 4. This partitions nums1 into [1, 3, 8, 9] and [15]. The corresponding partition index in nums2 is j = 6 - 4 = 2, partitioning nums2 into [7, 11] and [18, 19, 21, 25].",
      low: 3,
      high: 5,
      i: 4,
      j: 2,
      nums1Left: [1, 3, 8, 9],
      nums1Right: [15],
      nums2Left: [7, 11],
      nums2Right: [18, 19, 21, 25],
      nums1MidPointer: 4,
      nums2MidPointer: 2,
      comparisonResult: "Compare: nums1[3] (9) <= nums2[2] (18) [OK] and nums2[1] (11) <= nums1[4] (15) [OK]",
      codeSnippet: "int i = (low + high) / 2; // i = 4\nint j = halfLen - i;      // j = 2",
      phase: "partition",
    },
    {
      title: "5. Verify Partition Boundaries",
      description: "We check the partition boundaries. Both nums1[i-1] <= nums2[j] (9 <= 18) and nums2[j-1] <= nums1[i] (11 <= 15) are true! This means we have successfully partitioned the arrays such that all elements on the left are smaller than or equal to all elements on the right.",
      low: 3,
      high: 5,
      i: 4,
      j: 2,
      nums1Left: [1, 3, 8, 9],
      nums1Right: [15],
      nums2Left: [7, 11],
      nums2Right: [18, 19, 21, 25],
      nums1MidPointer: 4,
      nums2MidPointer: 2,
      comparisonResult: "Perfect partition found!",
      codeSnippet: "else if (i > 0 && j < n && nums1[i-1] > nums2[j]) { ... }\nelse { // Correct partition!\n    // Calculate median...\n}",
      phase: "verify",
    },
    {
      title: "6. Calculate Median",
      description: "Since the total number of elements (5 + 6 = 11) is odd, the median is simply the maximum element in the left half of the partition: max(nums1[i-1], nums2[j-1]) = max(nums1[3], nums2[1]) = max(9, 11) = 11.0. This is the exact median of the combined sorted arrays.",
      low: 3,
      high: 5,
      i: 4,
      j: 2,
      nums1Left: [1, 3, 8, 9],
      nums1Right: [15],
      nums2Left: [7, 11],
      nums2Right: [18, 19, 21, 25],
      nums1MidPointer: 4,
      nums2MidPointer: 2,
      comparisonResult: "Median = max(9, 11) = 11.0",
      codeSnippet: "if ((m + n) % 2 != 0) {\n    return Math.max(nums1[i-1], nums2[j-1]); // Returns 11.0\n}",
      phase: "complete",
    },
  ];

  const current = steps[step];

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Median of Two Sorted Arrays
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(log(min(M, N))) Time & O(1) Space
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

      {/* Binary Search State */}
      <div className="mb-6 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-wider">Search Range</span>
          <span className="text-xs font-mono text-zinc-300 font-bold">[{current.low}, {current.high}]</span>
        </div>
        <div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-wider">Partition i</span>
          <span className="text-xs font-mono text-zinc-300 font-bold">{current.i !== null ? current.i : "-"}</span>
        </div>
        <div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-wider">Partition j</span>
          <span className="text-xs font-mono text-zinc-300 font-bold">{current.j !== null ? current.j : "-"}</span>
        </div>
        <div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-wider">Boundary Check</span>
          <span className="text-xs font-mono text-emerald-400 font-bold">{current.comparisonResult || "N/A"}</span>
        </div>
      </div>

      {/* Arrays Layout */}
      <div className="flex flex-col gap-6 mb-6">
        {/* Array 1 */}
        <div className="p-4 bg-black/20 rounded-xl border border-zinc-800/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Array 1 (nums1 - size {nums1.length})
            </span>
            {current.i !== null && (
              <span className="text-[9px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 border border-violet-500/20 rounded">
                Partition Index i = {current.i}
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {nums1.map((val, idx) => {
              const isLeft = idx < (current.i ?? 0);
              const isPointer = current.i === idx;
              const isRight = current.i !== null && idx >= current.i;
              
              let cardStyle = "bg-zinc-950/40 border-zinc-850 text-zinc-400";
              if (current.i !== null) {
                if (isLeft) cardStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                else if (isRight) cardStyle = "bg-amber-500/10 border-amber-500/30 text-amber-300";
              }
              if (isPointer) cardStyle += " ring-1 ring-violet-500 border-violet-500";

              return (
                <div key={idx} className="flex-1 min-w-[50px] flex flex-col items-center">
                  <div className={`w-full py-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all duration-300 ${cardStyle}`}>
                    {val}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 mt-1">idx {idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Array 2 */}
        <div className="p-4 bg-black/20 rounded-xl border border-zinc-800/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Array 2 (nums2 - size {nums2.length})
            </span>
            {current.j !== null && (
              <span className="text-[9px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 border border-violet-500/20 rounded">
                Partition Index j = {current.j}
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {nums2.map((val, idx) => {
              const isLeft = idx < (current.j ?? 0);
              const isPointer = current.j === idx;
              const isRight = current.j !== null && idx >= current.j;

              let cardStyle = "bg-zinc-950/40 border-zinc-850 text-zinc-400";
              if (current.j !== null) {
                if (isLeft) cardStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                else if (isRight) cardStyle = "bg-amber-500/10 border-amber-500/30 text-amber-300";
              }
              if (isPointer) cardStyle += " ring-1 ring-violet-500 border-violet-500";

              return (
                <div key={idx} className="flex-1 min-w-[50px] flex flex-col items-center">
                  <div className={`w-full py-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all duration-300 ${cardStyle}`}>
                    {val}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 mt-1">idx {idx}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Combined Partition State */}
      {current.i !== null && current.j !== null && (
        <div className="p-4 bg-zinc-900/80 border border-zinc-800/40 rounded-xl mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
            Combined Partition State
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block tracking-wider mb-2">
                Left Half (Max: {Math.max(current.nums1Left[current.nums1Left.length - 1] ?? -Infinity, current.nums2Left[current.nums2Left.length - 1] ?? -Infinity)})
              </span>
              <div className="text-[11px] font-mono text-zinc-300">
                Nums1: {JSON.stringify(current.nums1Left)}
                <br />
                Nums2: {JSON.stringify(current.nums2Left)}
              </div>
            </div>
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block tracking-wider mb-2">
                Right Half (Min: {Math.min(current.nums1Right[0] ?? Infinity, current.nums2Right[0] ?? Infinity)})
              </span>
              <div className="text-[11px] font-mono text-zinc-300">
                Nums1: {JSON.stringify(current.nums1Right)}
                <br />
                Nums2: {JSON.stringify(current.nums2Right)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Block */}
      <div className="pt-4 border-t border-zinc-800/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Algorithm Step
        </p>
        <pre className="p-3.5 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/90 border border-zinc-800/60 overflow-x-auto whitespace-pre leading-relaxed font-semibold">
          {current.codeSnippet}
        </pre>
      </div>
    </div>
  );
}

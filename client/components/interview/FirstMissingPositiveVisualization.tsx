"use client";

import React, { useState } from "react";

interface SortStepInfo {
  array: number[];
  currentIndex: number;
  highlightedIndices: number[];
  actionType: "init" | "swap" | "advance" | "complete" | "scan-success" | "scan-fail";
  description: string;
  codeSnippet: string;
}

export function FirstMissingPositiveVisualization() {
  const [step, setStep] = useState(0);

  const steps: SortStepInfo[] = [
    {
      array: [3, 4, -1, 1],
      currentIndex: 0,
      highlightedIndices: [],
      actionType: "init",
      description: "We start with the original array [3, 4, -1, 1]. Our goal is to place each positive integer x at index x - 1 (e.g. 1 at index 0, 2 at index 1...) using in-place swaps, then scan for the first mismatch.",
      codeSnippet: "int i = 0;\nint n = nums.length; // n = 4"
    },
    {
      array: [-1, 4, 3, 1],
      currentIndex: 0,
      highlightedIndices: [0, 2],
      actionType: "swap",
      description: "At index i = 0, nums[0] is 3. Since 3 is positive, <= n, and not at its correct index (which is 3 - 1 = 2), we swap it with the element at index 2, which is -1.",
      codeSnippet: "// nums[0] = 3 (target index 2)\nint temp = nums[0];\nnums[0] = nums[temp - 1];\nnums[temp - 1] = temp;\n// nums = [-1, 4, 3, 1]"
    },
    {
      array: [-1, 4, 3, 1],
      currentIndex: 1,
      highlightedIndices: [0],
      actionType: "advance",
      description: "At index i = 0, nums[0] is now -1. Since -1 is not a positive integer (> 0), it cannot be placed in its matching positive index. We advance the pointer i to 1.",
      codeSnippet: "if (nums[i] <= 0 || nums[i] > n) {\n    i++; // i is now 1\n}"
    },
    {
      array: [-1, 1, 3, 4],
      currentIndex: 1,
      highlightedIndices: [1, 3],
      actionType: "swap",
      description: "At index i = 1, nums[1] is 4. Since 4 is positive, <= n, and not at its correct index (which is 4 - 1 = 3), we swap it with the element at index 3, which is 1.",
      codeSnippet: "// nums[1] = 4 (target index 3)\nint temp = nums[1];\nnums[1] = nums[temp - 1];\nnums[temp - 1] = temp;\n// nums = [-1, 1, 3, 4]"
    },
    {
      array: [1, -1, 3, 4],
      currentIndex: 1,
      highlightedIndices: [1, 0],
      actionType: "swap",
      description: "At index i = 1, nums[1] is now 1. Since 1 is positive, <= n, and not at its correct index (which is 1 - 1 = 0), we swap it with the element at index 0, which is -1.",
      codeSnippet: "// nums[1] = 1 (target index 0)\nint temp = nums[1];\nnums[1] = nums[temp - 1];\nnums[temp - 1] = temp;\n// nums = [1, -1, 3, 4]"
    },
    {
      array: [1, -1, 3, 4],
      currentIndex: 2,
      highlightedIndices: [1],
      actionType: "advance",
      description: "At index i = 1, nums[1] is now -1. Since -1 <= 0, we cannot place it. We advance the pointer i to 2.",
      codeSnippet: "if (nums[i] <= 0) {\n    i++; // i is now 2\n}"
    },
    {
      array: [1, -1, 3, 4],
      currentIndex: 3,
      highlightedIndices: [2],
      actionType: "advance",
      description: "At index i = 2, nums[2] is 3. Since 3 is already at its correct index (3 - 1 = 2), no swap is needed. We advance the pointer i to 3.",
      codeSnippet: "if (nums[i] == i + 1) {\n    i++; // i is now 3\n}"
    },
    {
      array: [1, -1, 3, 4],
      currentIndex: 4,
      highlightedIndices: [3],
      actionType: "complete",
      description: "At index i = 3, nums[3] is 4. Since 4 is already at its correct index (4 - 1 = 3), we advance i to 4. The sorting loop terminates since i reached the end of the array.",
      codeSnippet: "// i = 4 (i >= n, loop terminates)\n// Sorting completed!"
    },
    {
      array: [1, -1, 3, 4],
      currentIndex: 1,
      highlightedIndices: [0],
      actionType: "scan-success",
      description: "Now we scan the array from left to right. Index 0 contains 1, which matches the expected value of 0 + 1 = 1. This is correct, so we move to index 1.",
      codeSnippet: "for (int j = 0; j < n; j++) {\n    if (nums[j] != j + 1) { // j=0: nums[0] == 1 (match)\n        ..."
    },
    {
      array: [1, -1, 3, 4],
      currentIndex: 1,
      highlightedIndices: [1],
      actionType: "scan-fail",
      description: "At index 1, nums[1] is -1, but we expected 2 (1 + 1). Since nums[1] != 2, we have found our first missing positive! We return 2.",
      codeSnippet: "    if (nums[j] != j + 1) { // j=1: -1 != 2 (mismatch)\n        return j + 1; // returns 2\n    }\n}"
    }
  ];

  const current = steps[step];

  const getElementStyles = (val: number, idx: number) => {
    const isCurrentPointer = current.currentIndex === idx && step < 8;
    const isHighlighted = current.highlightedIndices.includes(idx);

    if (current.actionType === "scan-fail" && idx === 1) {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.3)]",
        text: "text-red-300",
        badge: "Missing here"
      };
    }

    if (isCurrentPointer) {
      return {
        bg: "bg-sky-500/15",
        border: "border-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
        text: "text-sky-300",
        badge: "i pointer"
      };
    }

    if (isHighlighted) {
      return {
        bg: "bg-emerald-500/15",
        border: "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.25)]",
        text: "text-emerald-300",
        badge: "Swapping"
      };
    }

    if (val === idx + 1) {
      return {
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/30",
        text: "text-emerald-400/80",
        badge: "Placed"
      };
    }

    return {
      bg: "bg-zinc-950/40",
      border: "border-zinc-850",
      text: "text-zinc-400",
      badge: ""
    };
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 font-mono">
          Interactive Visualization: Cyclic Sort
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time & O(1) Space
        </span>
      </div>

      {/* Step Stepper buttons */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {steps.map((s, idx) => {
          let label = `Step ${idx}`;
          if (idx === 0) label = "Init";
          else if (idx === 8) label = "Scan: i=0";
          else if (idx === 9) label = "Scan: i=1 (Result)";

          return (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`px-2.5 py-1 text-[11px] rounded-lg transition-all border font-mono ${
                step === idx
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-850 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Array Elements Visualizer */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 font-mono">
          Array State: nums
        </p>
        <div className="flex gap-3 p-4 bg-black/20 rounded-xl border border-zinc-800/40 overflow-x-auto">
          {current.array.map((val, idx) => {
            const styles = getElementStyles(val, idx);
            return (
              <div key={idx} className="flex-1 min-w-[65px] flex flex-col items-center">
                <span className="text-[9px] font-mono text-zinc-600 mb-1">idx = {idx}</span>
                <div
                  className={`w-full p-4 rounded-xl border text-center font-mono transition-all duration-300 ${styles.bg} ${styles.border} ${styles.text}`}
                >
                  <div className="text-lg font-bold">{val}</div>
                  <div className="text-[8px] mt-1 text-zinc-500 font-mono">
                    Expected: {idx + 1}
                  </div>
                </div>
                {styles.badge && (
                  <span className={`text-[8px] font-mono mt-1.5 px-1 py-0.5 rounded ${
                    styles.badge === "Missing here"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : styles.badge === "i pointer"
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {styles.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Step Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {current.description}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Code Equivalent
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/90 border border-zinc-800/60 overflow-x-auto whitespace-pre">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

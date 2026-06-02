"use client";

import React, { useState } from "react";

interface ArrayStepInfo {
  array: number[];
  reversedRange: [number, number] | null;
  description: string;
  codeSnippet: string;
}

export function RotateArrayVisualization() {
  const [step, setStep] = useState(0);
  const k = 3;

  const steps: ArrayStepInfo[] = [
    {
      array: [1, 2, 3, 4, 5, 6, 7],
      reversedRange: null,
      description: "We start with the original array. Our goal is to shift all elements to the right by k = 3 steps in-place.",
      codeSnippet: "// Original array state\n// nums = [1, 2, 3, 4, 5, 6, 7]"
    },
    {
      array: [7, 6, 5, 4, 3, 2, 1],
      reversedRange: [0, 6],
      description: "First, we reverse the entire array. This places the elements that need to end up at the front in the correct general region, but they are currently backward.",
      codeSnippet: "reverse(nums, 0, nums.length - 1);\n// nums = [7, 6, 5, 4, 3, 2, 1]"
    },
    {
      array: [5, 6, 7, 4, 3, 2, 1],
      reversedRange: [0, 2],
      description: "Next, we reverse the first k = 3 elements. This restores the correct relative order of these elements at their final destination.",
      codeSnippet: "reverse(nums, 0, k - 1);\n// nums = [5, 6, 7, 4, 3, 2, 1]"
    },
    {
      array: [5, 6, 7, 1, 2, 3, 4],
      reversedRange: [3, 6],
      description: "Finally, we reverse the remaining n - k = 4 elements. This restores the correct relative order of the remaining elements. The array is now successfully rotated!",
      codeSnippet: "reverse(nums, k, nums.length - 1);\n// nums = [5, 6, 7, 1, 2, 3, 4]"
    }
  ];

  const current = steps[step];

  // Helper to determine element border/bg classes based on original role and step
  const getElementStyles = (val: number, index: number) => {
    // 5, 6, 7 are the "rotating" elements (last k elements in original array)
    const isRotatingElement = val >= 5;
    
    // Highlight if this index is within the reversed range of the current step
    const isCurrentlyReversing = current.reversedRange 
      ? index >= current.reversedRange[0] && index <= current.reversedRange[1]
      : false;

    if (isCurrentlyReversing) {
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
        text: "text-emerald-300",
        label: isRotatingElement ? "k-group" : "n-k group"
      };
    }

    if (isRotatingElement) {
      return {
        bg: "bg-violet-500/5",
        border: "border-violet-500/30",
        text: "text-violet-300",
        label: "k-group"
      };
    }

    return {
      bg: "bg-sky-500/5",
      border: "border-sky-500/30",
      text: "text-sky-300",
      label: "n-k group"
    };
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Rotate Array (k = {k})
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(1) Space Complexity
        </span>
      </div>

      {/* Stepper Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((_, s) => {
          const labels = [
            "0. Start State",
            "1. Reverse All",
            "2. Reverse First K",
            "3. Reverse Remaining"
          ];
          return (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all border font-mono ${
                step === s
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-850 hover:text-zinc-300"
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {/* Array Elements Container */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 bg-black/20 rounded-xl border border-zinc-800/40">
          {current.array.map((val, i) => {
            const styles = getElementStyles(val, i);
            return (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[40px]">
                {/* Index label */}
                <span className="text-[9px] font-mono text-zinc-600 mb-1">i = {i}</span>
                
                {/* Value Box */}
                <div
                  className={`w-full aspect-square flex items-center justify-center rounded-lg border text-sm font-mono font-bold transition-all duration-300 ${styles.bg} ${styles.border} ${styles.text}`}
                >
                  {val}
                </div>

                {/* Group label */}
                <span className={`text-[8px] font-mono mt-1.5 opacity-60 ${val >= 5 ? 'text-violet-400' : 'text-sky-400'}`}>
                  {val >= 5 ? 'K' : 'Rest'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Highlight Range Indicators */}
        {current.reversedRange && (
          <div className="absolute inset-x-0 -bottom-2 flex justify-between px-6 pointer-events-none">
            <div className="w-full relative flex items-center justify-center">
              <div className="absolute h-1 bg-emerald-500/30 rounded-full transition-all duration-300" 
                   style={{
                     left: `${(current.reversedRange[0] / 7) * 100}%`,
                     right: `${((6 - current.reversedRange[1]) / 7) * 100}%`
                   }}
              />
              <div className="absolute -bottom-4 text-[8px] font-mono text-emerald-400/80 bg-zinc-950 px-2 py-0.5 rounded border border-emerald-500/20">
                Reversing range [{current.reversedRange[0]} ... {current.reversedRange[1]}]
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Step Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed">
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

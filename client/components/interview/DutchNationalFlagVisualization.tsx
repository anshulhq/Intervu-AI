"use client";

import React, { useState, useEffect, useRef } from "react";

interface DNFStepInfo {
  array: number[];
  low: number;
  mid: number;
  high: number;
  description: string;
  codeSnippet: string;
  actionType: "init" | "swap-high" | "swap-low" | "increment-mid" | "complete";
  swappingIndices: [number, number] | null;
}

/**
 * DutchNationalFlagVisualization
 * 
 * An interactive, premium visual aid for the "Dutch National Flag" (Sort Colors — LeetCode 75) problem.
 * It demonstrates Dijkstra's 3-way partitioning algorithm to sort an array containing 0s (Red), 
 * 1s (White), and 2s (Blue) in a single pass with O(1) auxiliary space.
 */
export function DutchNationalFlagVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps: DNFStepInfo[] = [
    {
      array: [2, 0, 1, 2, 1, 0],
      low: 0,
      mid: 0,
      high: 5,
      description: "Initialize pointers: low = 0 (boundary for 0s), mid = 0 (current element), and high = 5 (boundary for 2s). We will process the array from left to right.",
      codeSnippet: "int low = 0, mid = 0;\nint high = nums.length - 1;\nwhile (mid <= high) { ... }",
      actionType: "init",
      swappingIndices: null
    },
    {
      array: [2, 0, 1, 2, 1, 0],
      low: 0,
      mid: 0,
      high: 5,
      description: "At mid = 0, nums[mid] is 2 (Blue). We swap nums[mid] with nums[high] (swap index 0 and 5) so that the 2 goes to the end of the array. Decrement high.",
      codeSnippet: "if (nums[mid] == 2) {\n    swap(nums, mid, high);\n    high--;\n}",
      actionType: "swap-high",
      swappingIndices: [0, 5]
    },
    {
      array: [0, 0, 1, 2, 1, 2],
      low: 0,
      mid: 0,
      high: 4,
      description: "At mid = 0, nums[mid] is now 0 (Red). We swap nums[mid] with nums[low] (swap index 0 and 0) and increment both low and mid.",
      codeSnippet: "else if (nums[mid] == 0) {\n    swap(nums, mid, low);\n    low++;\n    mid++;\n}",
      actionType: "swap-low",
      swappingIndices: [0, 0]
    },
    {
      array: [0, 0, 1, 2, 1, 2],
      low: 1,
      mid: 1,
      high: 4,
      description: "At mid = 1, nums[mid] is 0 (Red). We swap nums[mid] with nums[low] (swap index 1 and 1) and increment low and mid.",
      codeSnippet: "else if (nums[mid] == 0) {\n    swap(nums, mid, low);\n    low++;\n    mid++;\n}",
      actionType: "swap-low",
      swappingIndices: [1, 1]
    },
    {
      array: [0, 0, 1, 2, 1, 2],
      low: 2,
      mid: 2,
      high: 4,
      description: "At mid = 2, nums[mid] is 1 (White). Since whites belong in the middle, it's already in the correct group. Simply increment mid.",
      codeSnippet: "else { // nums[mid] == 1\n    mid++;\n}",
      actionType: "increment-mid",
      swappingIndices: null
    },
    {
      array: [0, 0, 1, 2, 1, 2],
      low: 2,
      mid: 3,
      high: 4,
      description: "At mid = 3, nums[mid] is 2 (Blue). Swap nums[mid] with nums[high] (swap index 3 and 4) and decrement high.",
      codeSnippet: "if (nums[mid] == 2) {\n    swap(nums, mid, high);\n    high--;\n}",
      actionType: "swap-high",
      swappingIndices: [3, 4]
    },
    {
      array: [0, 0, 1, 1, 2, 2],
      low: 2,
      mid: 3,
      high: 3,
      description: "At mid = 3, nums[mid] is now 1 (White). Since it is in the correct group, we simply increment mid.",
      codeSnippet: "else { // nums[mid] == 1\n    mid++;\n}",
      actionType: "increment-mid",
      swappingIndices: null
    },
    {
      array: [0, 0, 1, 1, 2, 2],
      low: 2,
      mid: 4,
      high: 3,
      description: "Now mid = 4 is greater than high = 3. The loop condition (mid <= high) is no longer met, meaning sorting is complete!",
      codeSnippet: "// Loop terminated: mid > high\n// nums = [0, 0, 1, 1, 2, 2]",
      actionType: "complete",
      swappingIndices: null
    }
  ];

  const current = steps[step];

  // Auto play logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  const handlePrev = () => {
    setIsPlaying(false);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  // Helper to determine background, border, text colors for red (0), white (1), and blue (2) elements
  const getColorStyles = (value: number, index: number) => {
    const isSwapping = current.swappingIndices?.includes(index);
    const isMid = current.mid === index && current.actionType !== "complete";

    // Base colors for each color class
    let colorClass = {
      bg: "bg-red-500/10 hover:bg-red-500/20",
      border: "border-red-500/30",
      text: "text-red-300",
      indicatorColor: "bg-red-500",
      label: "Red (0)"
    };

    if (value === 1) {
      colorClass = {
        bg: "bg-zinc-100/5 hover:bg-zinc-100/10",
        border: "border-zinc-500/30",
        text: "text-zinc-300",
        indicatorColor: "bg-zinc-300",
        label: "White (1)"
      };
    } else if (value === 2) {
      colorClass = {
        bg: "bg-blue-500/10 hover:bg-blue-500/20",
        border: "border-blue-500/30",
        text: "text-blue-300",
        indicatorColor: "bg-blue-500",
        label: "Blue (2)"
      };
    }

    if (isSwapping) {
      return {
        ...colorClass,
        bg: "bg-amber-500/20",
        border: "border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse",
        text: "text-amber-300",
      };
    }

    if (isMid) {
      return {
        ...colorClass,
        bg: "bg-emerald-500/15",
        border: "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
        text: "text-emerald-300",
      };
    }

    return colorClass;
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 font-mono">
            Interactive Visualization: Dutch National Flag
          </h4>
          <span className="text-[10px] text-zinc-400 mt-0.5">
            Sort 3 colors (0: Red, 1: White, 2: Blue) in-place
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time & O(1) Space
        </span>
      </div>

      {/* Stepper Buttons & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setStep(idx);
              }}
              className={`px-2 py-1 text-[10px] rounded-md border font-mono transition-all ${
                step === idx
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-850 hover:text-zinc-300"
              }`}
            >
              {idx === 0 ? "Start" : idx === steps.length - 1 ? "End" : `Step ${idx}`}
            </button>
          ))}
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-1.5 bg-zinc-950/40 p-1 border border-zinc-800/50 rounded-lg">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="p-1 text-xs rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Previous Step"
          >
            ←
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors ${
              isPlaying
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {isPlaying ? "Pause" : "Auto Play"}
          </button>
          <button
            onClick={handleNext}
            disabled={step === steps.length - 1}
            className="p-1 text-xs rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Next Step"
          >
            →
          </button>
          <button
            onClick={handleReset}
            className="p-1 text-[10px] text-zinc-500 hover:text-zinc-300 font-mono"
            title="Reset to Step 0"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Array Display */}
      <div className="mb-6">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2 font-mono">
          Array Partitioning State
        </p>

        {/* Array Container */}
        <div className="relative flex gap-3 p-5 bg-black/20 rounded-xl border border-zinc-800/40 overflow-x-auto">
          {current.array.map((val, idx) => {
            const styles = getColorStyles(val, idx);
            const isLow = idx === current.low;
            const isMid = idx === current.mid;
            const isHigh = idx === current.high;
            const isComplete = current.actionType === "complete";

            return (
              <div key={idx} className="flex-1 min-w-[70px] flex flex-col items-center">
                {/* Index marker */}
                <span className="text-[9px] font-mono text-zinc-600 mb-1">i = {idx}</span>

                {/* Array Box */}
                <div
                  className={`w-full p-4 rounded-xl border text-center font-mono transition-all duration-300 ${styles.bg} ${styles.border} ${styles.text}`}
                >
                  <div className="text-xl font-extrabold flex items-center justify-center gap-1.5">
                    {/* Small color dot */}
                    <span className={`w-2.5 h-2.5 rounded-full ${styles.indicatorColor}`} />
                    {val}
                  </div>
                  <div className="text-[7.5px] mt-1 text-zinc-500 font-mono leading-none">
                    {styles.label}
                  </div>
                </div>

                {/* Pointer tags */}
                <div className="h-10 flex flex-col gap-0.5 mt-2 justify-start items-center">
                  {!isComplete && isMid && (
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                      ▲ mid
                    </span>
                  )}
                  {!isComplete && isLow && (
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded">
                      ▲ low
                    </span>
                  )}
                  {!isComplete && isHigh && (
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded">
                      ▲ high
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partition Boundaries Visualizer */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
          <div className="p-1.5 bg-red-500/5 border border-red-500/20 text-red-400/90 rounded-lg">
            nums[0...low-1]
            <div className="font-bold text-[10px]">RED (0s)</div>
          </div>
          <div className="p-1.5 bg-zinc-100/5 border border-zinc-500/20 text-zinc-400 rounded-lg">
            nums[low...mid-1]
            <div className="font-bold text-[10px]">WHITE (1s)</div>
          </div>
          <div className="p-1.5 bg-blue-500/5 border border-blue-500/20 text-blue-400/90 rounded-lg">
            nums[high+1...end]
            <div className="font-bold text-[10px]">BLUE (2s)</div>
          </div>
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">
            Step Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {current.description}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">
            Code Equivalent
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[9px] font-mono text-emerald-300/90 border border-zinc-800/60 overflow-x-auto whitespace-pre">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface StepInfo {
  index: number;
  val: number | null;
  heap: number[];
  action: "init" | "push" | "skip" | "pop_push" | "done";
  comparison: string;
  description: string;
  codeSnippet: string;
}

export function KthLargestElementVisualization() {
  const [step, setStep] = useState(0);
  const nums = [3, 2, 1, 5, 6, 4];
  const k = 2;

  const steps: StepInfo[] = [
    {
      index: -1,
      val: null,
      heap: [],
      action: "init",
      comparison: "",
      description: "We initialize an empty Min-Heap. The heap will store the k largest elements. The top of the heap will always be the minimum of these k elements (our kth largest so far).",
      codeSnippet: "// Initialize a Min-Heap\nPriorityQueue<Integer> minHeap = new PriorityQueue<>();"
    },
    {
      index: 0,
      val: 3,
      heap: [3],
      action: "push",
      comparison: "Heap size (0) < k (2). Directly push 3.",
      description: "Processing nums[0] = 3. Since the heap size is less than k, we push 3 directly into the heap.",
      codeSnippet: "minHeap.add(3); // Heap: [3]"
    },
    {
      index: 1,
      val: 2,
      heap: [2, 3],
      action: "push",
      comparison: "Heap size (1) < k (2). Directly push 2.",
      description: "Processing nums[1] = 2. Since the heap size is less than k, we push 2 directly. The heap automatically adjusts so the minimum (2) is at the top.",
      codeSnippet: "minHeap.add(2); // Heap: [2, 3]"
    },
    {
      index: 2,
      val: 1,
      heap: [2, 3],
      action: "skip",
      comparison: "Compare nums[2] (1) with heap top (2). 1 <= 2.",
      description: "Processing nums[2] = 1. Since 1 is less than or equal to the heap minimum (2), it cannot be one of the k largest elements. We skip it.",
      codeSnippet: "if (1 > minHeap.peek()) { ... } // 1 > 2 is false, do nothing"
    },
    {
      index: 3,
      val: 5,
      heap: [3, 5],
      action: "pop_push",
      comparison: "Compare nums[3] (5) with heap top (2). 5 > 2.",
      description: "Processing nums[3] = 5. Since 5 is greater than the heap minimum (2), we pop 2 from the heap and push 5. The heap size remains k, and the new minimum (3) bubbles to the top.",
      codeSnippet: "minHeap.poll(); // Remove 2\nminHeap.add(5); // Add 5. Heap: [3, 5]"
    },
    {
      index: 4,
      val: 6,
      heap: [5, 6],
      action: "pop_push",
      comparison: "Compare nums[4] (6) with heap top (3). 6 > 3.",
      description: "Processing nums[4] = 6. Since 6 is greater than the heap minimum (3), we pop 3 and push 6. The heap now contains [5, 6], with 5 at the top.",
      codeSnippet: "minHeap.poll(); // Remove 3\nminHeap.add(6); // Add 6. Heap: [5, 6]"
    },
    {
      index: 5,
      val: 4,
      heap: [5, 6],
      action: "skip",
      comparison: "Compare nums[5] (4) with heap top (5). 4 <= 5.",
      description: "Processing nums[5] = 4. Since 4 is less than or equal to the heap minimum (5), we skip it.",
      codeSnippet: "if (4 > minHeap.peek()) { ... } // 4 > 5 is false, do nothing"
    },
    {
      index: 6,
      val: null,
      heap: [5, 6],
      action: "done",
      comparison: "Finished iterating.",
      description: "We have finished scanning the array. The element at the top of the min-heap is our result: 5.",
      codeSnippet: "return minHeap.peek(); // Returns 5"
    }
  ];

  const current = steps[step];

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl animate-in fade-in duration-355">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Kth Largest Element (k = {k})
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono animate-pulse">
          O(N log K) Time & O(K) Space
        </span>
      </div>

      {/* Stepper buttons */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {steps.map((_, s) => {
          let label = "Init";
          if (s > 0 && s < steps.length - 1) {
            label = `nums[${s - 1}] (${nums[s - 1]})`;
          } else if (s === steps.length - 1) {
            label = "Done";
          }
          return (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-2.5 py-1 text-[11px] rounded-lg transition-all border font-mono ${
                step === s
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-850 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Input Array Representation */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Input Array: nums
        </p>
        <div className="flex gap-2 p-3 bg-black/20 rounded-xl border border-zinc-800/40 overflow-x-auto">
          {nums.map((val, idx) => {
            const isCurrent = current.index === idx;
            return (
              <div
                key={idx}
                className={`flex-1 min-w-[50px] p-3 rounded-lg border transition-all duration-300 text-center font-mono ${
                  isCurrent
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "bg-zinc-950/40 border-zinc-850 text-zinc-400"
                }`}
              >
                <div className="text-[8px] text-zinc-600 mb-1">i = {idx}</div>
                <div className="text-sm font-bold">{val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heap State Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Min-Heap visual */}
        <div className="p-4 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col items-center justify-center min-h-[140px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4 self-start">
            Min-Heap (Max Size k = 2)
          </p>
          {current.heap.length === 0 ? (
            <div className="text-xs text-zinc-500 italic">Heap is empty</div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
              {/* Heap top */}
              <div className="flex flex-col items-center relative">
                <div className="px-4 py-2 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 rounded-lg font-mono font-bold text-center shadow-[0_0_15px_rgba(16,185,129,0.25)] min-w-[80px]">
                  {current.heap[0]}
                </div>
                <span className="text-[8px] text-emerald-400 font-mono mt-1 font-bold">Top of Heap (Min)</span>
              </div>

              {/* Children (if heap has 2 elements) */}
              {current.heap.length > 1 && (
                <div className="flex justify-center w-full relative pt-2">
                  {/* Line from top to child */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-zinc-700" />
                  
                  <div className="flex flex-col items-center mt-1">
                    <div className="px-4 py-2 bg-zinc-850 border border-zinc-700 text-zinc-300 rounded-lg font-mono font-bold min-w-[80px] text-center">
                      {current.heap[1]}
                    </div>
                    <span className="text-[8px] text-zinc-500 font-mono mt-1">Heap Element</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current action/comparison */}
        <div className="p-4 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Decision Step
            </p>
            <div className="font-mono text-xs text-zinc-300 leading-relaxed font-semibold">
              {current.comparison ? (
                <span className="block mb-2 text-violet-400 font-bold">{current.comparison}</span>
              ) : (
                <span className="block mb-2 text-zinc-500 italic font-normal">Initializing heap...</span>
              )}
              <div className="text-[11px] text-zinc-400 font-normal">
                {current.action === "push" && "Action: Push element to heap because size is less than k."}
                {current.action === "skip" && "Action: Skip element because it is not larger than the heap top."}
                {current.action === "pop_push" && "Action: Pop heap top and push new element."}
                {current.action === "done" && "Result: Top of heap (5) is the kth largest element."}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Heap Size</span>
            <span className="font-mono text-xs font-bold text-white">
              {current.heap.length} / {k}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-800/40">
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

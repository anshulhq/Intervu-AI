"use client";

import React, { useState } from "react";
import { Play, RotateCcw, ChevronLeft, ChevronRight, Layers, Award } from "lucide-react";

interface HistStepInfo {
  i: number;
  stack: number[]; // indices in stack
  maxArea: number;
  currentRect: {
    start: number;
    end: number;
    height: number;
    width: number;
  } | null;
  poppedIndex: number | null;
  description: string;
  codeSnippet: string;
  action: "start" | "push" | "pop" | "evaluate" | "complete";
}

export function LargestRectangleVisualization() {
  const [step, setStep] = useState(0);
  const heights = [2, 1, 5, 6, 2, 3];

  const steps: HistStepInfo[] = [
    {
      i: 0,
      stack: [],
      maxArea: 0,
      currentRect: null,
      poppedIndex: null,
      description: "Initialize an empty stack to store indices, and set maxArea to 0. We will iterate through each bar in the histogram.",
      codeSnippet: "Stack<Integer> stack = new Stack<>();\nint maxArea = 0;\nint i = 0;",
      action: "start"
    },
    {
      i: 0,
      stack: [],
      maxArea: 0,
      currentRect: null,
      poppedIndex: null,
      description: "At index i = 0, heights[0] = 2. Since the stack is empty, we push index 0 onto the stack.",
      codeSnippet: "if (stack.isEmpty() || heights[i] >= heights[stack.peek()]) {\n    stack.push(i); // Push index 0 (height 2)\n    i++;\n}",
      action: "push"
    },
    {
      i: 1,
      stack: [0],
      maxArea: 0,
      currentRect: null,
      poppedIndex: null,
      description: "Index 0 is pushed onto the stack. We increment i to 1.",
      codeSnippet: "stack.push(0);\ni++; // i is now 1",
      action: "push"
    },
    {
      i: 1,
      stack: [0],
      maxArea: 0,
      currentRect: null,
      poppedIndex: null,
      description: "At index i = 1, heights[1] = 1. Since heights[1] (1) is less than heights[stack.peek()] (heights[0] = 2), we must pop index 0 and calculate the area of the rectangle.",
      codeSnippet: "while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {\n    int h = heights[stack.pop()];\n    // ...\n}",
      action: "pop"
    },
    {
      i: 1,
      stack: [],
      maxArea: 2,
      currentRect: { start: 0, end: 0, height: 2, width: 1 },
      poppedIndex: 0,
      description: "Pop index 0 (height h = 2). Since the stack is now empty, the width is w = i = 1. Area = h * w = 2 * 1 = 2. We update maxArea = max(0, 2) = 2.",
      codeSnippet: "int h = heights[stack.pop()]; // h = heights[0] = 2\nint w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 1\nmaxArea = Math.max(maxArea, h * w); // maxArea = 2",
      action: "evaluate"
    },
    {
      i: 2,
      stack: [1],
      maxArea: 2,
      currentRect: null,
      poppedIndex: null,
      description: "Now heights[1] (1) is greater than heights of the top of the stack (which is empty), so we push index 1 onto the stack and increment i to 2.",
      codeSnippet: "stack.push(1);\ni++; // i is now 2",
      action: "push"
    },
    {
      i: 2,
      stack: [1],
      maxArea: 2,
      currentRect: null,
      poppedIndex: null,
      description: "At index i = 2, heights[2] = 5. Since heights[2] (5) is greater than heights[stack.peek()] (heights[1] = 1), we push index 2 onto the stack and increment i to 3.",
      codeSnippet: "if (stack.isEmpty() || heights[i] >= heights[stack.peek()]) {\n    stack.push(2); // Push index 2 (height 5)\n    i++;\n}",
      action: "push"
    },
    {
      i: 3,
      stack: [1, 2],
      maxArea: 2,
      currentRect: null,
      poppedIndex: null,
      description: "Index 2 is pushed onto the stack. We increment i to 3.",
      codeSnippet: "stack.push(2);\ni++; // i is now 3",
      action: "push"
    },
    {
      i: 3,
      stack: [1, 2],
      maxArea: 2,
      currentRect: null,
      poppedIndex: null,
      description: "At index i = 3, heights[3] = 6. Since heights[3] (6) is greater than heights[stack.peek()] (heights[2] = 5), we push index 3 onto the stack and increment i to 4.",
      codeSnippet: "if (stack.isEmpty() || heights[i] >= heights[stack.peek()]) {\n    stack.push(3); // Push index 3 (height 6)\n    i++;\n}",
      action: "push"
    },
    {
      i: 4,
      stack: [1, 2, 3],
      maxArea: 2,
      currentRect: null,
      poppedIndex: null,
      description: "Index 3 is pushed onto the stack. We increment i to 4.",
      codeSnippet: "stack.push(3);\ni++; // i is now 4",
      action: "push"
    },
    {
      i: 4,
      stack: [1, 2, 3],
      maxArea: 2,
      currentRect: null,
      poppedIndex: null,
      description: "At index i = 4, heights[4] = 2. Since heights[4] (2) is less than heights[stack.peek()] (heights[3] = 6), we must pop index 3 and calculate the area.",
      codeSnippet: "while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {\n    int h = heights[stack.pop()];\n    // ...\n}",
      action: "pop"
    },
    {
      i: 4,
      stack: [1, 2],
      maxArea: 6,
      currentRect: { start: 3, end: 3, height: 6, width: 1 },
      poppedIndex: 3,
      description: "Pop index 3 (height h = 6). Top of stack is now index 2. Width w = i - stack.peek() - 1 = 4 - 2 - 1 = 1. Area = h * w = 6 * 1 = 6. We update maxArea = max(2, 6) = 6.",
      codeSnippet: "int h = heights[stack.pop()]; // h = heights[3] = 6\nint w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 4 - 2 - 1 = 1\nmaxArea = Math.max(maxArea, h * w); // maxArea = 6",
      action: "evaluate"
    },
    {
      i: 4,
      stack: [1],
      maxArea: 10,
      currentRect: { start: 2, end: 3, height: 5, width: 2 },
      poppedIndex: 2,
      description: "Since heights[4] (2) is still less than heights[stack.peek()] (heights[2] = 5), we pop index 2 (height h = 5). Top of stack is index 1. Width w = i - stack.peek() - 1 = 4 - 1 - 1 = 2. Area = h * w = 5 * 2 = 10. We update maxArea = max(6, 10) = 10.",
      codeSnippet: "int h = heights[stack.pop()]; // h = heights[2] = 5\nint w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 4 - 1 - 1 = 2\nmaxArea = Math.max(maxArea, h * w); // maxArea = 10",
      action: "evaluate"
    },
    {
      i: 5,
      stack: [1, 4],
      maxArea: 10,
      currentRect: null,
      poppedIndex: null,
      description: "Now heights[4] (2) is greater than heights[stack.peek()] (heights[1] = 1). We stop popping, push index 4 onto the stack, and increment i to 5.",
      codeSnippet: "stack.push(4);\ni++; // i is now 5",
      action: "push"
    },
    {
      i: 5,
      stack: [1, 4],
      maxArea: 10,
      currentRect: null,
      poppedIndex: null,
      description: "At index i = 5, heights[5] = 3. Since heights[5] (3) is greater than heights[stack.peek()] (heights[4] = 2), we push index 5 onto the stack and increment i to 6.",
      codeSnippet: "if (stack.isEmpty() || heights[i] >= heights[stack.peek()]) {\n    stack.push(5); // Push index 5 (height 3)\n    i++;\n}",
      action: "push"
    },
    {
      i: 6,
      stack: [1, 4, 5],
      maxArea: 10,
      currentRect: null,
      poppedIndex: null,
      description: "Index 5 is pushed onto the stack. We increment i to 6 (end of the array).",
      codeSnippet: "stack.push(5);\ni++; // i is now 6",
      action: "push"
    },
    {
      i: 6,
      stack: [1, 4, 5],
      maxArea: 10,
      currentRect: null,
      poppedIndex: null,
      description: "Array iteration is complete (i = 6). Now we empty the stack. Pop index 5 (height h = 3). Top of stack is index 4. Width w = i - stack.peek() - 1 = 6 - 4 - 1 = 1. Area = h * w = 3 * 1 = 3. maxArea remains 10.",
      codeSnippet: "while (!stack.isEmpty()) {\n    int h = heights[stack.pop()]; // h = heights[5] = 3\n    int w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 6 - 4 - 1 = 1\n    maxArea = Math.max(maxArea, h * w);\n}",
      action: "evaluate"
    },
    {
      i: 6,
      stack: [1, 4],
      maxArea: 10,
      currentRect: { start: 5, end: 5, height: 3, width: 1 },
      poppedIndex: 5,
      description: "Pop index 5 (height h = 3). Top of stack is now index 4. Width w = i - stack.peek() - 1 = 6 - 4 - 1 = 1. Area = h * w = 3 * 1 = 3. maxArea remains 10.",
      codeSnippet: "    int h = heights[stack.pop()]; // h = heights[5] = 3\n    int w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 1\n    maxArea = Math.max(maxArea, h * w);",
      action: "evaluate"
    },
    {
      i: 6,
      stack: [1],
      maxArea: 10,
      currentRect: { start: 2, end: 5, height: 2, width: 4 },
      poppedIndex: 4,
      description: "Pop index 4 (height h = 2). Top of stack is now index 1. Width w = i - stack.peek() - 1 = 6 - 1 - 1 = 4. Area = h * w = 2 * 4 = 8. maxArea remains 10.",
      codeSnippet: "    int h = heights[stack.pop()]; // h = heights[4] = 2\n    int w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 6 - 1 - 1 = 4\n    maxArea = Math.max(maxArea, h * w);",
      action: "evaluate"
    },
    {
      i: 6,
      stack: [],
      maxArea: 10,
      currentRect: { start: 0, end: 5, height: 1, width: 6 },
      poppedIndex: 1,
      description: "Pop index 1 (height h = 1). Since the stack is empty, the width is w = i = 6. Area = h * w = 1 * 6 = 6. maxArea remains 10.",
      codeSnippet: "    int h = heights[stack.pop()]; // h = heights[1] = 1\n    int w = stack.isEmpty() ? i : i - stack.peek() - 1; // w = 6\n    maxArea = Math.max(maxArea, h * w);",
      action: "evaluate"
    },
    {
      i: 6,
      stack: [],
      maxArea: 10,
      currentRect: null,
      poppedIndex: null,
      description: "All stack elements are processed. The final maximum area of the largest rectangle in the histogram is 10.",
      codeSnippet: "return maxArea; // returns 10",
      action: "complete"
    }
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Monotonic Stack (heights = [2, 1, 5, 6, 2, 3])
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded font-mono">
          O(N) Time Complexity
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="p-1.5 bg-zinc-800/40 hover:bg-zinc-855 text-zinc-350 hover:text-zinc-200 border border-zinc-800/50 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={step === steps.length - 1}
            className="p-1.5 bg-zinc-800/40 hover:bg-zinc-855 text-zinc-350 hover:text-zinc-200 border border-zinc-800/50 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-zinc-800/40 hover:bg-zinc-855 text-zinc-350 hover:text-zinc-200 border border-zinc-800/50 rounded-lg transition-all"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="text-[10px] font-mono text-zinc-500">
          Step {step + 1} of {steps.length}
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Histogram & Current Stack (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Histogram Chart Container */}
          <div className="relative p-6 bg-black/20 rounded-xl border border-zinc-800/40 h-56 flex items-end justify-between gap-3 overflow-hidden">
            {/* Y-axis lines for height reference */}
            <div className="absolute inset-y-6 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-20">
              {[6, 5, 4, 3, 2, 1, 0].map((val) => (
                <div key={val} className="w-full border-t border-dashed border-zinc-650 flex items-start">
                  <span className="text-[8px] font-mono text-zinc-500 pl-2 -mt-1.5">{val}</span>
                </div>
              ))}
            </div>

            {/* Heights Bars */}
            {heights.map((h, idx) => {
              // Highlight flags
              const isPointer = current.i === idx && current.action !== "complete";
              const isInStack = current.stack.includes(idx);
              const isPopped = current.poppedIndex === idx;
              
              // Determine border and background styles based on role
              let barBg = "bg-zinc-800/30";
              let barBorder = "border-zinc-800";
              let shadowClass = "";

              if (isPointer) {
                barBg = "bg-amber-500/20";
                barBorder = "border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.25)]";
              } else if (isPopped) {
                barBg = "bg-rose-500/35";
                barBorder = "border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.4)]";
              } else if (isInStack) {
                barBg = "bg-violet-500/15";
                barBorder = "border-violet-500/50 shadow-[0_0_6px_rgba(139,92,246,0.15)]";
              }

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end z-10 transition-all duration-300"
                  style={{ height: "100%" }}
                >
                  <span className={`text-[9px] font-mono mb-1 font-bold ${isPointer ? 'text-amber-400' : isInStack ? 'text-violet-400' : 'text-zinc-500'}`}>
                    h={h}
                  </span>

                  <div
                    className={`w-full rounded-t-lg border-t border-x transition-all duration-300 flex items-end justify-center pb-2 relative group ${barBg} ${barBorder} ${shadowClass}`}
                    style={{ height: `${(h / 7) * 100}%` }}
                  >
                    {/* Inner highlight showing the stack rank */}
                    {isInStack && (
                      <div className="absolute top-1 inset-x-1 bottom-1 bg-violet-500/5 rounded-t-md border-t border-dashed border-violet-500/20" />
                    )}

                    <span className="text-xs font-mono font-bold select-none text-zinc-400">
                      {h}
                    </span>
                  </div>

                  <span className={`text-[9px] font-mono mt-1.5 font-bold ${isPointer ? 'text-amber-400' : 'text-zinc-650'}`}>
                    i={idx}
                  </span>
                </div>
              );
            })}

            {/* Rectangle Overlay */}
            {current.currentRect && (
              <div
                className="absolute bottom-[32px] border-2 border-emerald-500 bg-emerald-500/20 rounded-md transition-all duration-300 z-20 flex flex-col items-center justify-center pointer-events-none"
                style={{
                  left: `calc(1.5rem + (${current.currentRect.start} * (100% - 3rem) / 6))`,
                  width: `calc(${current.currentRect.width} * (100% - 3rem) / 6)`,
                  height: `${(current.currentRect.height / 7) * 100}%`,
                }}
              >
                <div className="px-2 py-1 bg-emerald-950/90 border border-emerald-500/40 rounded text-[9px] font-mono text-emerald-400 font-bold shadow-lg text-center backdrop-blur-sm">
                  <div>Area: {current.currentRect.height} * {current.currentRect.width} = {current.currentRect.height * current.currentRect.width}</div>
                </div>
              </div>
            )}
          </div>

          {/* Stack Visualizer */}
          <div className="p-4 bg-zinc-950/40 border border-zinc-800/40 rounded-xl">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
              <Layers size={12} className="text-violet-400" />
              Monotonic Stack (Indices & Heights)
            </h5>
            
            <div className="flex items-center gap-2 min-h-[50px] overflow-x-auto py-1">
              <div className="text-[10px] font-mono text-zinc-500 pr-2 border-r border-zinc-800">
                TOP
              </div>
              
              {current.stack.length === 0 ? (
                <div className="text-xs text-zinc-650 font-mono italic">
                  [empty stack]
                </div>
              ) : (
                [...current.stack].reverse().map((sIdx, sOrder) => {
                  return (
                    <div
                      key={sIdx}
                      className="flex flex-col items-center p-2 bg-violet-950/30 border border-violet-500/30 rounded-lg min-w-[60px]"
                    >
                      <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest">
                        {sOrder === 0 ? "Peek" : `pos ${current.stack.length - 1 - sOrder}`}
                      </span>
                      <span className="text-sm font-bold font-mono text-violet-300">
                        {sIdx}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500">
                        (h={heights[sIdx]})
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Execution & State (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Variables Card */}
          <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 flex items-center gap-1.5">
              <Award size={12} className="text-amber-400" />
              Variables State
            </h5>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-zinc-900/40 border border-zinc-800/40 rounded flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase">i</span>
                <span className="text-zinc-300 font-bold">{current.i < 6 ? current.i : "6 (End)"}</span>
              </div>
              <div className="p-2 bg-zinc-900/40 border border-zinc-800/40 rounded flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase">heights[i]</span>
                <span className="text-zinc-300 font-bold">{current.i < 6 ? heights[current.i] : "N/A"}</span>
              </div>
              <div className="p-2 bg-zinc-900/40 border border-zinc-800/40 rounded flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase">maxArea</span>
                <span className="text-emerald-450 font-bold">{current.maxArea}</span>
              </div>
              <div className="p-2 bg-zinc-900/40 border border-zinc-800/40 rounded flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase">current area</span>
                <span className="text-emerald-400 font-bold">
                  {current.currentRect ? current.currentRect.height * current.currentRect.width : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Step Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed min-h-[50px]">
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

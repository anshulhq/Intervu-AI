"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, HelpCircle, Award } from "lucide-react";

interface WaterStepInfo {
  left: number;
  right: number;
  currentArea: number;
  maxArea: number;
  description: string;
  codeSnippet: string;
  actionType: "init" | "calculate" | "move-left" | "move-right" | "complete";
}

export function ContainerMostWaterVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const maxVal = Math.max(...heights);

  const steps: WaterStepInfo[] = [
    {
      left: 0,
      right: 8,
      currentArea: 8,
      maxArea: 8,
      actionType: "init",
      description: "Initialize pointers at the two ends: left = 0 (height 1), right = 8 (height 7). The width is 8. The height is min(1, 7) = 1. The initial area is 1 * 8 = 8.",
      codeSnippet: "int left = 0, right = height.length - 1;\nint maxArea = 0;\n// left = 0, right = 8\nint currentHeight = Math.min(height[0], height[8]); // min(1, 7) = 1\nint area = currentHeight * (8 - 0); // 8\nmaxArea = Math.max(maxArea, area); // maxArea = 8"
    },
    {
      left: 1,
      right: 8,
      currentArea: 49,
      maxArea: 49,
      actionType: "move-left",
      description: "Since height[left] (1) was less than height[right] (7), we moved the left pointer forward (left = 1). Now, height[1] = 8, height[8] = 7. Width is 7. Area is min(8, 7) * 7 = 49. This is our new maximum area!",
      codeSnippet: "left++; // left pointer moves from 0 to 1\n// left = 1, right = 8\nint currentHeight = Math.min(height[1], height[8]); // min(8, 7) = 7\nint area = currentHeight * (8 - 1); // 49\nmaxArea = Math.max(maxArea, area); // maxArea = 49"
    },
    {
      left: 1,
      right: 7,
      currentArea: 18,
      maxArea: 49,
      actionType: "move-right",
      description: "Since height[left] (8) is greater than height[right] (7), we move the right pointer backward (right = 7). Now, height[1] = 8, height[7] = 3. Width is 6. Area is min(8, 3) * 6 = 18. Max area remains 49.",
      codeSnippet: "right--; // right pointer moves from 8 to 7\n// left = 1, right = 7\nint currentHeight = Math.min(height[1], height[7]); // min(8, 3) = 3\nint area = currentHeight * (7 - 1); // 18\nmaxArea = Math.max(maxArea, area); // maxArea remains 49"
    },
    {
      left: 1,
      right: 6,
      currentArea: 40,
      maxArea: 49,
      actionType: "move-right",
      description: "Since height[left] (8) is greater than height[right] (3), we move the right pointer backward (right = 6). Now, height[1] = 8, height[6] = 8. Width is 5. Area is min(8, 8) * 5 = 40. Max area remains 49.",
      codeSnippet: "right--; // right pointer moves from 7 to 6\n// left = 1, right = 6\nint currentHeight = Math.min(height[1], height[6]); // min(8, 8) = 8\nint area = currentHeight * (6 - 1); // 40\nmaxArea = Math.max(maxArea, area); // maxArea remains 49"
    },
    {
      left: 1,
      right: 5,
      currentArea: 16,
      maxArea: 49,
      actionType: "move-right",
      description: "Since heights are equal at left and right (8), we can move either. Let's move the right pointer backward (right = 5). Now, height[1] = 8, height[5] = 4. Width is 4. Area is min(8, 4) * 4 = 16. Max area remains 49.",
      codeSnippet: "right--; // right pointer moves from 6 to 5\n// left = 1, right = 5\nint currentHeight = Math.min(height[1], height[5]); // min(8, 4) = 4\nint area = currentHeight * (5 - 1); // 16\nmaxArea = Math.max(maxArea, area); // maxArea remains 49"
    },
    {
      left: 1,
      right: 4,
      currentArea: 15,
      maxArea: 49,
      actionType: "move-right",
      description: "Since height[left] (8) is greater than height[right] (4), we move the right pointer backward (right = 4). Now, height[1] = 8, height[4] = 5. Width is 3. Area is min(8, 5) * 3 = 15. Max area remains 49.",
      codeSnippet: "right--; // right pointer moves from 5 to 4\n// left = 1, right = 4\nint currentHeight = Math.min(height[1], height[4]); // min(8, 5) = 5\nint area = currentHeight * (4 - 1); // 15\nmaxArea = Math.max(maxArea, area); // maxArea remains 49"
    },
    {
      left: 1,
      right: 3,
      currentArea: 4,
      maxArea: 49,
      actionType: "move-right",
      description: "Since height[left] (8) is greater than height[right] (5), we move the right pointer backward (right = 3). Now, height[1] = 8, height[3] = 2. Width is 2. Area is min(8, 2) * 2 = 4. Max area remains 49.",
      codeSnippet: "right--; // right pointer moves from 4 to 3\n// left = 1, right = 3\nint currentHeight = Math.min(height[1], height[3]); // min(8, 2) = 2\nint area = currentHeight * (3 - 1); // 4\nmaxArea = Math.max(maxArea, area); // maxArea remains 49"
    },
    {
      left: 1,
      right: 2,
      currentArea: 6,
      maxArea: 49,
      actionType: "move-right",
      description: "Since height[left] (8) is greater than height[right] (2), we move the right pointer backward (right = 2). Now, height[1] = 8, height[2] = 6. Width is 1. Area is min(8, 6) * 1 = 6. Max area remains 49.",
      codeSnippet: "right--; // right pointer moves from 3 to 2\n// left = 1, right = 2\nint currentHeight = Math.min(height[1], height[2]); // min(8, 6) = 6\nint area = currentHeight * (2 - 1); // 6\nmaxArea = Math.max(maxArea, area); // maxArea remains 49"
    },
    {
      left: 1,
      right: 1,
      currentArea: 0,
      maxArea: 49,
      actionType: "complete",
      description: "The left and right pointers meet at index 1. The search space is exhausted. The loop terminates and we return the maximum area found, which is 49.",
      codeSnippet: "while (left < right) {\n    // Pointers met! left = 1, right = 1\n}\nreturn maxArea; // returns 49"
    }
  ];

  const current = steps[step];
  const activeL = current.left;
  const activeR = current.right;
  const waterHeight = Math.min(heights[activeL], heights[activeR]);

  // Auto-play effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const nextStep = () => {
    setIsPlaying(false);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setIsPlaying(false);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const resetViz = () => {
    setIsPlaying(false);
    setStep(0);
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 font-mono">
          Interactive Visualization: Container With Most Water
        </h4>
        <div className="flex gap-2">
          <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
            Two-Pointer Strategy
          </span>
          <span className="text-[9px] px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-mono">
            O(N) Time
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-black/10 p-3 rounded-lg border border-zinc-800/30">
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="p-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-850 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-mono transition-colors"
          >
            {isPlaying ? <Pause size={12} className="fill-emerald-400" /> : <Play size={12} className="fill-emerald-400" />}
            {isPlaying ? "Pause" : "Auto Play"}
          </button>
          <button
            onClick={nextStep}
            disabled={step === steps.length - 1}
            className="p-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-850 transition-colors"
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={resetViz}
            className="p-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 rounded border border-zinc-800 transition-colors"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Direct step pills */}
        <div className="flex gap-1 overflow-x-auto">
          {steps.map((_, sIdx) => (
            <button
              key={sIdx}
              onClick={() => {
                setIsPlaying(false);
                setStep(sIdx);
              }}
              className={`px-2 py-0.5 text-[10px] rounded font-mono border transition-all ${
                step === sIdx
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                  : "bg-zinc-800/10 text-zinc-500 border-transparent hover:text-zinc-400"
              }`}
            >
              Step {sIdx}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="relative mb-6">
        <div className="flex items-end justify-between h-48 px-6 py-3 bg-black/35 rounded-xl border border-zinc-800/50 relative overflow-hidden">
          
          {/* Water Shaded Overlay */}
          {activeL < activeR && (
            <div
              className="absolute bottom-3 bg-gradient-to-t from-sky-500/35 to-sky-400/20 border-t-2 border-sky-400/80 rounded-sm shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-500 ease-out flex items-center justify-center pointer-events-none"
              style={{
                left: `calc(1.5rem + ${(activeL / heights.length) * 100}% + (100% / ${heights.length * 2}) - 1px)`,
                right: `calc(1.5rem + ${((heights.length - 1 - activeR) / heights.length) * 100}% + (100% / ${heights.length * 2}) - 1px)`,
                height: `${(waterHeight / maxVal) * 85}%`,
              }}
            >
              {/* Shaded Area Info Badge */}
              <div className="px-2 py-0.5 bg-sky-950/80 border border-sky-400/30 rounded text-[9px] font-mono font-bold text-sky-300/95 animate-pulse backdrop-blur-sm shadow-md">
                Area: {current.currentArea}
              </div>
            </div>
          )}

          {/* Chart Columns */}
          {heights.map((h, idx) => {
            const isLeft = idx === activeL;
            const isRight = idx === activeR;
            const isInside = idx >= activeL && idx <= activeR;

            let barBg = "bg-zinc-800/30 border-zinc-700/20 text-zinc-500";
            if (isLeft) {
              barBg = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)] z-10";
            } else if (isRight) {
              barBg = "bg-violet-500/20 border-violet-500 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.3)] z-10";
            } else if (isInside) {
              barBg = "bg-zinc-700/15 border-zinc-700/30 text-zinc-400";
            }

            return (
              <div
                key={idx}
                className="flex flex-col justify-end items-center h-full relative"
                style={{ width: `${100 / heights.length}%` }}
              >
                {/* Height Label */}
                <span
                  className={`text-[10px] font-mono font-semibold mb-1 transition-colors ${
                    isLeft ? "text-emerald-400" : isRight ? "text-violet-400" : "text-zinc-500"
                  }`}
                >
                  {h}
                </span>

                {/* Vertical Bar */}
                <div
                  className={`w-4 sm:w-6 rounded-t border transition-all duration-500 ease-out ${barBg}`}
                  style={{ height: `${(h / maxVal) * 80}%` }}
                />

                {/* Index label */}
                <span className="text-[9px] font-mono text-zinc-600 mt-1">idx {idx}</span>
              </div>
            );
          })}
        </div>

        {/* Pointer Arrow Indicators under indices */}
        <div className="flex justify-between px-6 pt-2 h-8 relative font-mono">
          {heights.map((_, idx) => {
            const isLeft = idx === activeL;
            const isRight = idx === activeR;

            return (
              <div
                key={idx}
                className="flex justify-center"
                style={{ width: `${100 / heights.length}%` }}
              >
                {isLeft && isRight ? (
                  <div className="flex flex-col items-center animate-bounce text-[9px] font-bold text-sky-400">
                    <span>▲</span>
                    <span>L=R</span>
                  </div>
                ) : isLeft ? (
                  <div className="flex flex-col items-center animate-pulse text-[9px] font-bold text-emerald-400">
                    <span>▲</span>
                    <span>Left</span>
                  </div>
                ) : isRight ? (
                  <div className="flex flex-col items-center animate-pulse text-[9px] font-bold text-violet-400">
                    <span>▲</span>
                    <span>Right</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-3 bg-zinc-950/40 rounded-lg border border-zinc-800/40 text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500" />
          <span>Left Pointer (Height: {heights[activeL]})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-violet-500/20 border border-violet-500" />
          <span>Right Pointer (Height: {heights[activeR]})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-sky-500/30 border border-sky-400/80" />
          <span>Water Volume</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Award size={12} className="text-emerald-400" />
          <span className="font-bold text-emerald-400">Max Area: {current.maxArea}</span>
        </div>
      </div>

      {/* Numerical Trace Panel */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        <div className="p-2 bg-zinc-950/60 rounded border border-zinc-850">
          <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-mono">Current Width</div>
          <div className="text-lg font-mono font-bold text-zinc-300">
            {activeL < activeR ? `${activeR} - ${activeL} = ${activeR - activeL}` : "0"}
          </div>
        </div>
        <div className="p-2 bg-zinc-950/60 rounded border border-zinc-850">
          <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-mono">Current Height</div>
          <div className="text-lg font-mono font-bold text-zinc-300">
            {activeL < activeR ? `min(${heights[activeL]}, ${heights[activeR]}) = ${waterHeight}` : "0"}
          </div>
        </div>
        <div className="p-2 bg-zinc-950/60 rounded border border-zinc-850">
          <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-mono">Current Area</div>
          <div className={`text-lg font-mono font-bold ${current.currentArea === current.maxArea && current.currentArea > 0 ? "text-emerald-400" : "text-sky-400"}`}>
            {current.currentArea}
          </div>
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-800/40">
        {/* Step narrative */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">
            Step Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {current.description}
          </p>
          {current.actionType !== "complete" && activeL < activeR && (
            <div className="mt-3 p-2 bg-zinc-950/40 border border-zinc-800/50 rounded flex items-start gap-2 text-[10px] text-zinc-400 font-sans">
              <HelpCircle size={14} className="text-sky-400 shrink-0 mt-0.5" />
              <span>
                {heights[activeL] < heights[activeR] ? (
                  <span>
                    Moving <strong>Left pointer</strong> because its height ({heights[activeL]}) is smaller than Right pointer's height ({heights[activeR]}). We must move the smaller pointer to have any chance of finding a larger area.
                  </span>
                ) : (
                  <span>
                    Moving <strong>Right pointer</strong> because its height ({heights[activeR]}) is smaller than or equal to Left pointer's height ({heights[activeL]}). We must move the smaller pointer to have any chance of finding a larger area.
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Code Snippet Box */}
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">
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

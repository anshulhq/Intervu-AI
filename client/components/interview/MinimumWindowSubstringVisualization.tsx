"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Award, HelpCircle } from "lucide-react";

interface SubstringStepInfo {
  left: number;
  right: number;
  windowStr: string;
  windowCounts: Record<string, number>;
  matches: number;
  minWindow: string;
  action: "expand" | "shrink" | "valid" | "complete";
  description: string;
  codeSnippet: string;
}

export function MinimumWindowSubstringVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const sStr = "ADOBECODEBANC";
  const tStr = "ABC";
  const targetCounts = { A: 1, B: 1, C: 1 };
  const totalRequired = 3; // A, B, C must be present

  const steps: SubstringStepInfo[] = [
    {
      left: 0,
      right: 0,
      windowStr: "A",
      windowCounts: { A: 1 },
      matches: 1,
      minWindow: "",
      action: "expand",
      description: "Initialize pointers L = 0, R = 0. The first character is 'A', which is in our target. Characters matched: 1/3 ('A'). Window is currently invalid since we still need 'B' and 'C'.",
      codeSnippet: "// Initialize pointers at start\nint left = 0, right = 0;\n// Window: \"A\", matches = 1/3 (need 'B', 'C')"
    },
    {
      left: 0,
      right: 3,
      windowStr: "ADOB",
      windowCounts: { A: 1, D: 1, O: 1, B: 1 },
      matches: 2,
      minWindow: "",
      action: "expand",
      description: "Expand the right pointer to R = 3. We encounter 'B', which is in our target. Now we have matched 2/3 target characters ('A', 'B'). Window is still invalid.",
      codeSnippet: "right = 3; // s[3] = 'B'\n// Window: \"ADOB\", matches = 2/3 (need 'C')"
    },
    {
      left: 0,
      right: 5,
      windowStr: "ADOBEC",
      windowCounts: { A: 1, D: 1, O: 1, B: 1, E: 1, C: 1 },
      matches: 3,
      minWindow: "ADOBEC",
      action: "valid",
      description: "Expand the right pointer to R = 5. We encounter 'C'. Now we have matched all target characters ('A', 'B', 'C')! This is our first valid window. We record it as the minimum window so far (length 6: \"ADOBEC\").",
      codeSnippet: "right = 5; // s[5] = 'C'\n// Matches: 3/3! Valid window!\nminLen = 6; minWindow = \"ADOBEC\";"
    },
    {
      left: 1,
      right: 5,
      windowStr: "DOBEC",
      windowCounts: { D: 1, O: 1, B: 1, E: 1, C: 1 },
      matches: 2,
      minWindow: "ADOBEC",
      action: "shrink",
      description: "Since the window is valid, we attempt to shrink it from the left to find a smaller one. Increment L to 1. By removing 'A', our window counts drop below the target requirement for 'A'. The window becomes invalid (matches: 2/3).",
      codeSnippet: "left = 1; // Removed 'A' from window\n// Matches: 2/3 (need 'A') - Invalid window"
    },
    {
      left: 1,
      right: 10,
      windowStr: "DOBECODEBA",
      windowCounts: { D: 2, O: 2, B: 2, E: 2, C: 1, A: 1 },
      matches: 3,
      minWindow: "ADOBEC",
      action: "expand",
      description: "Since the window is invalid, we expand the right pointer. At R = 10, we encounter 'A' again. The window now contains 'A', 'B', and 'C' (matches: 3/3). This valid window \"DOBECODEBA\" has length 10, which is larger than our current minimum (6).",
      codeSnippet: "right = 10; // s[10] = 'A'\n// Matches: 3/3! Valid window.\n// Length 10 > minLen (6). Min remains \"ADOBEC\"."
    },
    {
      left: 5,
      right: 10,
      windowStr: "CODEBA",
      windowCounts: { C: 1, O: 1, D: 1, E: 1, B: 1, A: 1 },
      matches: 3,
      minWindow: "ADOBEC",
      action: "shrink",
      description: "With a valid window, we shrink from the left. We increment L from 1 to 5. Removing 'D', 'O', 'B' (we had an extra 'B'), and 'E' keeps the window valid because it still contains 'A', 'B', and 'C'. \"CODEBA\" has length 6, which equals our current minimum.",
      codeSnippet: "left = 5;\n// Window: \"CODEBA\" is valid.\n// Length 6 == minLen (6). Min remains \"ADOBEC\"."
    },
    {
      left: 6,
      right: 10,
      windowStr: "ODEBA",
      windowCounts: { O: 1, D: 1, E: 1, B: 1, A: 1 },
      matches: 2,
      minWindow: "ADOBEC",
      action: "shrink",
      description: "Shrink further by moving L to 6. Removing 'C' causes the window to become invalid because it no longer contains 'C'. We must expand the right pointer again.",
      codeSnippet: "left = 6; // Removed 'C'\n// Matches: 2/3 (need 'C') - Invalid window"
    },
    {
      left: 6,
      right: 12,
      windowStr: "ODEBANC",
      windowCounts: { O: 1, D: 1, E: 1, B: 1, A: 1, N: 1, C: 1 },
      matches: 3,
      minWindow: "ADOBEC",
      action: "expand",
      description: "Expand R to 12. We encounter 'C' at the end of the string. The window is now valid again. The substring \"ODEBANC\" has length 7, which is larger than our minimum (6).",
      codeSnippet: "right = 12; // s[12] = 'C'\n// Matches: 3/3! Valid window.\n// Length 7 > minLen (6). Min remains \"ADOBEC\"."
    },
    {
      left: 8,
      right: 12,
      windowStr: "EBANC",
      windowCounts: { E: 1, B: 1, A: 1, N: 1, C: 1 },
      matches: 3,
      minWindow: "EBANC",
      action: "shrink",
      description: "Shrink from the left. Increment L to 8 (removing 'O' and 'D'). The window \"EBANC\" is still valid and has a length of 5. This is smaller than our previous minimum of 6! We update the minimum window to \"EBANC\".",
      codeSnippet: "left = 8;\n// Window: \"EBANC\" is valid.\n// Length 5 < minLen (6). New minWindow = \"EBANC\"."
    },
    {
      left: 9,
      right: 12,
      windowStr: "BANC",
      windowCounts: { B: 1, A: 1, N: 1, C: 1 },
      matches: 3,
      minWindow: "BANC",
      action: "shrink",
      description: "Shrink from the left again by moving L to 9. Removing 'E' leaves us with \"BANC\", which remains valid and has a length of 4. This is our new minimum window!",
      codeSnippet: "left = 9;\n// Window: \"BANC\" is valid.\n// Length 4 < minLen (5). New minWindow = \"BANC\"."
    },
    {
      left: 10,
      right: 12,
      windowStr: "ANC",
      windowCounts: { A: 1, N: 1, C: 1 },
      matches: 2,
      minWindow: "BANC",
      action: "shrink",
      description: "Shrink further by moving L to 10. Removing 'B' leaves \"ANC\", which lacks 'B' and becomes invalid. We must expand the right pointer, but R has reached the end of the string.",
      codeSnippet: "left = 10; // Removed 'B'\n// Matches: 2/3 (need 'B') - Invalid window"
    },
    {
      left: 10,
      right: 12,
      windowStr: "",
      windowCounts: {},
      matches: 2,
      minWindow: "BANC",
      action: "complete",
      description: "The right pointer has reached the end of string s. The search is complete! The minimum window substring containing all characters of 't' is \"BANC\".",
      codeSnippet: "return minWindow; // returns \"BANC\""
    }
  ];

  const current = steps[step];

  // Auto-play control
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
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

  // Check if character is part of target string 't' ("ABC")
  const isTargetChar = (char: string) => {
    return char === "A" || char === "B" || char === "C";
  };

  // Determine cell classes based on window boundaries and target matching
  const getCellClasses = (index: number) => {
    const char = sStr[index];
    const inWindow = index >= current.left && index <= current.right;
    const isL = index === current.left;
    const isR = index === current.right;

    let border = "border-zinc-800";
    let bg = "bg-zinc-900/40 text-zinc-500";
    let shadow = "";

    if (inWindow) {
      if (isTargetChar(char)) {
        bg = "bg-emerald-500/10 text-emerald-300";
        border = "border-emerald-500/40";
        shadow = "shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      } else {
        bg = "bg-sky-500/5 text-sky-400/80";
        border = "border-sky-500/30";
      }
    }

    if (isL || isR) {
      border = "border-violet-500";
      shadow = "shadow-[0_0_12px_rgba(139,92,246,0.3)]";
    }

    return { bg, border, shadow, isL, isR };
  };

  const getActionBadge = () => {
    switch (current.action) {
      case "expand":
        return <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-mono text-[9px]">Expanding Window</span>;
      case "shrink":
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono text-[9px]">Shrinking Window</span>;
      case "valid":
        return <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded font-mono text-[9px] font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]">Valid Window Found</span>;
      case "complete":
        return <span className="px-2 py-0.5 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded font-mono text-[9px] font-bold">Search Complete</span>;
    }
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-1.5 font-mono">
          Interactive Visualization: Minimum Window Substring
        </h4>
        <div className="flex items-center gap-2">
          {getActionBadge()}
          <span className="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-mono">
            Hard Difficulty
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border font-mono transition-all ${
              isPlaying
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={12} /> Pause
              </>
            ) : (
              <>
                <Play size={12} /> Auto Play
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={step === steps.length - 1}
            className="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {steps.map((_, s) => (
            <button
              key={s}
              onClick={() => {
                setIsPlaying(false);
                setStep(s);
              }}
              className={`w-6 h-6 text-[10px] font-mono rounded-md border transition-all flex items-center justify-center ${
                step === s
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/50 font-bold"
                  : "bg-zinc-800/20 text-zinc-500 border-zinc-800/40 hover:text-zinc-350 hover:bg-zinc-800/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* String Visualization Panel */}
      <div className="mb-6 p-4 bg-black/35 rounded-xl border border-zinc-800/40">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-650 mb-4">
          String s = &quot;{sStr}&quot;
        </div>
        
        <div className="flex items-start justify-center gap-1.5 overflow-x-auto py-6 relative">
          {sStr.split("").map((char, index) => {
            const { bg, border, shadow, isL, isR } = getCellClasses(index);
            return (
              <div key={index} className="flex flex-col items-center min-w-[32px] relative">
                {/* Pointer indicators at top */}
                <div className="h-6 flex items-center justify-center text-[10px] font-bold font-mono">
                  {isL && isR ? (
                    <span className="text-violet-400 animate-pulse">L,R</span>
                  ) : isL ? (
                    <span className="text-violet-400">L</span>
                  ) : isR ? (
                    <span className="text-violet-400">R</span>
                  ) : null}
                </div>

                {/* Character Box */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-mono font-bold transition-all duration-300 ${bg} ${border} ${shadow}`}
                >
                  {char}
                </div>

                {/* Index label below */}
                <span className="text-[8px] font-mono text-zinc-700 mt-1">{index}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target state and match counter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Match Tracker */}
        <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1">
              Target requirements: t = &quot;{tStr}&quot;
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(targetCounts).map(([char, reqCount]) => {
                const currentCount = current.windowCounts[char] || 0;
                const isMet = currentCount >= reqCount;
                return (
                  <div
                    key={char}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                      isMet
                        ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-400"
                        : "bg-zinc-800/10 border-zinc-800/60 text-zinc-500"
                    }`}
                  >
                    <span className="text-sm font-bold">{char}</span>
                    <span className="text-[10px] mt-0.5">
                      {currentCount} / {reqCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono">Unique Met:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-zinc-850 rounded-full overflow-hidden border border-zinc-800/65">
                <div
                  className="h-full bg-emerald-500 transition-all duration-350"
                  style={{ width: `${(current.matches / totalRequired) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold font-mono text-emerald-400">
                {current.matches} / {totalRequired}
              </span>
            </div>
          </div>
        </div>

        {/* Current Minimum Window Substring Tracker */}
        <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5 flex items-center gap-1.5">
              <Award size={10} className="text-amber-400" />
              Minimum Window Substring Tracked
            </div>
            
            <div className="h-16 flex flex-col items-center justify-center bg-black/20 rounded-lg border border-zinc-800/45 p-3">
              {current.minWindow ? (
                <>
                  <span className="text-base font-mono font-bold text-amber-300 animate-pulse">
                    &quot;{current.minWindow}&quot;
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-0.5">
                    Length = {current.minWindow.length}
                  </span>
                </>
              ) : (
                <span className="text-xs font-mono text-zinc-650 italic">
                  No valid window found yet
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 text-[9px] text-zinc-500 font-mono text-center flex items-center justify-center gap-1">
            <HelpCircle size={10} className="text-zinc-600" />
            Goal: Include all target counts of ABC with minimum length
          </div>
        </div>
      </div>

      {/* Description & Code block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Step {step} / {steps.length - 1} Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed min-h-[48px]">
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

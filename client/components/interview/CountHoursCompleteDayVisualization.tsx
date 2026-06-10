"use client";

import React, { useState } from "react";

interface StepInfo {
  index: number;
  val: number | null;
  remainder: number | null;
  target: number | null;
  pairsAdded: number;
  totalPairs: number;
  freqSnapshot: Record<number, number>;
  description: string;
  codeSnippet: string;
}

export function CountHoursCompleteDayVisualization() {
  const [step, setStep] = useState(0);
  const hours = [12, 12, 30, 24, 24];

  const steps: StepInfo[] = [
    {
      index: -1,
      val: null,
      remainder: null,
      target: null,
      pairsAdded: 0,
      totalPairs: 0,
      freqSnapshot: {},
      description: "We start with an empty frequency array of size 24 (to track remainders modulo 24) and total pairs count of 0.",
      codeSnippet: "// Initialize helper structures\nlong pairs = 0;\nint[] count = new int[24];"
    },
    {
      index: 0,
      val: 12,
      remainder: 12,
      target: 12,
      pairsAdded: 0,
      totalPairs: 0,
      freqSnapshot: { 12: 1 },
      description: "Processing hours[0] = 12. The remainder is 12 % 24 = 12. We look for a matching remainder (24 - 12) % 24 = 12. Since count[12] is 0, no pairs are formed. We increment count[12] to 1.",
      codeSnippet: "int rem = hours[0] % 24; // 12\nint target = (24 - rem) % 24; // 12\npairs += count[target]; // +0\ncount[rem]++; // count[12] is now 1"
    },
    {
      index: 1,
      val: 12,
      remainder: 12,
      target: 12,
      pairsAdded: 1,
      totalPairs: 1,
      freqSnapshot: { 12: 2 },
      description: "Processing hours[1] = 12. The remainder is 12 % 24 = 12. We look for a matching remainder (24 - 12) % 24 = 12. Since count[12] is 1, we form 1 new pair with the previous 12. We increment count[12] to 2.",
      codeSnippet: "int rem = hours[1] % 24; // 12\nint target = (24 - rem) % 24; // 12\npairs += count[target]; // +1 (indices: 0, 1)\ncount[rem]++; // count[12] is now 2"
    },
    {
      index: 2,
      val: 30,
      remainder: 6,
      target: 18,
      pairsAdded: 0,
      totalPairs: 1,
      freqSnapshot: { 12: 2, 6: 1 },
      description: "Processing hours[2] = 30. The remainder is 30 % 24 = 6. We look for a matching remainder (24 - 6) % 24 = 18. Since count[18] is 0, no pairs are formed. We increment count[6] to 1.",
      codeSnippet: "int rem = hours[2] % 24; // 6\nint target = (24 - rem) % 24; // 18\npairs += count[target]; // +0\ncount[rem]++; // count[6] is now 1"
    },
    {
      index: 3,
      val: 24,
      remainder: 0,
      target: 0,
      pairsAdded: 0,
      totalPairs: 1,
      freqSnapshot: { 12: 2, 6: 1, 0: 1 },
      description: "Processing hours[3] = 24. The remainder is 24 % 24 = 0. We look for a matching remainder (24 - 0) % 24 = 0. Since count[0] is 0, no pairs are formed. We increment count[0] to 1.",
      codeSnippet: "int rem = hours[3] % 24; // 0\nint target = (24 - rem) % 24; // 0\npairs += count[target]; // +0\ncount[rem]++; // count[0] is now 1"
    },
    {
      index: 4,
      val: 24,
      remainder: 0,
      target: 0,
      pairsAdded: 1,
      totalPairs: 2,
      freqSnapshot: { 12: 2, 6: 1, 0: 2 },
      description: "Processing hours[4] = 24. The remainder is 24 % 24 = 0. We look for a matching remainder (24 - 0) % 24 = 0. Since count[0] is 1, we form 1 new pair with the previous 24. We increment count[0] to 2.",
      codeSnippet: "int rem = hours[4] % 24; // 0\nint target = (24 - rem) % 24; // 0\npairs += count[target]; // +1 (indices: 3, 4)\ncount[rem]++; // count[0] is now 2"
    }
  ];

  const current = steps[step];

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Count Pairs (Complete Day)
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time & O(1) Space
        </span>
      </div>

      {/* Stepper buttons */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {steps.map((_, s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-2.5 py-1 text-[11px] rounded-lg transition-all border font-mono ${
              step === s
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-850 hover:text-zinc-300"
            }`}
          >
            {s === 0 ? "Init" : `hours[${s - 1}]`}
          </button>
        ))}
      </div>

      {/* Input Array Representation */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Input Array: hours
        </p>
        <div className="flex gap-2 p-3 bg-black/20 rounded-xl border border-zinc-800/40 overflow-x-auto">
          {hours.map((val, idx) => {
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
                <div className="text-[9px] mt-1 text-zinc-500">rem {val % 24}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row & target helper */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-3.5 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col justify-center">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Current Remainder</span>
          <span className="text-lg font-bold text-white font-mono">{current.remainder !== null ? current.remainder : "-"}</span>
        </div>
        <div className="p-3.5 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col justify-center">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Target Remainder</span>
          <span className="text-lg font-bold text-violet-400 font-mono">{current.target !== null ? current.target : "-"}</span>
        </div>
        <div className="p-3.5 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col justify-center">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Total Pairs Found</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{current.totalPairs}</span>
        </div>
      </div>

      {/* Frequency Array representation */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Frequency Map / Array: count[0...23]
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 p-3.5 bg-black/20 rounded-xl border border-zinc-800/40">
          {Array.from({ length: 24 }).map((_, r) => {
            const count = current.freqSnapshot[r] || 0;
            const isCurrentRem = current.remainder === r;
            const isTargetRem = current.target === r;
            
            let bgClass = "bg-zinc-950/40 border-zinc-850 text-zinc-600";
            if (count > 0) bgClass = "bg-emerald-500/5 border-emerald-500/30 text-emerald-400";
            if (isCurrentRem) bgClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/20";
            if (isTargetRem) bgClass = "bg-violet-500/20 border-violet-500 text-violet-300 ring-1 ring-violet-500/20";

            return (
              <div
                key={r}
                className={`p-1.5 rounded border text-center transition-all duration-300 ${bgClass}`}
              >
                <div className="text-[8px] font-mono opacity-60">[{r}]</div>
                <div className="text-xs font-bold font-mono">{count}</div>
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

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Zap } from "lucide-react";

interface PowStepInfo {
  title: string;
  exponent: number;
  binaryRep: string;
  activeBitIndex: number | null; // index from the right (0-based)
  currentBase: number;
  result: number;
  action: string;
  description: string;
  codeSnippet: string;
}

export function PowVisualization() {
  const [step, setStep] = useState(0);
  const xVal = 2.0;
  const nVal = 13;

  const steps: PowStepInfo[] = [
    {
      title: "0. Initialization",
      exponent: 13,
      binaryRep: "1101",
      activeBitIndex: null,
      currentBase: 2.0,
      result: 1.0,
      action: "Initialize result and exponent tracker",
      description: "We start with base x = 2.0 and power n = 13. Since n is positive, we initialize our result to 1.0, set current_base = x, and set exponent = n.",
      codeSnippet: "double result = 1.0;\ndouble current_base = x; // 2.0\nlong exponent = n;      // 13"
    },
    {
      title: "1. Exponent = 13 (Odd)",
      exponent: 13,
      binaryRep: "1101",
      activeBitIndex: 0, // rightmost '1'
      currentBase: 2.0,
      result: 1.0,
      action: "exponent % 2 != 0 -> result *= current_base",
      description: "The rightmost bit of 13 is 1 (odd). We multiply our result by current_base: result = 1.0 * 2.0 = 2.0. Then we square the base (2.0² = 4.0) and divide the exponent by 2 (13 / 2 = 6).",
      codeSnippet: "if (exponent % 2 != 0) {\n    result *= current_base; // result = 2.0\n}\ncurrent_base *= current_base; // current_base = 4.0\nexponent /= 2; // exponent = 6"
    },
    {
      title: "2. Exponent = 6 (Even)",
      exponent: 6,
      binaryRep: "0110",
      activeBitIndex: 1, // '0' bit
      currentBase: 4.0,
      result: 2.0,
      action: "exponent % 2 == 0 -> skip result update",
      description: "The current exponent (6) is even (binary bit is 0). We skip updating the result. We just square current_base (4.0² = 16.0) and divide the exponent by 2 (6 / 2 = 3).",
      codeSnippet: "// exponent is even, skip result *= current_base\n\ncurrent_base *= current_base; // current_base = 16.0\nexponent /= 2; // exponent = 3"
    },
    {
      title: "3. Exponent = 3 (Odd)",
      exponent: 3,
      binaryRep: "0011",
      activeBitIndex: 2, // '1' bit
      currentBase: 16.0,
      result: 2.0,
      action: "exponent % 2 != 0 -> result *= current_base",
      description: "The current exponent (3) is odd (binary bit is 1). We multiply result by current_base: result = 2.0 * 16.0 = 32.0. We then square current_base (16.0² = 256.0) and divide the exponent by 2 (3 / 2 = 1).",
      codeSnippet: "if (exponent % 2 != 0) {\n    result *= current_base; // result = 32.0\n}\ncurrent_base *= current_base; // current_base = 256.0\nexponent /= 2; // exponent = 1"
    },
    {
      title: "4. Exponent = 1 (Odd)",
      exponent: 1,
      binaryRep: "0001",
      activeBitIndex: 3, // leftmost '1' bit of 13 (representing 2^3 = 8)
      currentBase: 256.0,
      result: 32.0,
      action: "exponent % 2 != 0 -> result *= current_base",
      description: "The current exponent (1) is odd (binary bit is 1). We multiply result by current_base: result = 32.0 * 256.0 = 8192.0. We then square current_base (256.0² = 65536.0) and divide the exponent by 2 (1 / 2 = 0).",
      codeSnippet: "if (exponent % 2 != 0) {\n    result *= current_base; // result = 8192.0\n}\ncurrent_base *= current_base; // current_base = 65536.0\nexponent /= 2; // exponent = 0"
    },
    {
      title: "5. Completed (Exponent = 0)",
      exponent: 0,
      binaryRep: "0000",
      activeBitIndex: null,
      currentBase: 65536.0,
      result: 8192.0,
      action: "exponent == 0 -> return result",
      description: "The exponent has reached 0. The loop terminates. We return the final accumulated result: 8192.0, which is exactly 2.0^13.",
      codeSnippet: "while (exponent > 0) { ... }\nreturn result; // 8192.0"
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
            Interactive Visualization: Binary Exponentiation (2.0<sup>13</sup>)
          </h4>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(log N) Time Complexity
        </span>
      </div>

      {/* Stepper controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`p-1.5 rounded-lg border transition-all ${
              step === 0
                ? "bg-zinc-850/20 text-zinc-650 border-zinc-850/40 cursor-not-allowed opacity-50"
                : "bg-zinc-800/30 text-zinc-300 border-zinc-800/50 hover:bg-zinc-800 hover:text-white"
            }`}
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={step === steps.length - 1}
            className={`p-1.5 rounded-lg border transition-all ${
              step === steps.length - 1
                ? "bg-zinc-850/20 text-zinc-650 border-zinc-850/40 cursor-not-allowed opacity-50"
                : "bg-zinc-800/30 text-zinc-300 border-zinc-800/50 hover:bg-zinc-800 hover:text-white"
            }`}
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border bg-zinc-800/30 text-zinc-350 border-zinc-800/50 hover:bg-zinc-800 hover:text-white transition-all ml-1"
            title="Reset to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          {steps.map((_, s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`w-6 h-6 rounded-full text-[10px] font-mono border transition-all ${
                step === s
                  ? "bg-emerald-500/20 text-emerald-350 border-emerald-500/50 font-bold"
                  : "bg-zinc-800/30 text-zinc-500 border-zinc-800/50 hover:text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main visual panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Variable Tracker */}
        <div className="p-4 bg-black/30 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Registers & State
            </h5>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/30">
                <span className="text-zinc-400">exponent (n):</span>
                <span className="font-bold text-emerald-300">{current.exponent}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/30">
                <span className="text-zinc-400">current_base:</span>
                <span className="font-bold text-violet-300">{current.currentBase.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">result:</span>
                <span className="font-bold text-sky-300">{current.result.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
            <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mb-0.5">
              Current Action
            </div>
            <div className="text-[11px] font-mono text-emerald-350 truncate">
              {current.action}
            </div>
          </div>
        </div>

        {/* Binary Bit Visualizer */}
        <div className="p-4 bg-black/30 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Binary Representation (13 = 1101₂)
            </h5>
            <div className="flex items-center justify-center gap-1.5 py-4">
              {["1", "1", "0", "1"].map((bit, idx) => {
                const bitIndexFromRight = 3 - idx; // 3, 2, 1, 0
                const isActive = current.activeBitIndex === bitIndexFromRight;
                const isProcessed = current.activeBitIndex !== null && bitIndexFromRight < current.activeBitIndex;
                const weight = Math.pow(2, bitIndexFromRight);

                let bgClass = "bg-zinc-900 border-zinc-800 text-zinc-600";
                if (isActive) {
                  bgClass = "bg-emerald-500/20 border-emerald-500 text-emerald-350 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                } else if (isProcessed) {
                  bgClass = "bg-zinc-850/50 border-zinc-800/40 text-zinc-500 line-through";
                }

                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full py-2.5 flex items-center justify-center rounded-lg border font-mono font-bold text-base transition-all duration-300 ${bgClass}`}
                    >
                      {bit}
                    </div>
                    <span className="text-[8px] font-mono mt-1 text-zinc-500">
                      2<sup>{bitIndexFromRight}</sup> ({weight})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 leading-normal text-center">
            {current.activeBitIndex !== null ? (
              <span>
                Evaluating bit corresponding to exponent value <strong className="text-emerald-400">{Math.pow(2, current.activeBitIndex)}</strong>.
              </span>
            ) : (
              <span>Binary analysis inactive.</span>
            )}
          </div>
        </div>

        {/* Complexity comparison */}
        <div className="p-4 bg-black/30 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Operation Efficiency
            </h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Linear Mult. Steps:</span>
                  <span className="font-mono text-red-400 font-bold">13 operations</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[100%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Binary Expon. Steps:</span>
                  <span className="font-mono text-emerald-400 font-bold">4 steps (O(log N))</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[30%]" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 border-t border-zinc-850 pt-2.5 mt-2">
            Instead of multiplying x 13 times, we square x at each step and only multiply to result when the exponent bit is 1.
          </div>
        </div>
      </div>

      {/* Step narrative and code codeSnippet */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Step details: {current.title}
          </p>
          <p className="text-xs text-zinc-350 leading-relaxed">
            {current.description}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Code implementation (Java)
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/90 border border-zinc-850 overflow-x-auto whitespace-pre">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

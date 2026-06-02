"use client";

import React, { useState } from "react";

export function RotateArrayVisualization() {
  const [step, setStep] = useState(0);
  const original = [1, 2, 3, 4, 5, 6, 7];
  const k = 3;

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-4">
        Interactive Visualization: Rotate Array (k = {k})
      </h4>
      <div className="text-xs text-zinc-400 mb-4">
        Rotating an array to the right by <span className="text-emerald-400 font-semibold">{k}</span> steps in-place.
      </div>
      <div className="flex gap-2 mb-4">
        {[0, 1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-3 py-1 text-xs rounded-md transition-all border ${
              step === s
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                : "bg-zinc-800/40 text-zinc-400 border-transparent hover:bg-zinc-800/80 hover:text-zinc-300"
            }`}
          >
            Step {s}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ArrowRight, ArrowDown } from "lucide-react";

interface DPStepInfo {
  dpGrid: number[][]; // 3x4 grid
  currentCell: [number, number] | null;
  parents: [number, number][];
  description: string;
  codeSnippet: string;
  title: string;
}

export function UniquePathsVisualization() {
  const [step, setStep] = useState(0);

  const m = 3;
  const n = 4;

  const steps: DPStepInfo[] = [
    {
      title: "0. Initialization",
      dpGrid: [
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      currentCell: [0, 0],
      parents: [],
      description: "Initialize the DP table. We start at the top-left cell (0,0). There is exactly 1 way to be at the starting position.",
      codeSnippet: "int[][] dp = new int[m][n];\ndp[0][0] = 1;"
    },
    {
      title: "1. Fill First Row",
      dpGrid: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      currentCell: null,
      parents: [],
      description: "Fill the first row with 1s. Since the robot can only move right or down, there is exactly 1 unique path to reach any cell in the top row (by moving continuously right).",
      codeSnippet: "for (int j = 0; j < n; j++) {\n    dp[0][j] = 1;\n}"
    },
    {
      title: "2. Fill First Column",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
      ],
      currentCell: null,
      parents: [],
      description: "Fill the first column with 1s. Similarly, there is only 1 unique path to reach any cell in the left column (by moving continuously down).",
      codeSnippet: "for (int i = 0; i < m; i++) {\n    dp[i][0] = 1;\n}"
    },
    {
      title: "3. Cell (1,1)",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 2, 0, 0],
        [1, 0, 0, 0]
      ],
      currentCell: [1, 1],
      parents: [[0, 1], [1, 0]],
      description: "For cell (1,1), we sum the paths from the cell directly above (0,1) and the cell directly to the left (1,0). Since dp[0][1] = 1 and dp[1][0] = 1, we get 1 + 1 = 2.",
      codeSnippet: "dp[1][1] = dp[0][1] + dp[1][0];\n// dp[1][1] = 1 + 1 = 2"
    },
    {
      title: "4. Cell (1,2)",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 2, 3, 0],
        [1, 0, 0, 0]
      ],
      currentCell: [1, 2],
      parents: [[0, 2], [1, 1]],
      description: "For cell (1,2), we sum the paths from the cell above (0,2) and the cell to the left (1,1). Since dp[0][2] = 1 and dp[1][1] = 2, we get 1 + 2 = 3.",
      codeSnippet: "dp[1][2] = dp[0][2] + dp[1][1];\n// dp[1][2] = 1 + 2 = 3"
    },
    {
      title: "5. Cell (1,3)",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 2, 3, 4],
        [1, 0, 0, 0]
      ],
      currentCell: [1, 3],
      parents: [[0, 3], [1, 2]],
      description: "For cell (1,3), we sum the paths from above (0,3) and left (1,2). Since dp[0][3] = 1 and dp[1][2] = 3, we get 1 + 3 = 4.",
      codeSnippet: "dp[1][3] = dp[0][3] + dp[1][2];\n// dp[1][3] = 1 + 3 = 4"
    },
    {
      title: "6. Cell (2,1)",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 2, 3, 4],
        [1, 3, 0, 0]
      ],
      currentCell: [2, 1],
      parents: [[1, 1], [2, 0]],
      description: "For cell (2,1), we sum the paths from above (1,1) and left (2,0). Since dp[1][1] = 2 and dp[2][0] = 1, we get 2 + 1 = 3.",
      codeSnippet: "dp[2][1] = dp[1][1] + dp[2][0];\n// dp[2][1] = 2 + 1 = 3"
    },
    {
      title: "7. Cell (2,2)",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 2, 3, 4],
        [1, 3, 6, 0]
      ],
      currentCell: [2, 2],
      parents: [[1, 2], [2, 1]],
      description: "For cell (2,2), we sum the paths from above (1,2) and left (2,1). Since dp[1][2] = 3 and dp[2][1] = 3, we get 3 + 3 = 6.",
      codeSnippet: "dp[2][2] = dp[1][2] + dp[2][1];\n// dp[2][2] = 3 + 3 = 6"
    },
    {
      title: "8. Cell (2,3) - Goal!",
      dpGrid: [
        [1, 1, 1, 1],
        [1, 2, 3, 4],
        [1, 3, 6, 10]
      ],
      currentCell: [2, 3],
      parents: [[1, 3], [2, 2]],
      description: "We reach the destination at (2,3). Sum the paths from above (1,3) and left (2,2). Since dp[1][3] = 4 and dp[2][2] = 6, we get 4 + 6 = 10 unique paths in total.",
      codeSnippet: "dp[m - 1][n - 1] = dp[m - 2][n - 1] + dp[m - 1][n - 2];\nreturn dp[m - 1][n - 1]; // Returns 10"
    }
  ];

  const current = steps[step];

  const getCellStyles = (r: number, c: number) => {
    const isCurrent = current.currentCell && current.currentCell[0] === r && current.currentCell[1] === c;
    const isParent = current.parents.some(([pr, pc]) => pr === r && pc === c);
    const hasValue = current.dpGrid[r][c] > 0;

    if (isCurrent) {
      return {
        bg: "bg-violet-500/15",
        border: "border-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]",
        text: "text-violet-300 font-extrabold scale-105"
      };
    }

    if (isParent) {
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
        text: "text-emerald-300 font-semibold"
      };
    }

    if (r === 0 || c === 0) {
      return {
        bg: "bg-zinc-800/40",
        border: "border-zinc-700/40",
        text: "text-zinc-400"
      };
    }

    if (hasValue) {
      return {
        bg: "bg-zinc-900/80",
        border: "border-zinc-800",
        text: "text-zinc-200"
      };
    }

    return {
      bg: "bg-zinc-950/20",
      border: "border-zinc-900/50",
      text: "text-zinc-700 font-light"
    };
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive DP Visualization: Unique Paths ({m} × {n})
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded font-mono">
          O(m × n) Time & Space
        </span>
      </div>

      {/* Controller Buttons */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`px-2.5 py-1 text-[10px] rounded-md transition-all border font-mono ${
              step === idx
                ? "bg-violet-500/10 text-violet-300 border-violet-500/40 shadow-sm"
                : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-800/60 hover:text-zinc-300"
            }`}
          >
            {s.title.split(".")[0]}
          </button>
        ))}
        <button
          onClick={() => setStep(0)}
          className="ml-auto px-2 py-1 text-[10px] rounded-md bg-zinc-800/40 text-zinc-400 border border-zinc-800/40 hover:bg-zinc-800/80 hover:text-zinc-300 flex items-center gap-1 font-mono"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Grid container */}
      <div className="relative mb-6 p-4 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col items-center">
        <div className="grid grid-cols-4 gap-3 w-full max-w-md">
          {Array.from({ length: m }).map((_, r) =>
            Array.from({ length: n }).map((_, c) => {
              const styles = getCellStyles(r, c);
              const val = current.dpGrid[r][c];
              const isCurrent = current.currentCell && current.currentCell[0] === r && current.currentCell[1] === c;
              
              return (
                <div
                  key={`${r}-${c}`}
                  className="flex flex-col items-center relative"
                >
                  {/* Coordinate Label */}
                  <span className="text-[8px] font-mono text-zinc-600 mb-1">
                    ({r},{c})
                  </span>
                  
                  {/* Cell Box */}
                  <div
                    className={`w-full aspect-square max-h-[64px] flex flex-col items-center justify-center rounded-lg border text-sm font-mono transition-all duration-300 relative ${styles.bg} ${styles.border} ${styles.text}`}
                  >
                    {/* Start / Finish Labels */}
                    {r === 0 && c === 0 && (
                      <span className="absolute top-1 text-[7px] font-bold uppercase tracking-wider text-sky-400/80">
                        Start
                      </span>
                    )}
                    {r === m - 1 && c === n - 1 && (
                      <span className="absolute bottom-1 text-[7px] font-bold uppercase tracking-wider text-emerald-400/80">
                        Finish
                      </span>
                    )}

                    <span className="text-base">{val > 0 ? val : "?"}</span>
                  </div>

                  {/* Visual pointers/arrows for computation */}
                  {isCurrent && (
                    <>
                      {/* Arrow from Left */}
                      {c > 0 && (
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-emerald-400 animate-pulse pointer-events-none z-10">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                      {/* Arrow from Top */}
                      {r > 0 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-emerald-400 animate-pulse pointer-events-none z-10">
                          <ArrowDown className="w-4 h-4" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">
            {current.title}
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {current.description}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">
            Code equivalent
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[10px] font-mono text-violet-300/95 border border-zinc-800/60 overflow-x-auto whitespace-pre">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

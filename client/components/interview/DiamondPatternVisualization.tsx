"use client";

import React, { useState } from "react";

interface RowInfo {
  row: number;
  section: "upper" | "middle" | "lower";
  spaces: number;
  stars: number;
  description: string;
  codeSnippet: string;
}

const N = 5;

function buildRows(n: number): RowInfo[] {
  const totalRows = 2 * n - 1;
  const rows: RowInfo[] = [];

  for (let i = 1; i <= totalRows; i++) {
    let spaces: number;
    let stars: number;
    let section: RowInfo["section"];

    if (i <= n) {
      spaces = n - i;
      stars = 2 * i - 1;
      section = i === n ? "middle" : "upper";
    } else {
      const dist = i - n;
      spaces = dist;
      stars = 2 * (n - dist) - 1;
      section = "lower";
    }

    const pad = " ".repeat(spaces);
    const block = "*".repeat(stars);

    let description: string;
    let codeSnippet: string;

    if (i === 1) {
      description = `Row ${i} (upper triangle). We print ${spaces} leading space(s) followed by ${stars} star(s). The upper half widens by 2 stars per row.`;
      codeSnippet = `// Row ${i}: upper half\nfor (int i = 1; i <= n; i++) {\n    int spaces = n - i;   // ${spaces}\n    int stars  = 2 * i - 1; // ${stars}\n    System.out.println("${pad}${block}");\n}`;
    } else if (i < n) {
      description = `Row ${i} (upper triangle). ${spaces} leading space(s) and ${stars} star(s). Stars increase by 2 while spaces decrease by 1.`;
      codeSnippet = `// Row ${i}: upper half\nint spaces = n - i;   // ${spaces}\nint stars  = 2 * i - 1; // ${stars}\nSystem.out.println("${pad}${block}");`;
    } else if (i === n) {
      description = `Row ${i} is the widest middle row. It has 0 leading spaces and ${stars} stars (2n - 1). From here the lower triangle mirrors the upper half.`;
      codeSnippet = `// Row ${i}: middle row (widest)\nint spaces = n - i;   // 0\nint stars  = 2 * i - 1; // ${stars}\nSystem.out.println("${block}");`;
    } else {
      const dist = i - n;
      description = `Row ${i} (lower triangle). Mirroring the upper half, we print ${spaces} leading space(s) and ${stars} star(s). Spaces grow while stars shrink.`;
      codeSnippet = `// Row ${i}: lower half (mirror)\nint dist   = i - n;            // ${dist}\nint spaces = dist;             // ${spaces}\nint stars  = 2 * (n - dist) - 1; // ${stars}\nSystem.out.println("${pad}${block}");`;
    }

    rows.push({ row: i, section, spaces, stars, description, codeSnippet });
  }

  return rows;
}

export function DiamondPatternVisualization() {
  const [step, setStep] = useState(0);
  const rows = buildRows(N);

  const totalSteps = rows.length + 1;
  const isInit = step === 0;
  const isDone = step === totalSteps - 1;
  const current = isInit || isDone ? null : rows[step - 1];

  const visibleRows = isInit ? [] : rows.slice(0, step);

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl animate-in fade-in duration-355">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Diamond Pattern (n = {N})
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time & O(1) Space
        </span>
      </div>

      {/* Stepper buttons */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {Array.from({ length: totalSteps }).map((_, s) => {
          let label = "Init";
          if (s > 0 && s < totalSteps - 1) {
            label = `Row ${s}`;
          } else if (s === totalSteps - 1) {
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

      {/* Diamond canvas + stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Growing diamond */}
        <div className="p-4 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col items-center justify-center min-h-[200px] overflow-x-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4 self-start">
            Output Canvas
          </p>
          {visibleRows.length === 0 ? (
            <div className="text-xs text-zinc-500 italic">
              Empty — ready to print row by row
            </div>
          ) : (
            <pre className="font-mono text-sm leading-relaxed whitespace-pre text-center">
              {visibleRows.map((r, idx) => {
                const isCurrent = !isDone && idx === visibleRows.length - 1;
                return (
                  <div
                    key={r.row}
                    className={`transition-all duration-300 ${
                      isCurrent
                        ? "text-emerald-300 font-bold"
                        : "text-zinc-400"
                    }`}
                  >
                    {" ".repeat(r.spaces)}
                    <span className={isCurrent ? "" : ""}>
                      {"*".repeat(r.stars)}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </div>

        {/* Current row stats */}
        <div className="p-4 bg-black/20 rounded-xl border border-zinc-800/40 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
              {isInit
                ? "Setup"
                : isDone
                  ? "Result"
                  : `Row ${current!.row} — ${current!.section}`}
            </p>
            {isInit ? (
              <p className="text-xs text-zinc-400 leading-relaxed">
                We iterate from row{" "}
                <span className="font-mono text-zinc-200">i = 1</span> to{" "}
                <span className="font-mono text-zinc-200">
                  2n - 1 = {2 * N - 1}
                </span>
                . For each row we print leading spaces followed by stars.
              </p>
            ) : isDone ? (
              <p className="text-xs text-zinc-400 leading-relaxed">
                The diamond is complete —{" "}
                <span className="font-mono text-emerald-300">
                  {2 * N - 1}
                </span>{" "}
                rows printed. The lower half mirrors the upper half.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                    Leading Spaces
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {current!.spaces}
                  </div>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                    Stars
                  </div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {current!.stars}
                  </div>
                </div>
                <div className="col-span-2 p-3 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono mb-1">
                    Row Preview
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 whitespace-pre">
                    {" ".repeat(current!.spaces)}
                    {"*".repeat(current!.stars)}
                  </pre>
                </div>
              </div>
            )}
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
            {isInit
              ? `The diamond has ${2 * N - 1} rows total. The upper half (rows 1 to ${N}) widens; the lower half (rows ${N + 1} to ${2 * N - 1}) narrows, mirroring the top.`
              : isDone
                ? "All rows have been printed. The diamond is symmetric about the middle row."
                : current!.description}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Code Equivalent
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/90 border border-zinc-800/60 overflow-x-auto whitespace-pre">
            {isInit
              ? `// Loop over every row\nfor (int i = 1; i <= 2 * n - 1; i++) {\n    // print spaces then stars\n}`
              : isDone
                ? `// Diamond complete\n// 2n - 1 = ${2 * N - 1} rows printed`
                : current!.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

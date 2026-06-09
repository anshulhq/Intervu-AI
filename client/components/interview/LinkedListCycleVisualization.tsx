"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from "lucide-react";

interface CycleStepInfo {
  title: string;
  slowIndex: number;
  fastIndex: number;
  description: string;
  codeSnippet: string;
}

export function LinkedListCycleVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps: CycleStepInfo[] = [
    {
      title: "0. Initialization",
      slowIndex: 0,
      fastIndex: 0,
      description: "Both the slow (tortoise) and fast (hare) pointers start at the head of the linked list (value 3).",
      codeSnippet: "ListNode slow = head;\nListNode fast = head;"
    },
    {
      title: "1. First Move",
      slowIndex: 1,
      fastIndex: 2,
      description: "Slow pointer moves 1 step forward to Node 2 (value 2). Fast pointer moves 2 steps forward to Node 0 (value 0). They are not equal, so the loop continues.",
      codeSnippet: "slow = slow.next;\nfast = fast.next.next;"
    },
    {
      title: "2. Second Move",
      slowIndex: 2,
      fastIndex: 1,
      description: "Slow pointer moves 1 step to Node 0 (value 0). Fast pointer moves 2 steps: first to -4, then back to 2 via the cycle connection. The gap between them is closing.",
      codeSnippet: "slow = slow.next;\nfast = fast.next.next;"
    },
    {
      title: "3. Third Move - Meeting Point!",
      slowIndex: 3,
      fastIndex: 3,
      description: "Slow pointer moves 1 step to Node -4. Fast pointer moves 2 steps: from 2 to 0, then to -4. Both pointers meet at Node -4! This proves a cycle is present in the list.",
      codeSnippet: "slow = slow.next;\nfast = fast.next.next;\n\nif (slow == fast) {\n    return true; // Cycle detected!\n}"
    }
  ];

  const current = steps[step];

  // Handle auto-playing steps
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
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

  const handleTogglePlay = () => {
    if (step >= steps.length - 1) {
      setStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  // Node locations inside SVG coordinate space
  // We have 4 nodes: indices 0, 1, 2, 3
  const nodes = [
    { x: 45, y: 35, val: "3", index: 0 },
    { x: 135, y: 35, val: "2", index: 1 },
    { x: 225, y: 35, val: "0", index: 2 },
    { x: 315, y: 35, val: "-4", index: 3 }
  ];

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Interactive Visualization: Linked List Cycle Detection
          </h4>
          <span className="text-[9px] text-zinc-600 font-mono mt-0.5">
            Floyd's Tortoise & Hare Algorithm
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time | O(1) Space
        </span>
      </div>

      {/* Stepper & Playback Controls */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-1.5 text-xs rounded-lg bg-zinc-800/30 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/80 hover:text-zinc-200 transition-all"
            title="Reset to Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="p-1.5 text-xs rounded-lg bg-zinc-800/30 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/80 hover:text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1 text-xs rounded-lg border flex items-center gap-1.5 transition-all font-mono ${
              isPlaying
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-amber-300" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-emerald-300" /> {step >= steps.length - 1 ? "Replay" : "Autoplay"}
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={step === steps.length - 1}
            className="p-1.5 text-xs rounded-lg bg-zinc-800/30 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/80 hover:text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Indicator */}
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800/40">
          Step {step} of {steps.length - 1}
        </span>
      </div>

      {/* Linked List Canvas */}
      <div className="relative mb-6 p-4 bg-black/25 rounded-xl border border-zinc-800/40 flex justify-center">
        <svg
          viewBox="0 0 400 130"
          className="w-full max-w-lg overflow-visible"
        >
          {/* Cycle Arrow (Path from Node 3 back to Node 1) */}
          <path
            d="M 340 52 C 340 115, 160 115, 160 52"
            fill="none"
            stroke={step === 3 ? "rgba(245, 158, 11, 0.7)" : "rgba(139, 92, 246, 0.6)"}
            strokeWidth={step === 3 ? "2" : "1.5"}
            strokeDasharray={step === 0 ? "3 3" : "none"}
            className="transition-all duration-500"
          />
          {/* Arrowhead for Cycle Path pointing up at Node 1 */}
          <polygon
            points="156,58 160,50 164,58"
            fill={step === 3 ? "rgba(245, 158, 11, 0.7)" : "rgba(139, 92, 246, 0.6)"}
          />

          {/* Node connections (Next arrows) */}
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null;
            const nextNode = nodes[i + 1];
            return (
              <g key={`arrow-${i}`}>
                <line
                  x1={node.x + 35}
                  y1={node.y}
                  x2={nextNode.x - 20}
                  y2={node.y}
                  stroke="rgba(113, 113, 122, 0.4)"
                  strokeWidth="1.5"
                />
                <polygon
                  points={`${nextNode.x - 23},${node.y - 3} ${nextNode.x - 17},${node.y} ${nextNode.x - 23},${node.y + 3}`}
                  fill="rgba(113, 113, 122, 0.4)"
                />
              </g>
            );
          })}

          {/* Node Renderings */}
          {nodes.map((node) => {
            const isSlowHere = current.slowIndex === node.index;
            const isFastHere = current.fastIndex === node.index;
            const isMeeting = isSlowHere && isFastHere && step === 3;

            let nodeBorder = "rgba(63, 63, 70, 0.4)";
            let nodeBg = "rgba(24, 24, 27, 0.6)";

            if (isMeeting) {
              nodeBorder = "rgba(245, 158, 11, 0.8)";
              nodeBg = "rgba(245, 158, 11, 0.1)";
            } else if (isSlowHere && isFastHere) {
              nodeBorder = "rgba(16, 185, 129, 0.8)";
              nodeBg = "rgba(16, 185, 129, 0.08)";
            } else if (isSlowHere) {
              nodeBorder = "rgba(16, 185, 129, 0.6)";
              nodeBg = "rgba(16, 185, 129, 0.05)";
            } else if (isFastHere) {
              nodeBorder = "rgba(139, 92, 246, 0.6)";
              nodeBg = "rgba(139, 92, 246, 0.05)";
            }

            return (
              <g key={`node-${node.index}`} className="transition-all duration-300">
                {/* Node Box */}
                <rect
                  x={node.x - 20}
                  y={node.y - 17}
                  width="55"
                  height="34"
                  rx="6"
                  fill={nodeBg}
                  stroke={nodeBorder}
                  strokeWidth={isSlowHere || isFastHere ? "2" : "1"}
                  className="transition-all duration-300"
                />
                {/* Val Section */}
                <text
                  x={node.x - 7}
                  y={node.y + 4}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {node.val}
                </text>
                {/* Partition line */}
                <line
                  x1={node.x + 10}
                  y1={node.y - 17}
                  x2={node.x + 10}
                  y2={node.y + 17}
                  stroke={nodeBorder}
                  strokeWidth="1"
                />
                {/* Next Pointer Label */}
                <text
                  x={node.x + 22}
                  y={node.y + 3}
                  fill="rgba(113, 113, 122, 0.8)"
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  next
                </text>

                {/* Node index label */}
                <text
                  x={node.x + 75}
                  y={node.y - 23}
                  fill="rgba(113, 113, 122, 0.5)"
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  idx={node.index}
                </text>

                {/* Pointer tags underneath nodes */}
                {(isSlowHere || isFastHere) && (
                  <g>
                    {isMeeting ? (
                      <g className="animate-bounce">
                        <rect
                          x={node.x - 22}
                          y={node.y + 24}
                          width="59"
                          height="14"
                          rx="4"
                          fill="rgba(245, 158, 11, 0.15)"
                          stroke="rgba(245, 158, 11, 0.4)"
                          strokeWidth="1"
                        />
                        <text
                          x={node.x + 7}
                          y={node.y + 33}
                          fill="rgba(245, 158, 11, 1)"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          Slow & Fast Meet!
                        </text>
                      </g>
                    ) : isSlowHere && isFastHere ? (
                      <g>
                        <rect
                          x={node.x - 18}
                          y={node.y + 24}
                          width="51"
                          height="14"
                          rx="4"
                          fill="rgba(16, 185, 129, 0.15)"
                          stroke="rgba(16, 185, 129, 0.4)"
                          strokeWidth="1"
                        />
                        <text
                          x={node.x + 7}
                          y={node.y + 33}
                          fill="rgba(16, 185, 129, 1)"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          Slow & Fast
                        </text>
                      </g>
                    ) : isSlowHere ? (
                      <g>
                        <rect
                          x={node.x - 10}
                          y={node.y + 24}
                          width="35"
                          height="14"
                          rx="4"
                          fill="rgba(16, 185, 129, 0.12)"
                          stroke="rgba(16, 185, 129, 0.35)"
                          strokeWidth="1"
                        />
                        <text
                          x={node.x + 7}
                          y={node.y + 33}
                          fill="rgba(16, 185, 129, 0.9)"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          Slow
                        </text>
                      </g>
                    ) : (
                      <g>
                        <rect
                          x={node.x - 10}
                          y={node.y + 24}
                          width="35"
                          height="14"
                          rx="4"
                          fill="rgba(139, 92, 246, 0.12)"
                          stroke="rgba(139, 92, 246, 0.35)"
                          strokeWidth="1"
                        />
                        <text
                          x={node.x + 7}
                          y={node.y + 33}
                          fill="rgba(139, 92, 246, 0.9)"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          Fast
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Explanations & Code Segment */}
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
          <pre className="p-3 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/95 border border-zinc-800/60 overflow-x-auto whitespace-pre">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

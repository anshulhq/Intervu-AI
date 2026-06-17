"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from "lucide-react";

interface NodePos {
  x: number;
  y: number;
  state: "idle" | "active" | "swapping" | "processed";
}

interface StepInfo {
  title: string;
  description: string;
  codeSnippet: string;
  nodes: Record<string, NodePos>;
  highlightedEdges: [string, string][];
}

export function InvertBinaryTreeVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Positions configurations
  const P0 = {
    "4": { x: 200, y: 35 },
    "2": { x: 100, y: 95 },
    "7": { x: 300, y: 95 },
    "1": { x: 50, y: 155 },
    "3": { x: 150, y: 155 },
    "6": { x: 250, y: 155 },
    "9": { x: 350, y: 155 },
  };

  const steps: StepInfo[] = [
    {
      title: "0. Initial State",
      description: "We are given the original binary tree. The goal is to invert it so that the left and right children of every node are swapped.",
      codeSnippet: "public TreeNode invertTree(TreeNode root) {\n    // Original tree state",
      highlightedEdges: [],
      nodes: {
        "4": { ...P0["4"], state: "idle" },
        "2": { ...P0["2"], state: "idle" },
        "7": { ...P0["7"], state: "idle" },
        "1": { ...P0["1"], state: "idle" },
        "3": { ...P0["3"], state: "idle" },
        "6": { ...P0["6"], state: "idle" },
        "9": { ...P0["9"], state: "idle" },
      }
    },
    {
      title: "1. DFS Visit Node 4",
      description: "Start the recursion at the root node (4). To invert the entire tree, we must recursively invert its left and right subtrees.",
      codeSnippet: "if (root == null) return null; // root is 4\n// Recurse left first\nTreeNode left = invertTree(root.left);",
      highlightedEdges: [],
      nodes: {
        "4": { ...P0["4"], state: "active" },
        "2": { ...P0["2"], state: "idle" },
        "7": { ...P0["7"], state: "idle" },
        "1": { ...P0["1"], state: "idle" },
        "3": { ...P0["3"], state: "idle" },
        "6": { ...P0["6"], state: "idle" },
        "9": { ...P0["9"], state: "idle" },
      }
    },
    {
      title: "2. Recurse Left to Node 2",
      description: "We traverse down to the left child (2). We will recursively process its left and right subtrees before swapping them.",
      codeSnippet: "// At node 2:\nTreeNode left = invertTree(root.left); // root.left is 1\nTreeNode right = invertTree(root.right); // root.right is 3",
      highlightedEdges: [["4", "2"]],
      nodes: {
        "4": { ...P0["4"], state: "processed" },
        "2": { ...P0["2"], state: "active" },
        "7": { ...P0["7"], state: "idle" },
        "1": { ...P0["1"], state: "idle" },
        "3": { ...P0["3"], state: "idle" },
        "6": { ...P0["6"], state: "idle" },
        "9": { ...P0["9"], state: "idle" },
      }
    },
    {
      title: "3. Swap Children of Node 2",
      description: "The children of node 2 (1 and 3) are leaf nodes, so their subtrees are already trivially inverted. We swap node 1 and node 3.",
      codeSnippet: "// Swapping children of node 2\nroot.left = right;  // now 3\nroot.right = left; // now 1",
      highlightedEdges: [["2", "1"], ["2", "3"]],
      nodes: {
        "4": { ...P0["4"], state: "processed" },
        "2": { ...P0["2"], state: "active" },
        "7": { ...P0["7"], state: "idle" },
        "1": { x: P0["3"].x, y: P0["3"].y, state: "swapping" },
        "3": { x: P0["1"].x, y: P0["1"].y, state: "swapping" },
        "6": { ...P0["6"], state: "idle" },
        "9": { ...P0["9"], state: "idle" },
      }
    },
    {
      title: "4. Recurse Right to Node 7",
      description: "With node 2's subtree fully inverted, we return to node 4 and recurse into the right child (7) to invert its children.",
      codeSnippet: "// At node 4:\n// Recurse right\nTreeNode right = invertTree(root.right); // root.right is 7",
      highlightedEdges: [["4", "7"]],
      nodes: {
        "4": { ...P0["4"], state: "processed" },
        "2": { ...P0["2"], state: "processed" },
        "7": { ...P0["7"], state: "active" },
        "1": { x: P0["3"].x, y: P0["3"].y, state: "processed" },
        "3": { x: P0["1"].x, y: P0["1"].y, state: "processed" },
        "6": { ...P0["6"], state: "idle" },
        "9": { ...P0["9"], state: "idle" },
      }
    },
    {
      title: "5. Swap Children of Node 7",
      description: "The children of node 7 (6 and 9) are also leaves. We swap node 6 and node 9 to invert this subtree.",
      codeSnippet: "// Swapping children of node 7\nroot.left = right;  // now 9\nroot.right = left; // now 6",
      highlightedEdges: [["7", "6"], ["7", "9"]],
      nodes: {
        "4": { ...P0["4"], state: "processed" },
        "2": { ...P0["2"], state: "processed" },
        "7": { ...P0["7"], state: "active" },
        "1": { x: P0["3"].x, y: P0["3"].y, state: "processed" },
        "3": { x: P0["1"].x, y: P0["1"].y, state: "processed" },
        "6": { x: P0["9"].x, y: P0["9"].y, state: "swapping" },
        "9": { x: P0["6"].x, y: P0["6"].y, state: "swapping" },
      }
    },
    {
      title: "6. Swap Subtrees of Root 4",
      description: "Both the left subtree (rooted at 2) and right subtree (rooted at 7) are now inverted. We swap the subtrees of the root (4).",
      codeSnippet: "// Both left & right are inverted\nroot.left = right;  // root.left becomes 7\nroot.right = left; // root.right becomes 2",
      highlightedEdges: [["4", "2"], ["4", "7"]],
      nodes: {
        "4": { ...P0["4"], state: "active" },
        // Root's left child (2) and its children (1, 3) move to the right side
        "2": { x: P0["7"].x, y: P0["7"].y, state: "swapping" },
        "3": { x: P0["6"].x, y: P0["6"].y, state: "swapping" },
        "1": { x: P0["9"].x, y: P0["9"].y, state: "swapping" },
        // Root's right child (7) and its children (6, 9) move to the left side
        "7": { x: P0["2"].x, y: P0["2"].y, state: "swapping" },
        "9": { x: P0["1"].x, y: P0["1"].y, state: "swapping" },
        "6": { x: P0["3"].x, y: P0["3"].y, state: "swapping" },
      }
    },
    {
      title: "7. Complete",
      description: "The binary tree is now completely inverted! We return the root node.",
      codeSnippet: "return root; // Returns node 4 (fully inverted)",
      highlightedEdges: [],
      nodes: {
        "4": { ...P0["4"], state: "processed" },
        "2": { x: P0["7"].x, y: P0["7"].y, state: "processed" },
        "3": { x: P0["6"].x, y: P0["6"].y, state: "processed" },
        "1": { x: P0["9"].x, y: P0["9"].y, state: "processed" },
        "7": { x: P0["2"].x, y: P0["2"].y, state: "processed" },
        "9": { x: P0["1"].x, y: P0["1"].y, state: "processed" },
        "6": { x: P0["3"].x, y: P0["3"].y, state: "processed" },
      }
    }
  ];

  const current = steps[step];

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

  const rawEdges = [
    { from: "4", to: "2" },
    { from: "4", to: "7" },
    { from: "2", to: "1" },
    { from: "2", to: "3" },
    { from: "7", to: "6" },
    { from: "7", to: "9" }
  ];

  const getNodeStyles = (state: string) => {
    if (state === "active") {
      return {
        bg: "fill-emerald-500/20",
        stroke: "stroke-emerald-500",
        strokeWidth: "2.5",
        text: "fill-emerald-200",
        shadow: "drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
      };
    } else if (state === "swapping") {
      return {
        bg: "fill-amber-500/20",
        stroke: "stroke-amber-400",
        strokeWidth: "2.5",
        text: "fill-amber-200",
        shadow: "drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
      };
    } else if (state === "processed") {
      return {
        bg: "fill-violet-500/10",
        stroke: "stroke-violet-500/60",
        strokeWidth: "1.5",
        text: "fill-violet-300",
        shadow: ""
      };
    } else {
      return {
        bg: "fill-zinc-800/40",
        stroke: "stroke-zinc-700",
        strokeWidth: "1",
        text: "fill-zinc-400",
        shadow: ""
      };
    }
  };

  const isEdgeHighlighted = (from: string, to: string) => {
    return current.highlightedEdges.some(([f, t]) => f === from && t === to);
  };

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Interactive Visualization: Invert Binary Tree
          </h4>
          <span className="text-[9px] text-zinc-600 font-mono mt-0.5">
            Depth-First Search (DFS) / Recursion
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time | O(H) Space
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

        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800/40">
          Step {step} of {steps.length - 1}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Binary Tree Canvas */}
        <div className="lg:col-span-7 relative p-4 bg-black/25 rounded-xl border border-zinc-800/40 flex flex-col items-center justify-center min-h-[240px]">
          <svg
            viewBox="0 0 400 200"
            className="w-full max-w-sm overflow-visible"
          >
            {/* Draw connections first (behind nodes) */}
            {rawEdges.map(({ from, to }, i) => {
              const fromNode = current.nodes[from];
              const toNode = current.nodes[to];
              if (!fromNode || !toNode) return null;
              
              const highlighted = isEdgeHighlighted(from, to);

              return (
                <g key={`edge-${i}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={highlighted ? "rgba(245, 158, 11, 0.8)" : "rgba(63, 63, 70, 0.4)"}
                    strokeWidth={highlighted ? "2.5" : "1.5"}
                    strokeDasharray={highlighted ? "4 2" : "none"}
                    style={{ transition: "all 0.5s ease-in-out" }}
                  />
                  {highlighted && (
                    <polygon
                      points={`${(fromNode.x + toNode.x)/2 - 3},${(fromNode.y + toNode.y)/2} ${(fromNode.x + toNode.x)/2 + 3},${(fromNode.y + toNode.y)/2} ${(fromNode.x + toNode.x)/2},${(fromNode.y + toNode.y)/2 + 4}`}
                      fill="rgba(245, 158, 11, 0.8)"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Draw nodes */}
            {Object.entries(current.nodes).map(([id, node]) => {
              const styles = getNodeStyles(node.state);
              
              return (
                <g 
                  key={`node-${id}`} 
                  style={{ transition: "all 0.5s ease-in-out" }}
                >
                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    className={`${styles.bg} ${styles.stroke} ${styles.shadow}`}
                    strokeWidth={styles.strokeWidth}
                    style={{ transition: "all 0.5s ease-in-out" }}
                  />
                  
                  {/* Node Value */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    className={`${styles.text} text-[10px] font-mono font-bold`}
                    textAnchor="middle"
                    style={{ transition: "all 0.5s ease-in-out" }}
                  >
                    {id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* State / Key Tracker */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/40 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono block mb-3">
                Visualization Legend
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-zinc-700 bg-zinc-800/40 flex items-center justify-center text-[8px] text-zinc-400 font-mono">
                    -
                  </div>
                  <span className="text-[10px] text-zinc-400">Idle / Unvisited node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-emerald-500 bg-emerald-500/20 flex items-center justify-center text-[8px] text-emerald-200 font-mono shadow-[0_0_4px_rgba(16,185,129,0.4)]">
                    ★
                  </div>
                  <span className="text-[10px] text-zinc-400">Active / Processing node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-amber-400 bg-amber-500/20 flex items-center justify-center text-[8px] text-amber-200 font-mono shadow-[0_0_4px_rgba(245,158,11,0.4)]">
                    ⇄
                  </div>
                  <span className="text-[10px] text-zinc-400">Swapping nodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-violet-500/60 bg-violet-500/10 flex items-center justify-center text-[8px] text-violet-300 font-mono">
                    ✓
                  </div>
                  <span className="text-[10px] text-zinc-400">Completed / Inverted subtree</span>
                </div>
              </div>
            </div>
            <div className="text-[8.5px] text-zinc-500 font-mono mt-4 leading-normal border-t border-zinc-800/40 pt-2.5">
              Notice how subtrees swap collectively. When node 2 and node 7 swap, they carry their already inverted child nodes along with them.
            </div>
          </div>
        </div>
      </div>

      {/* Narrative & Code Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-5 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-7 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-mono">
            {current.title}
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {current.description}
          </p>
        </div>
        <div className="md:col-span-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-mono">
            Code equivalent
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[9px] font-mono text-emerald-300/95 border border-zinc-800/60 overflow-x-auto whitespace-pre leading-relaxed">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

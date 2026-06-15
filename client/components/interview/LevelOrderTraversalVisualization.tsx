"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from "lucide-react";

interface StepInfo {
  title: string;
  description: string;
  codeSnippet: string;
  queue: string[];
  currentLevel: number[];
  result: number[][];
  activeNode: string | null;
  highlightedEdges: [string, string][];
  nodeStates: Record<string, "idle" | "in-queue" | "active" | "processed">;
}

export function LevelOrderTraversalVisualization() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps: StepInfo[] = [
    {
      title: "0. Initialization",
      description: "We initialize an empty queue and offer the root node (3) to it. The result list is empty.",
      codeSnippet: "Queue<TreeNode> queue = new LinkedList<>();\nqueue.offer(root);\nList<List<Integer>> result = new ArrayList<>();",
      queue: ["3"],
      currentLevel: [],
      result: [],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "in-queue", "9": "idle", "20": "idle", "15": "idle", "7": "idle" }
    },
    {
      title: "1. Start Level 0",
      description: "Level 0: The queue contains 1 node. We record levelSize = 1 and start a new sublist for this level.",
      codeSnippet: "int levelSize = queue.size(); // 1\nList<Integer> currentLevel = new ArrayList<>();",
      queue: ["3"],
      currentLevel: [],
      result: [],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "in-queue", "9": "idle", "20": "idle", "15": "idle", "7": "idle" }
    },
    {
      title: "2. Process Node 3",
      description: "Pop node 3 from the queue and add its value to the level list. Since it has children (9, 20), we offer them to the queue.",
      codeSnippet: "TreeNode curr = queue.poll();\ncurrentLevel.add(curr.val);\nif (curr.left != null) queue.offer(curr.left); // enqueues 9\nif (curr.right != null) queue.offer(curr.right); // enqueues 20",
      queue: ["9", "20"],
      currentLevel: [3],
      result: [],
      activeNode: "3",
      highlightedEdges: [["3", "9"], ["3", "20"]],
      nodeStates: { "3": "active", "9": "in-queue", "20": "in-queue", "15": "idle", "7": "idle" }
    },
    {
      title: "3. Finish Level 0",
      description: "We have processed all levelSize (1) nodes for this level. We add the level list [3] to our final result.",
      codeSnippet: "result.add(currentLevel); // result is now [[3]]",
      queue: ["9", "20"],
      currentLevel: [],
      result: [[3]],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "in-queue", "20": "in-queue", "15": "idle", "7": "idle" }
    },
    {
      title: "4. Start Level 1",
      description: "Level 1: The queue contains 2 nodes (9, 20). We record levelSize = 2 and start a new sublist.",
      codeSnippet: "int levelSize = queue.size(); // 2\nList<Integer> currentLevel = new ArrayList<>();",
      queue: ["9", "20"],
      currentLevel: [],
      result: [[3]],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "in-queue", "20": "in-queue", "15": "idle", "7": "idle" }
    },
    {
      title: "5. Process Node 9",
      description: "Pop node 9. Add its value to the level list. Since node 9 has no children, we do not enqueue anything.",
      codeSnippet: "TreeNode curr = queue.poll();\ncurrentLevel.add(curr.val);\n// curr.left and curr.right are null",
      queue: ["20"],
      currentLevel: [9],
      result: [[3]],
      activeNode: "9",
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "active", "20": "in-queue", "15": "idle", "7": "idle" }
    },
    {
      title: "6. Process Node 20",
      description: "Pop node 20. Add its value to the level list. Since it has children (15, 7), we offer them to the queue.",
      codeSnippet: "TreeNode curr = queue.poll();\ncurrentLevel.add(curr.val);\nif (curr.left != null) queue.offer(curr.left); // enqueues 15\nif (curr.right != null) queue.offer(curr.right); // enqueues 7",
      queue: ["15", "7"],
      currentLevel: [9, 20],
      result: [[3]],
      activeNode: "20",
      highlightedEdges: [["20", "15"], ["20", "7"]],
      nodeStates: { "3": "processed", "9": "processed", "20": "active", "15": "in-queue", "7": "in-queue" }
    },
    {
      title: "7. Finish Level 1",
      description: "We have processed all levelSize (2) nodes for this level. We add the level list [9, 20] to our final result.",
      codeSnippet: "result.add(currentLevel); // result is now [[3], [9, 20]]",
      queue: ["15", "7"],
      currentLevel: [],
      result: [[3], [9, 20]],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "processed", "20": "processed", "15": "in-queue", "7": "in-queue" }
    },
    {
      title: "8. Start Level 2",
      description: "Level 2: The queue contains 2 nodes (15, 7). We record levelSize = 2 and start a new sublist.",
      codeSnippet: "int levelSize = queue.size(); // 2\nList<Integer> currentLevel = new ArrayList<>();",
      queue: ["15", "7"],
      currentLevel: [],
      result: [[3], [9, 20]],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "processed", "20": "processed", "15": "in-queue", "7": "in-queue" }
    },
    {
      title: "9. Process Node 15",
      description: "Pop node 15. Add its value to the level list. Since it has no children, we do not enqueue anything.",
      codeSnippet: "TreeNode curr = queue.poll();\ncurrentLevel.add(curr.val);\n// curr.left and curr.right are null",
      queue: ["7"],
      currentLevel: [15],
      result: [[3], [9, 20]],
      activeNode: "15",
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "processed", "20": "processed", "15": "active", "7": "in-queue" }
    },
    {
      title: "10. Process Node 7",
      description: "Pop node 7. Add its value to the level list. Since it has no children, we do not enqueue anything.",
      codeSnippet: "TreeNode curr = queue.poll();\ncurrentLevel.add(curr.val);\n// curr.left and curr.right are null",
      queue: [],
      currentLevel: [15, 7],
      result: [[3], [9, 20]],
      activeNode: "7",
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "processed", "20": "processed", "15": "processed", "7": "active" }
    },
    {
      title: "11. Finish Level 2",
      description: "We have processed all levelSize (2) nodes for this level. We add the level list [15, 7] to our final result.",
      codeSnippet: "result.add(currentLevel); // result is now [[3], [9, 20], [15, 7]]",
      queue: [],
      currentLevel: [],
      result: [[3], [9, 20], [15, 7]],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "processed", "20": "processed", "15": "processed", "7": "processed" }
    },
    {
      title: "12. Complete",
      description: "The queue is empty. We exit the loop and return our accumulated level-by-level traversal result.",
      codeSnippet: "return result;",
      queue: [],
      currentLevel: [],
      result: [[3], [9, 20], [15, 7]],
      activeNode: null,
      highlightedEdges: [],
      nodeStates: { "3": "processed", "9": "processed", "20": "processed", "15": "processed", "7": "processed" }
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

  // Node coordinates inside the SVG viewbox (400x200)
  const nodes = [
    { id: "3", val: "3", x: 200, y: 35, level: 0 },
    { id: "9", val: "9", x: 100, y: 95, level: 1 },
    { id: "20", val: "20", x: 300, y: 95, level: 1 },
    { id: "15", val: "15", x: 245, y: 155, level: 2 },
    { id: "7", val: "7", x: 355, y: 155, level: 2 },
  ];

  const edges = [
    { from: "3", to: "9" },
    { from: "3", to: "20" },
    { from: "20", to: "15" },
    { from: "20", to: "7" }
  ];

  const getNodeStyles = (nodeId: string) => {
    const state = current.nodeStates[nodeId];
    if (state === "active") {
      return {
        bg: "fill-emerald-500/20",
        stroke: "stroke-emerald-500",
        strokeWidth: "2.5",
        text: "fill-emerald-200",
        shadow: "drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
      };
    } else if (state === "in-queue") {
      return {
        bg: "fill-amber-500/10",
        stroke: "stroke-amber-400",
        strokeWidth: "2",
        text: "fill-amber-200",
        shadow: "drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]"
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
            Interactive Visualization: Binary Tree Level Order Traversal
          </h4>
          <span className="text-[9px] text-zinc-600 font-mono mt-0.5">
            Breadth-First Search (BFS) using a Queue
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time | O(N) Space
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
        <div className="lg:col-span-7 relative p-4 bg-black/25 rounded-xl border border-zinc-800/40 flex flex-col items-center justify-center min-h-[220px]">
          <svg
            viewBox="0 0 400 200"
            className="w-full max-w-sm overflow-visible"
          >
            {/* Draw connections first (behind nodes) */}
            {edges.map(({ from, to }, i) => {
              const fromNode = nodes.find(n => n.id === from)!;
              const toNode = nodes.find(n => n.id === to)!;
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
                    className="transition-all duration-300"
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
            {nodes.map((node) => {
              const styles = getNodeStyles(node.id);
              
              return (
                <g key={`node-${node.id}`} className="transition-all duration-300">
                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    className={`${styles.bg} ${styles.stroke} ${styles.shadow} transition-all duration-300`}
                    strokeWidth={styles.strokeWidth}
                  />
                  
                  {/* Node Value */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    className={`${styles.text} text-[10px] font-mono font-bold transition-all duration-300`}
                    textAnchor="middle"
                  >
                    {node.val}
                  </text>

                  {/* Level labels at the far left */}
                  {node.id === "9" && (
                    <text x={10} y={98} className="fill-zinc-600 text-[8px] font-mono">
                      Level 1
                    </text>
                  )}
                  {node.id === "3" && (
                    <text x={10} y={38} className="fill-zinc-600 text-[8px] font-mono">
                      Level 0
                    </text>
                  )}
                  {node.id === "15" && (
                    <text x={10} y={158} className="fill-zinc-600 text-[8px] font-mono">
                      Level 2
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Queue and State Trackers */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Queue State */}
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/40 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  BFS Queue
                </span>
                <span className="text-[8px] font-mono text-zinc-600">
                  First-In, First-Out (FIFO)
                </span>
              </div>
              <div className="flex items-center gap-1.5 py-1 px-2 bg-black/30 rounded-lg min-h-[44px] overflow-x-auto border border-zinc-900">
                {current.queue.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 italic font-mono pl-1">empty</span>
                ) : (
                  current.queue.map((nodeVal, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.05)]">
                        Node {nodeVal}
                      </div>
                      {idx < current.queue.length - 1 && (
                        <span className="text-zinc-700 text-[9px] font-mono">←</span>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
            <div className="text-[8px] text-zinc-500 mt-2 font-mono leading-tight">
              {current.queue.length > 0 
                ? `Next to process: Node ${current.queue[0]} (leftmost)` 
                : "No nodes waiting in queue."}
            </div>
          </div>

          {/* Current Level List */}
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/40 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  Current Level List
                </span>
                <span className="text-[8px] font-mono text-zinc-600">
                  Temporary level buffer
                </span>
              </div>
              <div className="flex items-center gap-1 py-1 px-2 bg-black/30 rounded-lg min-h-[44px] border border-zinc-900">
                {current.currentLevel.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 italic font-mono pl-1">empty</span>
                ) : (
                  <div className="text-[10px] font-mono font-bold text-emerald-400">
                    [ {current.currentLevel.join(", ")} ]
                  </div>
                )}
              </div>
            </div>
            <div className="text-[8px] text-zinc-500 mt-2 font-mono leading-tight">
              Values collected at the current horizontal level.
            </div>
          </div>

          {/* Final Result List */}
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/40 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  Accumulated Result
                </span>
                <span className="text-[8px] font-mono text-zinc-600">
                  List of lists
                </span>
              </div>
              <div className="flex items-center gap-1 py-1 px-2 bg-black/30 rounded-lg min-h-[44px] border border-zinc-900 overflow-x-auto">
                {current.result.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 italic font-mono pl-1">[]</span>
                ) : (
                  <div className="text-[10px] font-mono font-bold text-violet-300">
                    [ {current.result.map(lvl => `[${lvl.join(",")}]`).join(", ")} ]
                  </div>
                )}
              </div>
            </div>
            <div className="text-[8px] text-zinc-500 mt-2 font-mono leading-tight">
              Final result list structure: List&lt;List&lt;Integer&gt;&gt;
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

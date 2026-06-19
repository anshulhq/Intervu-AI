"use client";

import React, { useState } from "react";

interface NodeProps {
  val: number;
  label?: string;
  pointerLabel?: string;
  colorClass: {
    bg: string;
    border: string;
    text: string;
    pointerText?: string;
  };
}

function ListNodeItem({ val, label, pointerLabel, colorClass }: NodeProps) {
  return (
    <div className="flex flex-col items-center shrink-0">
      {/* Pointer label (e.g., slow/fast) */}
      <span className={`text-[9px] font-mono font-bold mb-1 min-h-[14px] ${colorClass.pointerText || "text-zinc-500"}`}>
        {pointerLabel || ""}
      </span>
      
      {/* Node Box */}
      <div className="flex items-center">
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-all duration-300 ${colorClass.bg} ${colorClass.border}`}
        >
          <div className={`px-3 py-2 text-xs font-bold font-mono ${colorClass.text}`}>
            {val}
          </div>
          <div className="px-2 py-2 text-[9px] text-zinc-500 font-mono border-l border-zinc-800/40">
            next
          </div>
        </div>
      </div>

      {/* Under-node label (e.g. L0, L4) */}
      {label && (
        <span className="text-[9px] font-mono mt-1 text-zinc-500">
          {label}
        </span>
      )}
    </div>
  );
}

function ListArrow({ accentColor = "rgba(16, 185, 129, 0.6)", reversed = false }: { accentColor?: string; reversed?: boolean }) {
  return (
    <svg
      width="24"
      height="20"
      viewBox="0 0 24 20"
      className="shrink-0 mx-0.5"
    >
      {reversed ? (
        <>
          <line
            x1="22"
            y1="10"
            x2="6"
            y2="10"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <polygon
            points="6,6 0,10 6,14"
            fill={accentColor}
            fillOpacity="0.6"
          />
        </>
      ) : (
        <>
          <line
            x1="2"
            y1="10"
            x2="18"
            y2="10"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <polygon
            points="18,6 24,10 18,14"
            fill={accentColor}
            fillOpacity="0.6"
          />
        </>
      )}
    </svg>
  );
}

function NullPointer() {
  return (
    <div className="flex items-center shrink-0">
      <svg
        width="24"
        height="20"
        viewBox="0 0 24 20"
        className="shrink-0 mx-0.5"
      >
        <line
          x1="2"
          y1="10"
          x2="18"
          y2="10"
          stroke="#71717a"
          strokeWidth="1.5"
          strokeDasharray="3 2"
          strokeOpacity="0.4"
        />
        <text
          x="10"
          y="14"
          textAnchor="middle"
          fill="#71717a"
          fontSize="8"
          fontFamily="monospace"
          fillOpacity="0.6"
        >
          /
        </text>
      </svg>
      <span className="text-[10px] font-mono text-zinc-500 italic">null</span>
    </div>
  );
}

export function ReorderListVisualization() {
  const [step, setStep] = useState(0);

  const colors = {
    firstHalf: {
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      pointerText: "text-emerald-400"
    },
    secondHalf: {
      bg: "bg-violet-500/5",
      border: "border-violet-500/20",
      text: "text-violet-400",
      pointerText: "text-violet-400"
    },
    neutral: {
      bg: "bg-zinc-800/10",
      border: "border-zinc-800/40",
      text: "text-zinc-400"
    }
  };

  const steps = [
    {
      title: "0. Start State",
      description: "We are given the original singly linked list. Our goal is to reorder it in-place so that nodes alternate between the start and the end: L0 → Ln → L1 → Ln-1 ...",
      code: `// Singly linked list: 1 -> 2 -> 3 -> 4 -> 5\\n// Length N = 5`
    },
    {
      title: "1. Find Middle",
      description: "Using the slow & fast pointer strategy, slow ends up at the middle node. This divides the list into two halves: Left half [1->2->3] and Right half [4->5].",
      code: `ListNode slow = head, fast = head;\\nwhile (fast != null && fast.next != null) {\\n    slow = slow.next;\\n    fast = fast.next.next;\\n}\\n// Middle node (slow) is 3.\\n// Split points: head1 = 1, head2 = 4.`
    },
    {
      title: "2. Reverse Second Half",
      description: "We disconnect the second half from the first (setting 3.next = null) and reverse the second half. Reversing [4->5] yields [5->4].",
      code: `ListNode prev = null, curr = slow.next;\\nslow.next = null; // Split\\nwhile (curr != null) {\\n    ListNode tmp = curr.next;\\n    curr.next = prev;\\n    prev = curr;\\n    curr = tmp;\\n}\\n// head1 = 1->2->3->null\\n// head2 = 5->4->null (prev points to 5)`
    },
    {
      title: "3. Merge Alternatingly",
      description: "We weave the two lists by alternating nodes: we take a node from the first list, link it to a node from the second, and repeat. Reorder complete!",
      code: `ListNode first = head, second = prev;\\nwhile (second != null) {\\n    ListNode tmp1 = first.next;\\n    ListNode tmp2 = second.next;\\n    \\n    first.next = second;\\n    second.next = tmp1;\\n    \\n    first = tmp1;\\n    second = tmp2;\\n}\\n// Output: 1 -> 5 -> 2 -> 4 -> 3`
    }
  ];

  return (
    <div className="mt-6 p-5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Interactive Visualization: Reorder Linked List
        </h4>
        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
          O(N) Time | O(1) Space
        </span>
      </div>

      {/* Stepper Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border font-mono ${
              step === idx
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "bg-zinc-800/20 text-zinc-400 border-zinc-800/40 hover:bg-zinc-800/50 hover:text-zinc-300"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Main visual display container */}
      <div className="bg-black/20 rounded-xl border border-zinc-800/40 p-6 min-h-[140px] flex flex-col justify-center">
        {/* Step 0: Start State */}
        {step === 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
              Original singly linked list
            </span>
            <div className="flex items-center overflow-x-auto py-2">
              <ListNodeItem val={1} label="L0" colorClass={colors.neutral} />
              <ListArrow accentColor="rgba(113, 113, 122, 0.4)" />
              <ListNodeItem val={2} label="L1" colorClass={colors.neutral} />
              <ListArrow accentColor="rgba(113, 113, 122, 0.4)" />
              <ListNodeItem val={3} label="L2" colorClass={colors.neutral} />
              <ListArrow accentColor="rgba(113, 113, 122, 0.4)" />
              <ListNodeItem val={4} label="L3" colorClass={colors.neutral} />
              <ListArrow accentColor="rgba(113, 113, 122, 0.4)" />
              <ListNodeItem val={5} label="L4 (Ln)" colorClass={colors.neutral} />
              <NullPointer />
            </div>
          </div>
        )}

        {/* Step 1: Find Middle */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                First Half (ends at middle/slow)
              </span>
              <div className="flex items-center overflow-x-auto py-2">
                <ListNodeItem val={1} label="L0" colorClass={colors.firstHalf} pointerLabel="head / head1" />
                <ListArrow accentColor="rgba(16, 185, 129, 0.5)" />
                <ListNodeItem val={2} label="L1" colorClass={colors.firstHalf} />
                <ListArrow accentColor="rgba(16, 185, 129, 0.5)" />
                <ListNodeItem val={3} label="L2" colorClass={colors.firstHalf} pointerLabel="slow (mid)" />
                <ListArrow accentColor="rgba(113, 113, 122, 0.4)" />
                <span className="text-zinc-650 text-xs italic px-1">...</span>
              </div>
            </div>
            
            <div>
              <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider mb-1">
                Second Half (rest of list)
              </span>
              <div className="flex items-center overflow-x-auto py-2">
                <ListNodeItem val={4} label="L3" colorClass={colors.secondHalf} pointerLabel="slow.next" />
                <ListArrow accentColor="rgba(139, 92, 246, 0.5)" />
                <ListNodeItem val={5} label="L4" colorClass={colors.secondHalf} pointerLabel="fast (end)" />
                <NullPointer />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Reverse Second Half */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                First Half (head1)
              </span>
              <div className="flex items-center overflow-x-auto py-2">
                <ListNodeItem val={1} label="L0" colorClass={colors.firstHalf} pointerLabel="head1" />
                <ListArrow accentColor="rgba(16, 185, 129, 0.5)" />
                <ListNodeItem val={2} label="L1" colorClass={colors.firstHalf} />
                <ListArrow accentColor="rgba(16, 185, 129, 0.5)" />
                <ListNodeItem val={3} label="L2" colorClass={colors.firstHalf} />
                <NullPointer />
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider mb-1">
                Reversed Second Half (head2)
              </span>
              <div className="flex items-center overflow-x-auto py-2">
                <ListNodeItem val={5} label="L4" colorClass={colors.secondHalf} pointerLabel="head2 / prev" />
                <ListArrow accentColor="rgba(139, 92, 246, 0.5)" />
                <ListNodeItem val={4} label="L3" colorClass={colors.secondHalf} />
                <NullPointer />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Merge Alternatingly */}
        {step === 3 && (
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
              Final Reordered List (L0 → L4 → L1 → L3 → L2)
            </span>
            <div className="flex items-center overflow-x-auto py-2">
              <ListNodeItem val={1} label="L0" colorClass={colors.firstHalf} />
              <ListArrow accentColor="rgba(139, 92, 246, 0.6)" />
              
              <ListNodeItem val={5} label="L4" colorClass={colors.secondHalf} />
              <ListArrow accentColor="rgba(16, 185, 129, 0.6)" />
              
              <ListNodeItem val={2} label="L1" colorClass={colors.firstHalf} />
              <ListArrow accentColor="rgba(139, 92, 246, 0.6)" />
              
              <ListNodeItem val={4} label="L3" colorClass={colors.secondHalf} />
              <ListArrow accentColor="rgba(16, 185, 129, 0.6)" />
              
              <ListNodeItem val={3} label="L2" colorClass={colors.firstHalf} />
              <NullPointer />
            </div>
          </div>
        )}
      </div>

      {/* Narratives and Code details */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 pt-4 border-t border-zinc-800/40">
        <div className="md:col-span-3 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Step Details
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {steps[step].description}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Code Snippet
          </p>
          <pre className="p-3 bg-zinc-950 rounded-lg text-[10px] font-mono text-emerald-300/90 border border-zinc-800/60 overflow-x-auto whitespace-pre">
            {steps[step].code}
          </pre>
        </div>
      </div>
    </div>
  );
}

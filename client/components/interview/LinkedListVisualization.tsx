"use client";

import React from "react";

interface LinkedListVizProps {
    values: number[];
    reversedValues: number[];
    label: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
}

function LinkedListRow({ values, label, accentColor, bgColor, borderColor }: LinkedListVizProps) {
    if (values.length === 0) {
        return (
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                    {label}
                </p>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-600 italic">null</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">
                {label}
            </p>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {values.map((val, i) => (
                    <React.Fragment key={i}>
                        <div className="flex items-center shrink-0">
                            <div
                                className="relative flex items-center border rounded-lg overflow-hidden"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: bgColor,
                                }}
                            >
                                <div
                                    className="px-3 py-2 text-xs font-bold text-white"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {val}
                                </div>
                                <div className="px-2.5 py-2 text-[10px] text-zinc-500 font-mono">
                                    next
                                </div>
                            </div>
                        </div>
                        {i < values.length - 1 && (
                            <svg
                                width="28"
                                height="20"
                                viewBox="0 0 28 20"
                                className="shrink-0 mx-0.5"
                            >
                                <line
                                    x1="2"
                                    y1="10"
                                    x2="22"
                                    y2="10"
                                    stroke={accentColor}
                                    strokeWidth="1.5"
                                    strokeOpacity="0.6"
                                />
                                <polygon
                                    points="22,6 28,10 22,14"
                                    fill={accentColor}
                                    fillOpacity="0.6"
                                />
                            </svg>
                        )}
                    </React.Fragment>
                ))}
                <svg
                    width="28"
                    height="20"
                    viewBox="0 0 28 20"
                    className="shrink-0 mx-0.5"
                >
                    <line
                        x1="2"
                        y1="10"
                        x2="22"
                        y2="10"
                        stroke="#71717a"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        strokeOpacity="0.4"
                    />
                    <text
                        x="14"
                        y="18"
                        textAnchor="middle"
                        fill="#71717a"
                        fontSize="8"
                        fontFamily="monospace"
                        fillOpacity="0.6"
                    >
                        null
                    </text>
                </svg>
            </div>
        </div>
    );
}

export function LinkedListVisualization() {
    const original = [1, 2, 3, 4, 5];
    const reversed = [5, 4, 3, 2, 1];

    return (
        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600 mb-4">
                Visualization
            </h4>
            <div className="space-y-5">
                <LinkedListRow
                    values={original}
                    reversedValues={reversed}
                    label="Original List"
                    accentColor="rgba(16, 185, 129, 0.8)"
                    bgColor="rgba(16, 185, 129, 0.05)"
                    borderColor="rgba(16, 185, 129, 0.2)"
                />
                <div className="flex items-center justify-center gap-2 py-1">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <svg width="16" height="20" viewBox="0 0 16 20">
                        <path
                            d="M8 2 L8 14"
                            stroke="rgba(16, 185, 129, 0.5)"
                            strokeWidth="1.5"
                        />
                        <polygon
                            points="4,12 8,18 12,12"
                            fill="rgba(16, 185, 129, 0.5)"
                        />
                    </svg>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60">
                        reverse
                    </span>
                    <svg width="16" height="20" viewBox="0 0 16 20">
                        <path
                            d="M8 2 L8 14"
                            stroke="rgba(16, 185, 129, 0.5)"
                            strokeWidth="1.5"
                        />
                        <polygon
                            points="4,12 8,18 12,12"
                            fill="rgba(16, 185, 129, 0.5)"
                        />
                    </svg>
                    <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <LinkedListRow
                    values={reversed}
                    reversedValues={original}
                    label="Reversed List"
                    accentColor="rgba(139, 92, 246, 0.8)"
                    bgColor="rgba(139, 92, 246, 0.05)"
                    borderColor="rgba(139, 92, 246, 0.2)"
                />
            </div>
        </div>
    );
}

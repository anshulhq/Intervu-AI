"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Editor } from '@monaco-editor/react';
import { ArrowLeft, CheckCircle2, Target, ArrowRight, Sparkles, Binary, Cpu, Network, Activity, Brain, FileCode } from 'lucide-react';
import Link from 'next/link';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import {
    ProblemSolvingIcon,
    AlgorithmIcon,
    CodeQualityIcon,
    TestingIcon,
    TimeIcon,
    CommunicationIcon,
} from '@/components/CustomIcons';

interface SessionData {
    question: {
        title: string;
        description: string;
        language?: string;
        fileName?: string;
    };
    code: string;
    language: string;
    fileName: string;
    transcript: Array<{ role: string; content: string }>;
    feedback?: {
        overall_score: number;
        correctness: boolean;
        dimension_scores: {
            problem_solving: number;
            algorithmic_thinking: number;
            code_implementation: number;
            testing: number;
            time_management: number;
            communication: number;
        };
        feedback_markdown: string;
    };
}

function parseMarkdownSections(markdown: string) {
    const sections: Record<string, string> = {};
    const lines = markdown.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    lines.forEach(line => {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
            if (currentSection) {
                sections[currentSection] = currentContent.join('\n').trim();
            }
            let title = match[2].trim();
            const cleanTitle = title.replace(/[^\w\s-]/g, '').trim();

            if (cleanTitle.includes("Strengths") || cleanTitle.includes("What Went Well")) currentSection = "Strengths";
            else if (cleanTitle.includes("Areas for Improvement") || cleanTitle.includes("Improvement") || cleanTitle.includes("Weaknesses")) currentSection = "Areas for Improvement";
            else if (cleanTitle.includes("Summary") || cleanTitle.includes("Executive Summary")) currentSection = "Summary";
            else if (cleanTitle.includes("Problem-Solving") || cleanTitle.includes("Logic")) currentSection = "Problem-Solving";
            else if (cleanTitle.includes("Communication")) currentSection = "Communication";
            else if (cleanTitle.includes("Code Review") || cleanTitle.includes("Code Quality")) currentSection = "Code Review";
            else currentSection = cleanTitle;

            if (!["Strengths", "Areas for Improvement", "Summary", "Problem-Solving", "Communication", "Code Review"].includes(currentSection)) {
                currentSection = cleanTitle;
            }

            currentContent = [];
        } else if (currentSection) {
            currentContent.push(line);
        }
    });

    if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
}

function extractBullets(text: string): string[] {
    return text.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim());
}

export default function ResultPage() {
    const { feedback, question, code } = FAKE_REPORT;
    const sections = parseMarkdownSections(feedback.feedback_markdown);

    const radarData = [
        { dimension: 'Logic', score: feedback.dimension_scores.problem_solving },
        { dimension: 'Algo', score: feedback.dimension_scores.algorithmic_thinking },
        { dimension: 'Code', score: feedback.dimension_scores.code_implementation },
        { dimension: 'Tests', score: feedback.dimension_scores.testing },
        { dimension: 'Speed', score: feedback.dimension_scores.time_management },
        { dimension: 'Voice', score: feedback.dimension_scores.communication },
    ];

    const getPerformanceLabel = (score: number) => {
        if (score >= 9) return 'Elite Operator';
        if (score >= 7) return 'Verdict Passed';
        if (score >= 5) return 'Proficient';
        return 'Needs Refinement';
    };

    const getScoreColor = (score: number) => {
        if (score >= 9) return 'text-emerald-400';
        if (score >= 7) return 'text-emerald-500';
        if (score >= 5) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#030303]">
            <div className="bg-dots absolute inset-0 opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)] pointer-events-none" />

            <header className="relative z-20 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-zinc-600 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-[11px] uppercase tracking-widest">Back</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="px-3.5 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800/60 flex items-center gap-2">
                            <Binary className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px] font-bold text-zinc-400 tracking-wide">{question.title}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800/50 rounded-lg">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                AI Reviewed
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
                <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center mb-16 sm:mb-20">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Evaluation Complete</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tighter text-white mb-6 font-display">
                            {getPerformanceLabel(feedback.overall_score).split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? 'text-gradient' : 'block'}>{word} </span>
                            ))}
                        </h1>

                        <p className="text-base sm:text-lg text-zinc-500 max-w-lg leading-relaxed mb-8">
                            Performance breakdown for <span className="text-white font-semibold">&ldquo;{question.title}&rdquo;</span>
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                                <svg width={120} height={120} className="transform -rotate-90">
                                    <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(39,39,42,0.5)" strokeWidth={8} />
                                    <circle
                                        cx={60} cy={60} r={50} fill="none"
                                        stroke={feedback.overall_score >= 7 ? '#10b981' : feedback.overall_score >= 5 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth={8}
                                        strokeDasharray={2 * Math.PI * 50}
                                        strokeDashoffset={2 * Math.PI * 50 - (feedback.overall_score / 10) * 2 * Math.PI * 50}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white tracking-tighter">{feedback.overall_score}</span>
                                    <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">/ 10</span>
                                </div>
                            </div>
                            <div className="h-16 w-px bg-zinc-800" />
                            <div className="space-y-3">
                                {feedback.correctness && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Logic</div>
                                            <div className="text-sm font-bold text-white">Validated</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="relative bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 border border-zinc-800/60 overflow-hidden">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6">Dimensional Mapping</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(39,39,42,0.5)" />
                                    <PolarAngleAxis
                                        dataKey="dimension"
                                        tick={{ fill: '#71717a', fontSize: 11, fontWeight: 700, textAnchor: 'middle' }}
                                    />
                                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Score"
                                        dataKey="score"
                                        stroke="#10b981"
                                        fill="#10b981"
                                        fillOpacity={0.08}
                                        strokeWidth={2.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16 sm:mb-20">
                    {[
                        { key: 'problem_solving', label: 'Logic', icon: ProblemSolvingIcon },
                        { key: 'algorithmic_thinking', label: 'Strategy', icon: AlgorithmIcon },
                        { key: 'code_implementation', label: 'Code', icon: CodeQualityIcon },
                        { key: 'testing', label: 'Testing', icon: TestingIcon },
                        { key: 'time_management', label: 'Speed', icon: TimeIcon },
                        { key: 'communication', label: 'Voice', icon: CommunicationIcon },
                    ].map(({ key, label, icon: Icon }) => {
                        const score = feedback.dimension_scores[key as keyof typeof feedback.dimension_scores];
                        return (
                            <div key={key} className="bg-[#0a0a0a] border border-zinc-800/60 p-5 rounded-xl group hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all">
                                <Icon className="w-4 h-4 text-zinc-600 mb-3 group-hover:text-emerald-400 transition-colors" />
                                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</div>
                                <div className={`text-xl font-bold tracking-tight ${getScoreColor(score)}`}>{score}<span className="text-zinc-700 text-xs">/10</span></div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-5 gap-6 mb-16 sm:mb-20">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-emerald-500/[0.05] rounded-2xl p-6 sm:p-8 border border-emerald-500/15">
                            <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-2.5">
                                <Network className="w-4 h-4" />
                                Strengths
                            </h3>
                            <ul className="space-y-3">
                                {extractBullets(sections.Strengths || "").map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-2 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <div className="text-zinc-300 text-sm leading-relaxed">
                                            <ReactMarkdown components={{ p: 'span' }}>{item}</ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-amber-500/[0.05] rounded-2xl p-6 sm:p-8 border border-amber-500/15">
                            <h3 className="text-base font-bold text-amber-400 uppercase tracking-wider mb-6 flex items-center gap-2.5">
                                <Activity className="w-4 h-4" />
                                Improve
                            </h3>
                            <ul className="space-y-3">
                                {extractBullets(sections['Areas for Improvement'] || "").map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-2 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                                        <div className="text-zinc-300 text-sm leading-relaxed">
                                            <ReactMarkdown components={{ p: 'span' }}>{item}</ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="relative overflow-hidden bg-[#0a0a0a] rounded-2xl p-6 sm:p-10 border border-zinc-800/60">
                            <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <span className="w-6 h-px bg-zinc-800" />
                                Summary
                            </h3>
                            <div className="text-zinc-400 text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown>{sections.Summary}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-zinc-800/60">
                                <h4 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                                    Problem Solving
                                </h4>
                                <div className="text-zinc-400 text-sm leading-relaxed">
                                    <ReactMarkdown>
                                        {sections['Problem-Solving'] || ''}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-zinc-800/60">
                                <h4 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Network className="w-3.5 h-3.5 text-emerald-400" />
                                    Communication
                                </h4>
                                <div className="text-zinc-400 text-sm leading-relaxed">
                                    <ReactMarkdown>
                                        {sections.Communication || 'Detailed communication analysis will appear here.'}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-zinc-800/60 relative overflow-hidden">
                            <h4 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                                Code Review
                            </h4>
                            <div className="text-zinc-400 text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown>
                                    {sections['Code Review'] || ''}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 mb-16 sm:mb-20">
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 font-display">Transcript</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                            Full conversation between <span className="text-white font-medium">you</span> and <span className="text-emerald-400 font-medium">Intervu AI</span>.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Session recorded
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden">
                        <div className="p-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1 p-3">
                                {FAKE_REPORT.transcript.map((msg, idx) => (
                                    <div key={idx} className="group p-4 rounded-xl hover:bg-zinc-900/60 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                    {msg.role === 'user' ? 'U' : 'AI'}
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-zinc-500' : 'text-emerald-400'}`}>
                                                    {msg.role === 'user' ? 'You' : 'Intervu AI'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm leading-relaxed pl-8 ${msg.role === 'user' ? 'text-zinc-400' : 'text-zinc-300'}`}>
                                            {msg.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group mb-16 sm:mb-20">
                    <div className="relative bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden">
                        <div className="px-6 py-3 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                </div>
                                <div className="h-3 w-px bg-zinc-800" />
                                <span className="text-[11px] font-bold text-zinc-500">Solution.java</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800/50">
                                <Binary className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] font-bold text-zinc-500">Java</span>
                            </div>
                        </div>
                        <div className="p-1 bg-[#0d1117]">
                            <Editor
                                height="400px"
                                language="java"
                                value={code}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    lineNumbers: 'on',
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    renderLineHighlight: 'none',
                                    scrollbar: { vertical: 'hidden' }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative text-center pb-12 sm:pb-16">
                    <div className="inline-flex items-center gap-3 p-1.5 pl-6 bg-[#0a0a0a] border border-zinc-800/60 rounded-full">
                        <span className="text-sm font-medium text-zinc-500">Ready for another round?</span>
                        <Link
                            href="/interview/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/15"
                        >
                            Next Interview <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="relative z-10 py-8 border-t border-zinc-800/40 text-center">
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">&copy; 2026 Intervu AI</p>
            </footer>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </main>
    );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { CodeEditor } from './CodeEditor';
import { VoiceComponent } from './VoiceComponent';
import { LinkedListVisualization } from './LinkedListVisualization';
import {
    FileCode,
    Sparkles,
    ChevronLeft,
    CheckCircle2,
    Mic,
    ArrowRight,
    MessageSquare,
    FileText,
} from 'lucide-react';
import Link from 'next/link';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    StartAudio,
    useRoomContext,
    useLocalParticipant,
    useRemoteParticipants,
} from '@livekit/components-react';
import { RoomEvent, RemoteParticipant, ConnectionState } from 'livekit-client';
import '@livekit/components-styles';

interface InterviewRoomProps {
    sessionId: string;
}

interface Question {
    title: string;
    description: string;
    examples: string[];
    starterCode: string;
    language: string;
    fileName: string;
    visualization?: string;
}

const INITIAL_QUESTION: Question = {
    title: "Loading...",
    description: "Fetching question details...",
    examples: [],
    starterCode: "// Preparing your interview environment...",
    language: "java",
    fileName: "Solution.java",
};

function SidebarTab({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${active ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                }`}
        >
            {icon}
            {label}
            {active && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-emerald-500 rounded-t-full" />
            )}
        </button>
    );
}

function QuestionPanel({ question }: { question: Question }) {
    return (
        <div className="h-full overflow-y-auto p-6">
            <h3 className="text-base font-bold text-white mb-4 font-display">
                {question.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap mb-6">
                {question.description}
            </p>
            {question.examples.length > 0 && (
                <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600 mb-4">
                        Examples
                    </h4>
                    <div className="space-y-3">
                        {question.examples.map((ex, i) => (
                            <div
                                key={i}
                                className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-400 border border-zinc-800/60 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
                                <span className="text-zinc-600 mr-1.5">Example {i + 1}:</span>
                                {ex}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {question.visualization === 'linked-list-reversal' && (
                <LinkedListVisualization />
            )}
        </div>
    );
}

const ActiveInterviewSession = ({
    question,
    code,
    setCode,
    sessionId,
    transcript,
    setTranscript,
    onEndCall,
    totalQuestions,
    currentQuestionIndex,
}: {
    question: Question;
    code: string;
    setCode: (c: string) => void;
    sessionId: string;
    transcript: Array<{ role: "ai" | "user"; content: string }>;
    setTranscript: React.Dispatch<
        React.SetStateAction<Array<{ role: "ai" | "user"; content: string }>>
    >;
    onEndCall: () => void;
    totalQuestions: number;
    currentQuestionIndex: number;
}) => {
    const room = useRoomContext();
    const { localParticipant } = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeTab, setActiveTab] = useState<"interview" | "problem">(
        "interview"
    );

    const transcriptBufferRef = useRef<Array<{ role: "ai" | "user"; content: string }>>([]);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const DEBOUNCE_MS = 1800;

    const flushTranscriptBuffer = useCallback(() => {
        const buffered = transcriptBufferRef.current;
        if (buffered.length === 0) return;

        const merged: Array<{ role: "ai" | "user"; content: string }> = [];
        for (const item of buffered) {
            const last = merged[merged.length - 1];
            if (last && last.role === item.role) {
                last.content = last.content + " " + item.content;
            } else {
                merged.push({ ...item });
            }
        }

        setTranscript((prev) => [...prev, ...merged]);
        transcriptBufferRef.current = [];
    }, []);

    const queueTranscript = useCallback((role: "ai" | "user", content: string) => {
        transcriptBufferRef.current.push({ role, content });

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            flushTranscriptBuffer();
        }, DEBOUNCE_MS);
    }, [flushTranscriptBuffer]);

    useEffect(() => {
        const handleTrackSubscribed = (track: any) => {
            if (track.kind === "audio") {
                const audioEl = track.attach();
                audioEl.autoplay = true;
                audioEl.volume = 1.0;
                document.body.appendChild(audioEl);
            }
        };
        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        return () => {
            room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        };
    }, [room]);

    const [problemContextSent, setProblemContextSent] = useState(false);
    const [problemAckReceived, setProblemAckReceived] = useState(false);

    useEffect(() => {
        setProblemAckReceived(false);
        setProblemContextSent(false);
    }, [sessionId]);

    useEffect(() => {
        if (problemAckReceived) return;

        const sendProblemContext = async () => {
            if (!room || !localParticipant || question.title === "Loading...")
                return;
            if (
                room.state !== ConnectionState.Connected &&
                room.state !== ConnectionState.Reconnecting
            )
                return;

            try {
                const problemData = {
                    type: "problem",
                    title: question.title,
                    description: question.description,
                    examples: question.examples,
                };
                const encoder = new TextEncoder();
                await localParticipant.publishData(
                    encoder.encode(JSON.stringify(problemData)),
                    { reliable: true }
                );
            } catch (e) {
                // ignore
            }
        };

        if (room.state === ConnectionState.Connected) {
            sendProblemContext();
        }

        const handleReconnected = () => {
            sendProblemContext();
        };
        room.on(RoomEvent.Reconnected, handleReconnected);

        const intervalId = setInterval(sendProblemContext, 500);

        return () => {
            clearInterval(intervalId);
            room.off(RoomEvent.Reconnected, handleReconnected);
        };
    }, [room, localParticipant, question, room?.state, problemAckReceived]);

    useEffect(() => {
        const checkSpeaking = () => {
            const speaking = remoteParticipants.some((p) => p.isSpeaking);
            setIsSpeaking(speaking);
        };
        room.on(RoomEvent.ActiveSpeakersChanged, checkSpeaking);
        const interval = setInterval(checkSpeaking, 100);
        return () => {
            room.off(RoomEvent.ActiveSpeakersChanged, checkSpeaking);
            clearInterval(interval);
        };
    }, [remoteParticipants, room]);

    useEffect(() => {
        const handleData = (
            payload: Uint8Array,
            participant?: RemoteParticipant
        ) => {
            try {
                const decoder = new TextDecoder();
                const data = JSON.parse(decoder.decode(payload));
                if (data.type === "transcript") {
                    let cleanedText = data.text
                        .replace(/<function[^>]*>.*?<\/function>/gi, "")
                        .replace(
                            /\{["']?reason["']?\s*:\s*["'][^"']*["']?\s*\}/gi,
                            ""
                        )
                        .replace(/get_current_code\([^)]*\)/gi, "")
                        .replace(/get_problem_details\([^)]*\)/gi, "")
                        .trim();

                    if (cleanedText && cleanedText.length > 0) {
                        setTranscript((prev) => [
                            ...prev,
                            {
                                role: data.role === "assistant" ? "ai" : "user",
                                content: cleanedText,
                            },
                        ]);
                    }

                    if (data.role === "user") {
                        const terminationRegex =
                            /(I('?m| am) done|End (the )?(interview|test|call)|That'?s all|Stop the interview|submit|finish)/i;
                        if (terminationRegex.test(data.text)) {
                            onEndCall();
                        }
                    }
                } else if (data.type === "problem_ack") {
                    setProblemAckReceived(true);
                }
            } catch (e) {
                console.error(e);
            }
        };
        room.on(RoomEvent.DataReceived, handleData);
        return () => {
            room.off(RoomEvent.DataReceived, handleData);
        };
    }, [room, onEndCall]);

    useEffect(() => {
        const cleanTranscript = (text: string): string => {
            return text
                .replace(/<function[^>]*>.*?<\/function>/gi, "")
                .replace(
                    /\{["']?reason["']?\s*:\s*["'][^"']*["']?\s*\}/gi,
                    ""
                )
                .replace(/get_current_code\([^)]*\)/gi, "")
                .replace(/get_problem_details\([^)]*\)/gi, "")
                .replace(/I'll take a look at your code\.\s*/gi, "")
                .replace(/Let me check.*?code\.\s*/gi, "")
                .trim();
        };

        const handleTranscription = (
            segments: any,
            participant?: any,
            publication?: any
        ) => {
            segments.forEach((segment: any) => {
                const rawText = segment.text || "";
                const cleanedText = cleanTranscript(rawText);
                const isFinal = segment.final;

                if (isFinal && cleanedText && cleanedText.length > 0) {
                    const role = participant?.identity?.includes("agent")
                        ? "ai"
                        : "user";

                    queueTranscript(role, cleanedText);

                    if (role === "user") {
                        const terminationRegex =
                            /(I('?m| am) done|End (the )?(interview|test|call)|That'?s all|Stop the interview|submit|finish|I am done|Im done)/i;
                        if (terminationRegex.test(rawText)) {
                            flushTranscriptBuffer();
                            setTimeout(() => onEndCall(), 1000);
                        }
                    }
                }
            });
        };

        room.on(RoomEvent.TranscriptionReceived, handleTranscription);
        return () => {
            room.off(RoomEvent.TranscriptionReceived, handleTranscription);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                flushTranscriptBuffer();
            }
        };
    }, [room, onEndCall, queueTranscript, flushTranscriptBuffer]);

    useEffect(() => {
        if (!room || !localParticipant) return;
        if (room.state !== ConnectionState.Connected) return;

        const handler = setTimeout(async () => {
            try {
                const strData = JSON.stringify({
                    type: "code",
                    content: code,
                });
                const encoder = new TextEncoder();
                await localParticipant.publishData(
                    encoder.encode(strData),
                    { reliable: true }
                );
            } catch (e) {
                if (
                    !(e instanceof Error) ||
                    !e.message.includes("PC manager")
                ) {
                    console.error("Failed to send code update:", e);
                }
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [code, room, localParticipant, room?.state]);

    const toggleMute = async () => {
        if (localParticipant) {
            const enabled = localParticipant.isMicrophoneEnabled;
            await localParticipant.setMicrophoneEnabled(!enabled);
        }
    };

    return (
        <PanelGroup
            orientation="horizontal"
            className="flex-1 overflow-hidden"
        >
            <Panel
                defaultSize={40}
                minSize={28}
                className="relative z-10 flex flex-col bg-[#0a0a0a] border-r border-zinc-800/50"
            >
                <div className="flex items-center border-b border-zinc-800/50 shrink-0 px-1">
                    <SidebarTab
                        active={activeTab === "interview"}
                        onClick={() => setActiveTab("interview")}
                        icon={<MessageSquare size={13} />}
                        label="Interview"
                    />
                    <SidebarTab
                        active={activeTab === "problem"}
                        onClick={() => setActiveTab("problem")}
                        icon={<FileText size={13} />}
                        label="Problem"
                    />
                    {totalQuestions > 1 && (
                        <div className="ml-auto pr-3">
                            <span className="text-[11px] font-bold text-zinc-700">
                                Q{currentQuestionIndex + 1}/{totalQuestions}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === "interview" ? (
                        <VoiceComponent
                            isConnected={true}
                            isSpeaking={isSpeaking}
                            isMuted={!localParticipant?.isMicrophoneEnabled}
                            transcript={transcript}
                            onStart={() => { }}
                            onStop={onEndCall}
                            onToggleMute={toggleMute}
                            onViewProblem={() => setActiveTab("problem")}
                        />
                    ) : (
                        <QuestionPanel question={question} />
                    )}
                </div>
            </Panel>
            <PanelResizeHandle className="w-[1px] bg-zinc-800/50 hover:bg-emerald-500/40 transition-colors z-20" />
            <Panel defaultSize={60}>
                <div className="h-full flex flex-col bg-[#0d1117]">
                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800/50 shrink-0">
                        <div className="flex items-center gap-2">
                            <FileCode
                                size={13}
                                className="text-zinc-500"
                            />
                            <span className="text-[12px] font-bold text-zinc-400 tracking-tight">
                                {question.fileName || 'Solution.java'}
                            </span>
                        </div>
                        <button
                            onClick={() => setActiveTab("problem")}
                            className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
                        >
                            <FileText size={11} />
                            View Problem
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <CodeEditor
                            code={code}
                            onChange={(v) =>
                                v !== undefined && setCode(v)
                            }
                            language={question.language || 'java'}
                        />
                    </div>
                </div>
            </Panel>
        </PanelGroup>
    );
};

export default function InterviewRoom({
    sessionId: initialSessionId,
}: InterviewRoomProps) {
    const router = useRouter();
    const [code, setCode] = useState<string>("");
    const [question, setQuestion] = useState(INITIAL_QUESTION);
    const [currentSessionId, setCurrentSessionId] =
        useState<string>(initialSessionId);
    const [token, setToken] = useState<string>("");
    const [wsUrl, setWsUrl] = useState<string>("");

    const [totalQuestions, setTotalQuestions] = useState<number>(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState<number>(0);
    const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

    const [transcript, setTranscript] = useState<
        Array<{ role: "ai" | "user"; content: string }>
    >([]);

    const [hasStarted, setHasStarted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const hasSubmittedRef = useRef(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                if (initialSessionId !== "new") {
                    const res = await fetch(
                        `http://localhost:4000/api/session/${initialSessionId}`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        setQuestion(data.question);
                        setCode(data.code || data.question.starterCode);
                        setTotalQuestions(data.questions?.length || 1);
                        setCurrentQuestionIndex(
                            data.currentQuestionIndex || 0
                        );
                        return;
                    }
                }
                const res = await fetch("http://localhost:4000/api/start", {
                    method: "POST",
                });
                if (res.ok) {
                    const data = await res.json();
                    setQuestion(data.question);
                    setCode(data.question.starterCode);
                    setCurrentSessionId(data.sessionId);
                    setTotalQuestions(data.totalQuestions || 1);
                    setCurrentQuestionIndex(
                        data.currentQuestionIndex || 0
                    );
                    if (initialSessionId === "new") {
                        window.history.replaceState(
                            null,
                            "",
                            `/interview/${data.sessionId}`
                        );
                    }
                }
            } catch (e) {
                console.error("Error fetching session:", e);
            }
        };
        fetchSession();
    }, [initialSessionId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleEndCall();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [code, currentSessionId]);

    const handleStartInterview = async () => {
        setHasStarted(true);
        setIsConnecting(true);
        try {
            const response = await fetch(
                "http://localhost:4000/api/livekit/token",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId: currentSessionId,
                        participantName: `Candidate-${Math.floor(
                            Math.random() * 1000
                        )}`,
                    }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                setWsUrl(data.url);
            }
        } catch (e) {
            console.error("Token error:", e);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleEndCall = async () => {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        setIsSubmittingReport(true);
        setToken("");

        await new Promise((resolve) => setTimeout(resolve, 6000));
        router.push(`/interview/${currentSessionId}/result`);
    };

    const handleNextQuestion = async () => {
        if (isSubmittingQuestion) return;
        setIsSubmittingQuestion(true);

        try {
            const response = await fetch(
                "http://localhost:4000/api/submit-question",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId: currentSessionId,
                        code: code,
                        transcript: transcript,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (data.status === "next_question") {
                    setQuestion(data.question);
                    setCode(data.question.starterCode);
                    setCurrentQuestionIndex(data.currentQuestionIndex);
                    setTranscript([]);
                } else if (data.status === "completed") {
                    router.push(
                        `/interview/${currentSessionId}/result`
                    );
                }
            }
        } catch (error) {
            console.error("Error advancing question:", error);
        } finally {
            setIsSubmittingQuestion(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#030303] overflow-hidden relative">
            {!hasStarted && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#030303]/95 backdrop-blur-md">
                    <div className="bg-dots absolute inset-0 opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
                    <div className="relative max-w-lg w-full text-center px-6">
                        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 animate-speaking-pulse">
                            <Mic
                                className="text-emerald-400"
                                size={32}
                            />
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 font-display">
                            Always Think out Loud during an Interview!
                        </h2>
                        <p className="text-zinc-500 mb-4 leading-relaxed">
                            Think out loud. This is a voice-based AI interview.
                            Your interviewer will guide you through the problem.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-xs text-zinc-600 mb-10">
                            <span className="flex items-center gap-1.5">
                                <Mic size={12} /> Voice-enabled
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileCode size={12} /> Live coding
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles size={12} /> AI-powered
                            </span>
                        </div>
                        <button
                            onClick={handleStartInterview}
                            className="w-full max-w-sm mx-auto py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold text-base shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Begin Session
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="mt-6 text-[11px] text-zinc-700">
                            Press Ctrl+Enter to submit anytime during the
                            interview
                        </p>
                    </div>
                </div>
            )}

            {isConnecting && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#030303]/90 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-[3px] border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-5" />
                        <p className="font-semibold text-white text-sm">
                            Connecting to Intervu AI...
                        </p>
                        <p className="text-zinc-600 text-xs mt-1">
                            Setting up your interview room
                        </p>
                    </div>
                </div>
            )}

            <header className="h-12 border-b border-zinc-800/50 flex items-center justify-between px-4 sm:px-5 shrink-0 z-20 bg-[#0a0a0a]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="text-zinc-600 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </Link>
                    <div className="h-3.5 w-[1px] bg-zinc-800" />
                    <h2 className="font-bold text-white text-sm truncate max-w-[180px] sm:max-w-[280px]">
                        {question.title}
                    </h2>
                    {totalQuestions > 1 && (
                        <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                            <span className="text-[10px] font-bold text-emerald-400">
                                {currentQuestionIndex + 1}/
                                {totalQuestions}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800/50 rounded-md">
                        <Sparkles
                            size={11}
                            className="text-emerald-400"
                        />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            Llama 3.3
                        </span>
                    </div>
                    {currentQuestionIndex + 1 < totalQuestions && (
                        <button
                            onClick={handleNextQuestion}
                            disabled={isSubmittingQuestion}
                            className="bg-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-lg text-[11px] font-bold hover:bg-zinc-700 transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 border border-zinc-700/40"
                        >
                            {isSubmittingQuestion ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                                    <span className="hidden sm:inline">
                                        Submitting...
                                    </span>
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-3 h-3" />
                                </>
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleEndCall}
                        className="bg-emerald-500 text-black px-4 py-1.5 rounded-lg text-[11px] font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/15 flex items-center gap-1.5"
                        title="Submit (Ctrl+Enter)"
                    >
                        <CheckCircle2 size={13} />
                        <span className="hidden sm:inline">
                            {currentQuestionIndex + 1 >= totalQuestions
                                ? "Submit & Get Report"
                                : "Finish Early"}
                        </span>
                        <span className="sm:hidden">Submit</span>
                    </button>
                </div>
            </header>

            {token && wsUrl ? (
                <LiveKitRoom
                    token={token}
                    serverUrl={wsUrl}
                    connect={true}
                    audio={true}
                    video={false}
                    onDisconnected={handleEndCall}
                    className="flex-1 flex"
                >
                    <ActiveInterviewSession
                        question={question}
                        code={code}
                        setCode={setCode}
                        sessionId={currentSessionId}
                        transcript={transcript}
                        setTranscript={setTranscript}
                        onEndCall={handleEndCall}
                        totalQuestions={totalQuestions}
                        currentQuestionIndex={currentQuestionIndex}
                    />
                    <StartAudio label="Click to enable audio" />
                    <RoomAudioRenderer />
                </LiveKitRoom>
            ) : (
                <PanelGroup
                    orientation="horizontal"
                    className="flex-1 overflow-hidden opacity-50 pointer-events-none"
                />
            )}

            {isSubmittingReport && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#030303]/95 backdrop-blur-md">
                    <div className="bg-dots absolute inset-0 opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
                    <div className="relative text-center max-w-lg px-6">
                        <div className="relative mx-auto mb-10 w-24 h-24">
                            <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-emerald-400" />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                                Generating Report
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight font-display">
                            Analyzing Your
                            <br />
                            <span className="text-gradient">Performance</span>
                        </h2>

                        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
                            Intervu AI is evaluating your code quality, communication clarity, and problem-solving approach.
                        </p>

                        <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-600 mb-10">
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                                    <CheckCircle2 size={8} className="text-emerald-400" />
                                </div>
                                Code captured
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                                    <CheckCircle2 size={8} className="text-emerald-400" />
                                </div>
                                Transcript saved
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded border border-zinc-700 bg-zinc-800/50 flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                Generating report
                            </span>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
                                <div className="absolute inset-0 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

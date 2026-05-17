import React, { useRef, useEffect } from "react";
import { Mic, MicOff, PhoneOff, User, Brain, FileText } from "lucide-react";

interface VoiceComponentProps {
    isConnected: boolean;
    isSpeaking: boolean;
    isMuted: boolean;
    transcript: Array<{ role: "ai" | "user"; content: string }>;
    onStart: () => void;
    onStop: () => void;
    onToggleMute: () => void;
    onViewProblem?: () => void;
}

export const VoiceComponent: React.FC<VoiceComponentProps> = ({
    isConnected,
    isSpeaking,
    isMuted,
    transcript,
    onStart,
    onStop,
    onToggleMute,
    onViewProblem,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    return (
        <div className="flex flex-col h-full">
            {/* Status + Waveform Bar */}
            <div className="px-5 py-3 border-b border-zinc-800/40 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                isSpeaking
                                    ? "bg-emerald-500/15 border border-emerald-500/30 animate-speaking-pulse"
                                    : "bg-zinc-900 border border-zinc-800/60"
                            }`}
                        >
                            <Brain
                                className={`w-4 h-4 transition-colors duration-300 ${
                                    isSpeaking
                                        ? "text-emerald-400"
                                        : "text-zinc-600"
                                }`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                Intervu AI
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        isConnected
                                            ? "bg-emerald-500"
                                            : "bg-zinc-700"
                                    }`}
                                />
                                <span
                                    className={`text-[11px] font-medium ${
                                        isSpeaking
                                            ? "text-emerald-400"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    {isConnected
                                        ? isSpeaking
                                            ? "Speaking..."
                                            : "Listening..."
                                        : "Offline"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Waveform */}
                    <div className="flex items-end gap-[3px] h-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`w-[3px] rounded-full transition-all duration-300 ${
                                    isSpeaking
                                        ? `bg-emerald-400 animate-sound-${((i % 3) + 1)}`
                                        : "bg-zinc-800"
                                }`}
                                style={
                                    !isSpeaking
                                        ? { height: `${6 + i * 2}px` }
                                        : undefined
                                }
                            />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onToggleMute}
                            className={`p-2 rounded-lg transition-all ${
                                isMuted
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "hover:bg-zinc-800 text-zinc-500"
                            }`}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? (
                                <MicOff size={15} />
                            ) : (
                                <Mic size={15} />
                            )}
                        </button>
                        <button
                            onClick={onStop}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                            title="End interview"
                        >
                            <PhoneOff size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Transcript */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scroll-smooth"
            >
                {transcript.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-center mb-4">
                            <Brain className="w-6 h-6 text-zinc-700" />
                        </div>
                        <p className="text-sm text-zinc-600 font-medium mb-1">
                            Interview transcript
                        </p>
                        <p className="text-xs text-zinc-700 max-w-[200px]">
                            Speak clearly and the AI interviewer will guide you
                            through the problem.
                        </p>
                        {onViewProblem && (
                            <button
                                onClick={onViewProblem}
                                className="mt-5 flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
                            >
                                <FileText size={12} />
                                View the problem
                            </button>
                        )}
                    </div>
                )}

                {transcript.map((msg, idx) =>
                    msg.role === "ai" ? (
                        <div
                            key={idx}
                            className="flex gap-3 animate-message-in"
                        >
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider mb-1.5">
                                    Interviewer
                                </p>
                                <div className="bg-zinc-900/70 border border-zinc-800/50 rounded-xl rounded-tl-sm px-4 py-3">
                                    <p className="text-[13px] text-zinc-200 leading-[1.6]">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={idx}
                            className="flex gap-3 justify-end animate-message-in"
                        >
                            <div className="min-w-0 max-w-[80%]">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1.5 text-right">
                                    You
                                </p>
                                <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl rounded-tr-sm px-4 py-3">
                                    <p className="text-[13px] text-zinc-300 leading-[1.6]">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <User className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Bottom hint */}
            <div className="px-5 py-2.5 border-t border-zinc-800/40 shrink-0">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-zinc-700">
                        {isMuted
                            ? "Microphone muted — unmute to respond"
                            : "Microphone active — speak naturally"}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <div
                            className={`w-1.5 h-1.5 rounded-full ${
                                isMuted ? "bg-red-500/60" : "bg-emerald-500/60"
                            }`}
                        />
                        <span
                            className={`text-[10px] font-medium ${
                                isMuted ? "text-red-500/60" : "text-emerald-500/60"
                            }`}
                        >
                            {isMuted ? "Muted" : "Live"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Code2,
  Brain,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Play,
  Check,
  AlertCircle,
  ArrowLeft,
  X,
  SlidersHorizontal
} from "lucide-react";
import clsx from "clsx";

interface QuestionDef {
  id: string;
  title: string;
  description: string;
  examples: string[];
  starterCode: string;
  language: string;
  fileName: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  visualization?: string;
}

export default function QuestionSelector() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionDef | null>(null);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/api/questions?detailed=true");
        if (!res.ok) {
          throw new Error("Failed to fetch questions from the server");
        }
        const data = await res.json();
        setQuestions(data.questions || []);
        
        // Auto-select first question if available
        if (data.questions && data.questions.length > 0) {
          setSelectedQuestion(data.questions[0]);
        }
      } catch (err: any) {
        console.error("Error loading questions:", err);
        setError(err.message || "An error occurred while loading questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Get unique categories for the filter
  const categories = ["all", ...Array.from(new Set(questions.map((q) => q.category)))];

  // Filter questions based on search query, difficulty, and category
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleStartInterview = async (questionId: string) => {
    if (startingSession) return;
    try {
      setStartingSession(true);
      const res = await fetch("http://localhost:4000/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize custom session");
      }

      const data = await res.json();
      // Redirect to the interview room with the active session
      router.push(`/interview/${data.sessionId}`);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert("Error starting session. Make sure the backend server is running.");
      setStartingSession(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-10 flex flex-col min-h-screen text-zinc-300 font-body select-none">
      {/* Dynamic Background Grid and Radial Highlights */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-dots opacity-[0.4]" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/10 top-1/10 h-[600px] w-[600px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.06)_0%,transparent_70%)] animate-pulse-slow" />
        <div className="absolute right-1/10 bottom-1/10 h-[600px] w-[600px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.05)_0%,transparent_70%)] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.02)_0%,transparent_75%)]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Back Button & Top Navigation bar */}
        <div className="flex items-center justify-between mb-8 border-b border-zinc-900/80 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-all duration-300 group px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/30"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>INTERVU CLIENT v1.2.0</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10 text-left relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 mb-4 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Adaptive DSA Registry
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Select Your <span className="text-gradient">Challenge</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed font-light">
            Target your specific coding practice. The AI voice interviewer loads your selected problem, adaptive-hints your coding environment, and evaluates your approach post-interview.
          </p>
          <div className="absolute right-0 top-0 hidden xl:block">
            <div className="w-[180px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Search Input */}
          <div className="relative md:col-span-5 flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search challenges by title, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-sm transition-all duration-200 placeholder-zinc-650 text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Segmented Control */}
          <div className="md:col-span-4 flex p-1 bg-zinc-950/50 border border-zinc-800/80 rounded-xl">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={clsx(
                  "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all duration-300",
                  selectedDifficulty === diff
                    ? diff === "easy"
                      ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                      : diff === "medium"
                      ? "bg-amber-500/10 text-amber-450 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]"
                      : diff === "hard"
                      ? "bg-rose-500/10 text-rose-450 border border-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.05)]"
                      : "bg-zinc-800/80 text-white border border-zinc-700/60"
                    : "text-zinc-550 hover:text-zinc-300 border border-transparent"
                )}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3 relative flex items-center">
            <SlidersHorizontal className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-sm transition-all duration-200 text-white capitalize appearance-none cursor-pointer"
            >
              <option value="all">All Topics</option>
              {categories.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 pointer-events-none border-l border-zinc-850 pl-2">
              <ChevronRight className="w-4 h-4 text-zinc-500 rotate-90" />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Question Grid list (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-3.5 max-h-[680px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              // Loading skeleton states
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 bg-zinc-950/40 border border-zinc-900 animate-pulse rounded-xl" />
              ))
            ) : error ? (
              <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-white font-semibold text-base">Backend Connection Required</h3>
                <p className="text-zinc-400 text-xs max-w-md mx-auto">
                  {error}. Please verify that the server is running on `http://localhost:4000` to load questions and start sessions.
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="p-12 border border-dashed border-zinc-800/80 bg-zinc-950/20 rounded-xl text-center">
                <p className="text-zinc-500 text-sm">No challenges matched your search filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDifficulty("all");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={clsx(
                    "group relative p-5 border rounded-xl cursor-pointer transition-all duration-350 bg-zinc-950/20 hover:bg-zinc-950/60 select-none hover:-translate-y-0.5",
                    selectedQuestion?.id === q.id
                      ? q.difficulty === "easy"
                        ? "border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.12)] bg-zinc-950/80"
                        : q.difficulty === "medium"
                        ? "border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.12)] bg-zinc-950/80"
                        : "border-rose-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.12)] bg-zinc-950/80"
                      : "border-zinc-900/80 hover:border-zinc-800"
                  )}
                >
                  {/* Glowing left accent border */}
                  <div
                    className={clsx(
                      "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-300",
                      selectedQuestion?.id === q.id
                        ? q.difficulty === "easy"
                          ? "bg-emerald-500"
                          : q.difficulty === "medium"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                        : "bg-transparent group-hover:bg-zinc-800"
                    )}
                  />

                  <div className="flex items-start justify-between gap-4 pl-1">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider font-mono",
                            getDifficultyColor(q.difficulty)
                          )}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">
                          {q.category}
                        </span>
                        {q.visualization && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-teal-400 bg-teal-500/5 border border-teal-500/15 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider animate-pulse-slow">
                            <Sparkles className="w-2.5 h-2.5" /> Interactive Viz
                          </span>
                        )}
                      </div>
                      
                      <h3 className={clsx(
                        "text-base font-bold transition-colors duration-200",
                        selectedQuestion?.id === q.id
                          ? q.difficulty === "easy"
                            ? "text-emerald-400"
                            : q.difficulty === "medium"
                            ? "text-amber-400"
                            : "text-rose-400"
                          : "text-white group-hover:text-emerald-400"
                      )}>
                        {q.title}
                      </h3>
                      {/* Truncated description snippet */}
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-light">
                        {q.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-zinc-900 group-hover:border-zinc-800 group-hover:bg-zinc-900/50 transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:text-zinc-300 transition-colors" />
                    </div>
                  </div>

                  {/* Horizontal pill list of tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3.5 border-t border-zinc-900/60 pl-1">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-zinc-950/80 rounded-full text-[9px] text-zinc-550 border border-zinc-900/50 hover:border-zinc-800 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Question Details View Panel (Right 5 Columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            {selectedQuestion ? (
              <div className="relative rounded-xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm overflow-hidden shadow-2xl flex flex-col max-h-[680px]">
                {/* Details Header */}
                <div className="p-6 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={clsx(
                        "px-2.5 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider",
                        getDifficultyColor(selectedQuestion.difficulty)
                      )}
                    >
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      {selectedQuestion.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {selectedQuestion.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-zinc-600" /> Coding Challenge
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" /> ~25 min
                    </span>
                  </div>
                </div>

                {/* Scrollable details content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Problem Statement
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                      {selectedQuestion.description}
                    </p>
                  </div>

                  {selectedQuestion.examples && selectedQuestion.examples.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                        Examples
                      </h4>
                      <div className="space-y-2">
                        {selectedQuestion.examples.map((example, i) => (
                          <div
                            key={i}
                            className="bg-[#0b0c0e]/80 border border-zinc-900 rounded-lg p-3 font-mono text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap"
                          >
                            <span className="text-[10px] font-semibold text-emerald-400 block mb-1">
                              Example {i + 1}
                            </span>
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Starter Code Skeleton
                    </h4>
                    <div className="bg-[#0d1117] border border-zinc-900 rounded-lg p-3.5 font-mono text-[11px] text-zinc-400 leading-relaxed overflow-x-auto select-none">
                      <div className="text-[10px] text-zinc-600 mb-1">
                        // {selectedQuestion.fileName} ({selectedQuestion.language})
                      </div>
                      <pre className="whitespace-pre">{selectedQuestion.starterCode}</pre>
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-5 border-t border-zinc-900 bg-zinc-950/90 flex flex-col gap-3">
                  <button
                    onClick={() => handleStartInterview(selectedQuestion.id)}
                    disabled={startingSession}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all duration-200 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {startingSession ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        Initializing Interview...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-black" />
                        Start Voice Interview
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center">
                    Starting will initialize a LiveKit session with room &ldquo;intervu-ai-interview&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-96 border border-dashed border-zinc-800/80 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-zinc-950/10">
                <BookOpen className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-500">Select a question to inspect constraints, examples, and start the round.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

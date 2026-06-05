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
  ArrowLeft
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
    <div className="relative w-full max-w-7xl mx-auto px-6 py-10 flex flex-col min-h-screen text-zinc-300">
      {/* Background radial highlights */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.04)_0%,transparent_70%)]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors duration-200 group w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Interactive Interview Registry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-display">
            Select Your Challenge
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Choose a specific coding question to focus your practice. Your AI voice interviewer will load your selection, customize its guidance, and provide a full analysis upon submission.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by title, tag, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-sm transition-all duration-200 placeholder-zinc-600 text-white"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-sm transition-all duration-200 text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none text-sm transition-all duration-200 text-white capitalize"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
                    "group relative p-5 border rounded-xl cursor-pointer transition-all duration-300 bg-zinc-950/40 hover:bg-zinc-950/80 select-none",
                    selectedQuestion?.id === q.id
                      ? "border-emerald-500/50 shadow-lg shadow-emerald-500/5 bg-zinc-950/90"
                      : "border-zinc-800/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={clsx(
                            "px-2.5 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider",
                            getDifficultyColor(q.difficulty)
                          )}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {q.category}
                        </span>
                        {q.visualization && (
                          <span className="text-[10px] text-teal-400 bg-teal-500/5 border border-teal-500/10 px-2 py-0.5 rounded font-mono">
                            Interactive Viz
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors duration-200">
                        {q.title}
                      </h3>
                      {/* Truncated description snippet */}
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {q.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>

                  {/* Horizontal pill list of tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-zinc-900/40">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-zinc-900/60 rounded text-[9px] text-zinc-500 border border-zinc-900 hover:border-zinc-800 transition-colors"
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

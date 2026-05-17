import Link from "next/link";
import { Mic, Code2, BarChart3, ArrowRight, Zap, Play } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-dots absolute inset-0 opacity-40" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[900px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.04)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.03)_0%,transparent_70%)]" />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-display">
            Intervu AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
          <a
            href="#features"
            className="hover:text-white transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors duration-200"
          >
            How it works
          </a>
        </div>
        <Link
          href="/interview/new"
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors duration-200 active:scale-95"
        >
          Start Free
        </Link>
      </nav>

      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-10 animate-fade-up">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Built by an engineer, for engineers
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-white mb-8 animate-fade-up-d1 font-display">
          Blazing Fast
          <br />
          <span className="text-gradient">Real-Time AI Voice</span>
          <br />
          <span>Mock Interviews</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-up-d2">
          AI-powered mock interviews that simulate real technical rounds. An AI
          interviewer that adapts, challenges, and sharpens your every response.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up-d3">
          <Link
            href="/interview/new"
            className="group px-8 py-4 bg-emerald-500 text-black rounded-full font-bold text-base transition-all duration-200 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            Start Practicing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <a
            href="#how-it-works"
            className="text-zinc-400 font-medium flex items-center gap-2 px-6 py-4 hover:text-white transition-colors duration-200"
          >
            <Play className="w-4 h-4" />
            See how it works
          </a>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 max-w-4xl mx-auto animate-fade-up-d4">
        <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-800/60">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs text-zinc-600 font-medium">
              Live Interview Session
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">
                Recording
              </span>
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-400 mb-1">
                  AI Interviewer
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  &ldquo;Walk me through how you&apos;d reverse a singly linked
                  list — what are the time and space complexities of your
                  approach?&rdquo;
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-zinc-400">Y</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 mb-1">You</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-end gap-0.5">
                    <div className="w-1 h-2.5 bg-zinc-600 rounded-full animate-sound-1" />
                    <div className="w-1 h-4 bg-zinc-600 rounded-full animate-sound-2" />
                    <div className="w-1 h-3 bg-zinc-600 rounded-full animate-sound-3" />
                    <div className="w-1 h-5 bg-zinc-600 rounded-full animate-sound-1" />
                    <div className="w-1 h-2.5 bg-zinc-600 rounded-full animate-sound-2" />
                  </div>
                  <span className="text-xs text-zinc-600">Speaking...</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-[#0d1117] border border-zinc-800/50 p-4 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <div className="text-zinc-600 mb-2 text-xs">// Your solution</div>
              <div>
                <span className="text-purple-400">public</span>{" "}
                <span className="text-emerald-400">ListNode</span>{" "}
                <span className="text-teal-300">reverseList</span>
                <span className="text-zinc-500">(</span>
                <span className="text-emerald-400">ListNode</span>{" "}
                <span className="text-orange-300">head</span>
                <span className="text-zinc-500">) {"{"}</span>
              </div>
              <div className="pl-4">
                <span className="text-emerald-400">ListNode</span>{" "}
                <span className="text-zinc-300">prev</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-orange-400">null</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div className="pl-4">
                <span className="text-emerald-400">ListNode</span>{" "}
                <span className="text-zinc-300">curr</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-zinc-300">head</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div className="pl-4">
                <span className="text-purple-400">while</span>{" "}
                <span className="text-zinc-500">(</span>
                <span className="text-zinc-300">curr</span>{" "}
                <span className="text-zinc-500">!=</span>{" "}
                <span className="text-orange-400">null</span>
                <span className="text-zinc-500">) {"{"}</span>
              </div>
              <div className="pl-8">
                <span className="text-emerald-400">ListNode</span>{" "}
                <span className="text-zinc-300">next</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-zinc-300">curr</span>
                <span className="text-zinc-500">.</span>
                <span className="text-zinc-300">next</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div className="pl-8">
                <span className="text-zinc-300">curr</span>
                <span className="text-zinc-500">.</span>
                <span className="text-zinc-300">next</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-zinc-300">prev</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div className="pl-8">
                <span className="text-zinc-300">prev</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-zinc-300">curr</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div className="pl-8">
                <span className="text-zinc-300">curr</span>{" "}
                <span className="text-zinc-500">=</span>{" "}
                <span className="text-zinc-300">next</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div className="pl-4">{"}"}</div>
              <div className="pl-4">
                <span className="text-purple-400">return</span>{" "}
                <span className="text-zinc-300">prev</span>
                <span className="text-zinc-500">;</span>
              </div>
              <div>{"}"}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-display">
              Three pillars. Zero compromises.
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Everything you need to walk into your next technical interview
              with unshakeable confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Mic className="w-5 h-5 text-emerald-400" />}
              title="Adaptive Voice AI"
              desc="An interviewer that listens, probes deeper, and pivots — just like a real technical conversation. No scripts, no templates."
              tag="Voice"
            />
            <FeatureCard
              icon={<Code2 className="w-5 h-5 text-teal-400" />}
              title="Live Code Environment"
              desc="Write, run, and debug in a professional editor while the AI evaluates your approach in real time. Monaco-powered."
              tag="Code"
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
              title="Precision Feedback"
              desc="Detailed breakdowns with actionable insights. Know exactly what to improve and how — every single time."
              tag="Analytics"
            />
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative z-10 py-24 sm:py-32 px-6 border-t border-zinc-800/40"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-display">
              From zero to offer-ready.
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg">
              Three steps. Five minutes. Unlimited improvement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <Step
              number="01"
              title="Pick Your Round"
              desc="Choose your target company, role, and difficulty level. We tailor every question to match."
            />
            <Step
              number="02"
              title="Interview Live"
              desc="Speak and code in real time with an AI interviewer that feels remarkably human. No second takes."
            />
            <Step
              number="03"
              title="Level Up"
              desc="Get a comprehensive performance report with specific areas to improve. Then come back stronger."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 border-y border-zinc-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="10K+" label="Interviews completed" />
            <Stat value="94%" label="Felt identical to real rounds" />
            <Stat value="3.2x" label="More likely to clear" />
            <Stat value="<5m" label="To start practicing" />
          </div>
        </div>
      </section>

      <section className="relative z-10 py-28 sm:py-36 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 font-display">
            Stop Preparing.
            <br />
            Start Practicing.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Your next offer is one conversation away. Make it count.
          </p>
          <Link
            href="/interview/new"
            className="group inline-flex items-center gap-2 px-10 py-5 bg-emerald-500 text-black rounded-full font-bold text-lg transition-all duration-200 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Start Your First Interview
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-zinc-800/40 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-500 font-display">
              Intervu AI
            </span>
          </div>
          <p className="text-xs text-zinc-700">
            &copy; 2026 Intervu AI. Built for engineers who refuse to wing it.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <div className="card-dark group">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-800/60 px-2.5 py-1 rounded-full border border-zinc-700/40">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2.5 font-display">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative">
      <span className="text-5xl sm:text-6xl font-extrabold text-zinc-800/60 font-display leading-none select-none">
        {number}
      </span>
      <h3 className="text-lg font-bold text-white mt-4 mb-2.5 font-display">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl sm:text-4xl font-extrabold text-gradient font-display mb-1.5">
        {value}
      </div>
      <div className="text-xs text-zinc-600 leading-snug">{label}</div>
    </div>
  );
}

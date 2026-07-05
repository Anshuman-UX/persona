import Link from 'next/link';
import { ArrowRight, Brain, Zap, Code2, GraduationCap, MessagesSquare, Lightbulb } from 'lucide-react';

const howItWorks = [
  {
    icon: GraduationCap,
    title: 'Pick a mentor',
    description: 'Choose between deep foundational learning or quick, pragmatic project building.',
    color: 'bg-pastel-yellow',
  },
  {
    icon: MessagesSquare,
    title: 'Ask anything',
    description: 'Share code, ask questions, and get real human-like explanations.',
    color: 'bg-pastel-blue',
  },
  {
    icon: Brain,
    title: 'AI remembers',
    description: 'Your mentor tracks your progress and builds upon your past struggles.',
    color: 'bg-pastel-green',
  }
];

const features = [
  {
    icon: Zap,
    title: 'Real-time Streaming',
    description: 'No waiting. Code and explanations stream in instantly, token by token.',
  },
  {
    icon: Zap,
    title: 'Persona-isolated Memory',
    description: 'Conversations are perfectly isolated so context is never confused.',
  },
  {
    icon: Code2,
    title: 'Full Markdown & Code Support',
    description: 'Beautifully formatted code blocks with syntax highlighting and copy support.',
  },
  {
    icon: Lightbulb,
    title: 'Multiple Teaching Styles',
    description: 'Switch personas to get the exact learning style that fits your current needs.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-black selection:text-white">
      
      {/* ─── Hero Section (Light) ───────────────────────── */}
      <section className="relative px-6 pt-8 pb-32 bg-white">
        {/* Nav inside hero for top-left alignment */}
        <nav className="flex items-center justify-between max-w-6xl mx-auto mb-24">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-black" strokeWidth={2.5} />
            <span className="font-heading font-bold text-black tracking-tight text-xl">Persona Tutor</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold text-white bg-black hover:bg-gray-800 px-6 py-3 rounded-full transition-colors flex items-center gap-2">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl">
            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-extrabold text-black tracking-tighter leading-[1.05] mb-6">
              Learn to code with<br/>AI mentors.
            </h1>
            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-xl">
              Get personalized explanations, code reviews, and mentorship on demand. Built for serious learners.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-lg transition-all group"
            >
              Start learning
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Simple line-art illustration placeholder */}
          <div className="hidden md:flex flex-1 justify-center relative">
            <div className="w-full aspect-square max-w-[400px] border-[3px] border-black rounded-[40px] flex items-center justify-center bg-white relative overflow-hidden shadow-[8px_8px_0_0_#000]">
               <svg className="w-full h-full opacity-10 absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M 0 20 L 100 20 M 0 40 L 100 40 M 0 60 L 100 60 M 0 80 L 100 80" stroke="black" strokeWidth="2" />
                 <path d="M 20 0 L 20 100 M 40 0 L 40 100 M 60 0 L 60 100 M 80 0 L 80 100" stroke="black" strokeWidth="2" />
               </svg>
               <Code2 className="relative z-10 h-32 w-32 text-black" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works (Light) ─────────────────────── */}
      <section className="py-32 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 block">How it works</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-black tracking-tight">
              Mentorship on demand.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className={`p-10 rounded-[32px] ${step.color}`}>
                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-16 shadow-sm">
                  <step.icon className="h-7 w-7 text-black" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-black mb-4">{step.title}</h3>
                <p className="text-gray-800 leading-relaxed font-medium text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section (Dark) ────────────────────── */}
      <section className="py-32 px-6 bg-bg-dark text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <span className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4 block">Capabilities</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight max-w-2xl">
              Everything you need to master programming.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0 h-16 w-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <f.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Closing CTA (Dark) ─────────────────────────── */}
      <section className="py-40 px-6 bg-bg-dark flex flex-col items-center justify-center text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-5xl sm:text-7xl font-extrabold text-white tracking-tighter mb-8 leading-tight">
            Stop struggling alone.<br/>Start learning faster.
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join today and get your first AI mentor session for free.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white hover:bg-gray-200 text-black font-bold text-xl transition-all group"
          >
            Get Started
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── Footer (Dark) ──────────────────────────────── */}
      <footer className="py-8 px-6 bg-bg-dark border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gray-400" />
            <span className="font-heading font-bold text-gray-400 text-lg">Persona Tutor</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Next.js & Supabase
          </p>
        </div>
      </footer>

    </div>
  );
}

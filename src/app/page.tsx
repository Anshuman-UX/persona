import Link from 'next/link';
import { ArrowRight, Brain, Zap, BookOpen, Users } from 'lucide-react';

const personas = [
  {
    id: 'hitesh',
    name: 'Hitesh Choudhary',
    initials: 'HC',
    tagline: 'Builds concepts from the ground up, zero to hero.',
    style: 'Structured & Foundational',
    color: 'from-violet-500/20 to-indigo-500/10',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  },
  {
    id: 'piyush',
    name: 'Piyush Garg',
    initials: 'PG',
    tagline: 'Cuts to the point with real-world, production-ready examples.',
    style: 'Pragmatic & Project-focused',
    color: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
];

const features = [
  {
    icon: Brain,
    title: 'Remembers Your Progress',
    description: 'Long-term memory across sessions. Your tutor knows what you\'ve struggled with and builds on it.',
    color: 'text-violet-400',
    glow: 'bg-violet-500/10',
  },
  {
    icon: Zap,
    title: 'Real-time Streaming',
    description: 'Responses stream token by token — no waiting, no buffering. Feels like a live conversation.',
    color: 'text-yellow-400',
    glow: 'bg-yellow-500/10',
  },
  {
    icon: BookOpen,
    title: 'Multiple Teaching Styles',
    description: 'Switch between foundational deep-dives or quick pragmatic takes depending on what you need.',
    color: 'text-cyan-400',
    glow: 'bg-cyan-500/10',
  },
  {
    icon: Users,
    title: 'Your Conversations, Private',
    description: 'Each session is fully isolated. Row-level security ensures your data is yours alone.',
    color: 'text-emerald-400',
    glow: 'bg-emerald-500/10',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0f] text-zinc-100 overflow-x-hidden">

      {/* ─── Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0c0c0f]/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
            P
          </div>
          <span className="font-semibold text-white tracking-tight">Persona Tutor</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block text-sm text-zinc-400 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide mb-8">
            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-pulse" />
            AI-powered mentorship
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 text-balance">
            Learn to code with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
              AI tutors who teach
            </span>
            {' '}like real mentors
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10 text-balance">
            Persona Tutor puts India's most beloved engineering educators into your browser.
            Ask questions, share code, get real explanations — not generic answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start learning for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 text-zinc-300 hover:text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Decorative bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </section>

      {/* ─── Persona Showcase ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Meet your tutors
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Each AI is carefully modelled after a real educator's teaching style, vocabulary, and approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {personas.map((p) => (
              <div
                key={p.id}
                className={`group relative p-8 rounded-2xl border ${p.border} bg-gradient-to-br ${p.color} backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 cursor-default`}
              >
                {/* Inner glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.02]" />

                <div className="relative flex items-start gap-5">
                  <div className={`flex-shrink-0 h-14 w-14 rounded-xl border ${p.border} bg-zinc-900/80 flex items-center justify-center font-extrabold text-xl text-white shadow-inner`}>
                    {p.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                    <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${p.badge} mb-3`}>
                      {p.style}
                    </span>
                    <p className="text-sm text-zinc-400 leading-relaxed">{p.tagline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Built for serious learners
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Every feature is designed to make your learning sessions more effective and productive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className={`h-10 w-10 rounded-lg ${f.glow} flex items-center justify-center mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative p-10 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 via-violet-600/5 to-transparent overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/15 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to learn differently?
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Create a free account and start your first session in under a minute.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/25 hover:-translate-y-0.5"
              >
                Get started — it's free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">P</div>
            <span className="text-sm text-zinc-500 font-medium">Persona Tutor</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Persona Tutor. Built with Next.js & Supabase.
          </p>
          <div className="flex items-center gap-5 text-xs text-zinc-600">
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-zinc-400 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}


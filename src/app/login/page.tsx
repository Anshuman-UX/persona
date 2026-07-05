'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/auth/actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5"
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#0c0c0f] flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      {/* Back to home */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-indigo-600/30">
              P
            </div>
            <span className="font-semibold text-white tracking-tight text-lg">Persona Tutor</span>
          </Link>
        </div>

        <h2 className="text-center text-2xl font-bold text-white tracking-tight mb-1">
          Welcome back
        </h2>
        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900/60 border border-white/[0.08] py-8 px-6 shadow-2xl shadow-black/40 rounded-2xl backdrop-blur-sm sm:px-10">
          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-zinc-950/80 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-colors duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-zinc-950/80 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="rounded-xl bg-red-950/40 border border-red-900/40 px-4 py-3">
                <p className="text-sm text-red-400">{state.error}</p>
              </div>
            )}

            <div className="pt-1">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


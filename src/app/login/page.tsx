'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/auth/actions';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3.5 px-4 rounded-full text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:-translate-y-0.5"
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-black selection:text-white">

      {/* Back to home */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <GraduationCap className="h-8 w-8 text-black" strokeWidth={2.5} />
            <span className="font-heading font-bold text-black tracking-tight text-2xl">Persona Tutor</span>
          </Link>
        </div>

        <h2 className="text-center text-3xl font-heading font-bold text-black tracking-tight mb-2">
          Welcome back
        </h2>
        <p className="text-center text-sm font-medium text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-black hover:underline transition-all">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-gray-200 py-10 px-8 shadow-xl rounded-[24px] sm:px-10">
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-colors duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm font-medium text-red-600">{state.error}</p>
              </div>
            )}

            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


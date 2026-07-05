import { PersonaSwitcher } from '@/components/sidebar/PersonaSwitcher';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // 1. Authenticate session server-side
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 overflow-y-auto">
      <div className="max-w-xl w-full text-center mb-8 mt-12 sm:mt-0 select-none">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Welcome to Persona Tutor
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
          Select one of the engineering mentors below to start a new learning session.
        </p>
      </div>

      <PersonaSwitcher />
    </div>
  );
}

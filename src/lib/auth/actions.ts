'use server';

import { createClient } from '@/lib/supabase/server';
import { upsertProfile as createProfile } from '@/lib/db/profiles';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (user) {
    try {
      // Explicitly create profile row using the profiles DAL helper
      await createProfile(user.id, user.email || email);
    } catch (profileErr: any) {
      console.error('[SIGNUP PROFILE CREATION ERROR]:', profileErr.message);
      // Trigger in DB might have already succeeded, so we don't fail user experience
    }
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function logoutAction() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

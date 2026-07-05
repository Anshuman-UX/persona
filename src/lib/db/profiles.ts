import { createClient } from '@/lib/supabase/server';

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
  return data;
}

export async function upsertProfile(userId: string, email: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, email });

  if (error) {
    throw new Error(`Failed to upsert profile: ${error.message}`);
  }
}

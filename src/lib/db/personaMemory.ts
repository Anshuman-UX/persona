import { createClient } from '@/lib/supabase/server';
import { PersonaMemory } from '@/types';

export async function getPersonaMemory(userId: string, personaId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('persona_memory')
    .select('summary')
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch persona memory: ${error.message}`);
  }
  return data ? data.summary : null;
}

export async function upsertPersonaMemory(userId: string, personaId: string, summary: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('persona_memory')
    .upsert(
      { user_id: userId, persona_id: personaId, summary, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,persona_id' }
    );

  if (error) {
    throw new Error(`Failed to upsert persona memory: ${error.message}`);
  }
}

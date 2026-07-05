import { createClient } from '@/lib/supabase/server';
import { Conversation } from '@/types';

export async function createConversation(userId: string, personaId: string, title: string): Promise<Conversation> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, persona_id: personaId, title })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }
  return data as Conversation;
}

export async function getConversationsByUser(userId: string): Promise<Conversation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }
  return data as Conversation[];
}

export async function getConversationById(conversationId: string): Promise<Conversation | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch conversation: ${error.message}`);
  }
  return data as Conversation | null;
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<Conversation> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update conversation title: ${error.message}`);
  }
  return data as Conversation;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) {
    throw new Error(`Failed to delete conversation: ${error.message}`);
  }
}

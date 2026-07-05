import { createClient } from '@/lib/supabase/server';
import { Message } from '@/types';

export async function saveMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, user_id: userId, role, content })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }
  return data as Message;
}

export async function getRecentMessages(conversationId: string, limit: number = 20): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true }) // chronological order for LLM context
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent messages: ${error.message}`);
  }
  return data as Message[];
}

export async function getMessageCount(conversationId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId);

  if (error) {
    throw new Error(`Failed to fetch message count: ${error.message}`);
  }
  return count || 0;
}

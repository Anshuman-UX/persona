import { getConversationById } from '@/lib/db/conversations';
import { getRecentMessages } from '@/lib/db/messages';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getPersonaById } from '@/lib/persona/loader';
import ChatClientWrapper from './ChatClientWrapper';

interface PageProps {
  params: {
    conversationId: string;
  };
}

export default async function ConversationPage({ params }: PageProps) {
  // 1. Authenticate user
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { conversationId } = params;

  // 2. Fetch conversation details to verify ownership and persona
  const conversation = await getConversationById(conversationId);
  
  if (!conversation) {
    redirect('/dashboard');
  }

  if (conversation.user_id !== user.id) {
    redirect('/dashboard');
  }

  // 3. Fetch recent history from database
  const initialMessages = await getRecentMessages(conversationId, 20);

  // 4. Load static tutor config
  const persona = getPersonaById(conversation.persona_id);

  return (
    <ChatClientWrapper
      conversationId={conversationId}
      persona={persona}
      initialMessages={initialMessages}
    />
  );
}

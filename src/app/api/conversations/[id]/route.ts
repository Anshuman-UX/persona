import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getConversationById, deleteConversation } from '@/lib/db/conversations';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify user is authenticated
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const conversationId = params.id;
    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversation ID' }, { status: 400 });
    }

    // 2. Fetch the conversation and check ownership
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this conversation' }, { status: 403 });
    }

    // 3. Delete the conversation (cascades message deletion)
    await deleteConversation(conversationId);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('[CONVERSATION DELETE ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

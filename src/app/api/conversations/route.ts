import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { createConversation, getConversationsByUser } from '@/lib/db/conversations';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[CONVERSATIONS GET] Supabase error (FULL):', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err: any) {
    console.error('[CONVERSATIONS GET ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { personaId, title } = body;



    if (!personaId || (personaId !== 'hitesh' && personaId !== 'piyush')) {
      return NextResponse.json({ error: 'Invalid or missing personaId' }, { status: 400 });
    }

    const conversationTitle = title && typeof title === 'string' && title.trim() !== ''
      ? title.trim()
      : `New chat with ${personaId === 'hitesh' ? 'Hitesh' : 'Piyush'}`;

    // Use service client to bypass RLS — needed until migrations/RLS are confirmed applied.
    const serviceClient = createServiceClient();

    // Ensure the profile row exists (may be missing if the DB trigger didn't fire on signup)
    await serviceClient
      .from('profiles')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });

    const { data, error: insertError } = await serviceClient
      .from('conversations')
      .insert({ user_id: user.id, persona_id: personaId, title: conversationTitle })
      .select()
      .single();

    if (insertError) {
      console.error('[CONVERSATIONS POST] Supabase insert error (FULL):', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: insertError.message, code: insertError.code, details: insertError.details, hint: insertError.hint },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (err: any) {
    console.error('[CONVERSATIONS POST ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

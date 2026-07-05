import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPersonaById } from '@/lib/persona/loader';
import { getRecentMessages, saveMessage, getMessageCount } from '@/lib/db/messages';
import { getPersonaMemory, upsertPersonaMemory } from '@/lib/db/personaMemory';
import { chat } from '@/lib/llm/chatEngine';
import { summarizeMemory } from '@/lib/llm/summarizer';
import { PromptContext } from '@/types';

// Helper to trigger summarization in the background
async function triggerSummarizer(conversationId: string, userId: string, personaId: string) {
  try {
    const count = await getMessageCount(conversationId);
    // Trigger memory summarization after every 10 messages (e.g. 10, 20, 30...)
    if (count > 0 && count % 10 === 0) {
      const history = await getRecentMessages(conversationId, 20);
      const existingSummary = await getPersonaMemory(userId, personaId);
      const newSummary = await summarizeMemory(history, existingSummary, personaId);
      await upsertPersonaMemory(userId, personaId, newSummary);
    }
  } catch (err) {
    console.error('[SUMMARIZER ERROR]:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2. Accept and validate request body
    const body = await req.json().catch(() => ({}));
    const { conversationId, personaId, message } = body;

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing conversationId' }, { status: 400 });
    }

    if (!personaId || (personaId !== 'hitesh' && personaId !== 'piyush')) {
      return NextResponse.json({ error: 'Invalid or missing personaId' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // 3. Load Persona config (throws if invalid)
    let personaConfig;
    try {
      personaConfig = getPersonaById(personaId);
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Invalid Persona' }, { status: 400 });
    }

    // 4. Fetch context: history (last 20 messages) and memory summary
    let recentHistory = [];
    let memorySummary = null;
    try {
      recentHistory = await getRecentMessages(conversationId, 20);
      memorySummary = await getPersonaMemory(user.id, personaId);
    } catch (err: any) {
      return NextResponse.json({ error: `Database fetch failed: ${err.message}` }, { status: 500 });
    }

    // 5. Construct Prompt Context
    const context: PromptContext = {
      personaConfig,
      memorySummary,
      recentHistory,
      userMessage: message.trim()
    };

    // 6. Call the streaming AI engine
    const chatEngineStream = await chat(context);

    // 7. Create a ReadableStream to stream tokens back and save history on complete
    const responseStream = new ReadableStream({
      async start(controller) {
        let assistantResponse = '';
        try {
          for await (const chunk of chatEngineStream) {
            assistantResponse += chunk;
            controller.enqueue(new TextEncoder().encode(chunk));
          }

          controller.close();

          // After stream completes, save both messages to the database
          try {
            await saveMessage(conversationId, user.id, 'user', message.trim());
            await saveMessage(conversationId, user.id, 'assistant', assistantResponse);
            
            // Trigger summarization check (non-blocking)
            triggerSummarizer(conversationId, user.id, personaId);
          } catch (dbErr: any) {
            console.error('[CHAT ROUTE DB ERROR]: Failed to save history:', dbErr);
          }

        } catch (streamErr: any) {
          console.error('[STREAM ERROR] Full error object:', JSON.stringify(streamErr, Object.getOwnPropertyNames(streamErr), 2));
          console.error('[STREAM ERROR] Stack:', streamErr.stack);
          controller.error(streamErr);
        }
      }
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (err: any) {
    console.error('[CHAT ROUTE FATAL ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

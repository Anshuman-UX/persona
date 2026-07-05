'use client';

import { useChat } from '@/hooks/useChat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageInput } from '@/components/chat/MessageInput';
import { PersonaConfig, Message } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ChatClientWrapperProps {
  conversationId: string;
  persona: PersonaConfig;
  initialMessages: Message[];
}

export default function ChatClientWrapper({
  conversationId,
  persona,
  initialMessages,
}: ChatClientWrapperProps) {
  const { messages, sendMessage, isStreaming } = useChat(
    conversationId,
    persona.metadata.id,
    initialMessages
  );

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800/80 shadow-sm z-10">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition duration-150 ease-in-out"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
            {persona.metadata.name}
          </h1>
          <p className="text-xs text-slate-500">
            Interactive Teaching Session &bull; v{persona.metadata.version}
          </p>
        </div>
      </header>

      {/* Main chat log viewport */}
      <ChatWindow
        messages={messages}
        persona={persona}
        isStreaming={isStreaming}
        onRetry={handleRetry}
      />

      {/* Input area */}
      <MessageInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}

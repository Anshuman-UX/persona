'use client';

import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { PersonaConfig } from '@/types';

interface ChatWindowProps {
  messages: Array<{
    id?: string;
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
  }>;
  persona?: PersonaConfig;
  isStreaming: boolean;
  onRetry?: () => void;
}

export function ChatWindow({ messages, persona, isStreaming, onRetry }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll helper
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when messages list updates or streaming starts/stops
  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 bg-bg-surface flex flex-col custom-scrollbar"
    >
      <div className="flex-1 flex flex-col justify-end max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-6 mt-4">
            <MessageBubble
              role="assistant"
              content={`Hello! I'm ${persona?.metadata.name || 'your Tutor'}. Start your learning session by asking questions, sharing stack traces, or requesting code examples.`}
              persona={persona}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id || index}
                role={msg.role}
                content={msg.content}
                persona={persona}
                isError={msg.isError}
                onRetry={onRetry}
              />
            ))}
          </div>
        )}

        {/* Streaming/Typing indicator bubble */}
        {isStreaming && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex w-full gap-3 py-4 justify-start mt-6">
            <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-black font-heading font-extrabold shadow-sm">
              {persona?.metadata.name.charAt(0) || 'P'}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-gray-500 ml-1">{persona?.metadata.name || 'Assistant'}</div>
              <div className="flex gap-1.5 items-center bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 text-black">
                <span className="h-2 w-2 bg-black rounded-full animate-pulse delay-100" />
                <span className="h-2 w-2 bg-black rounded-full animate-pulse delay-200" />
                <span className="h-2 w-2 bg-black rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}

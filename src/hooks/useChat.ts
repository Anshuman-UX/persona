import { useState } from 'react';
import { Message } from '@/types';

export function useChat(conversationId: string, personaId: string, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Array<{
    id?: string;
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
  }>>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const trimmedContent = content.trim();

    // 1. Append user message to state
    const userMsg = { role: 'user' as const, content: trimmedContent };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // 2. Append an empty assistant response placeholder
    const assistantPlaceholder = { role: 'assistant' as const, content: '' };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          personaId,
          message: trimmedContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status} error`);
      }

      if (!response.body) {
        throw new Error('Server returned empty response stream.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      // 3. Consume stream chunk by chunk
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        accumulatedContent += textChunk;

        // Pipe chunk directly into the last assistant message
        setMessages((prev) => {
          const nextMessages = [...prev];
          if (nextMessages.length > 0) {
            nextMessages[nextMessages.length - 1] = {
              role: 'assistant',
              content: accumulatedContent,
            };
          }
          return nextMessages;
        });
      }
    } catch (err: any) {
      console.error('[STREAM FAILED]:', err);
      // Mark assistant bubble as errored
      setMessages((prev) => {
        const nextMessages = [...prev];
        if (nextMessages.length > 0) {
          nextMessages[nextMessages.length - 1] = {
            role: 'assistant',
            content: `Response failed. ${err.message || err}`,
            isError: true,
          };
        }
        return nextMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    messages,
    sendMessage,
    isStreaming,
  };
}

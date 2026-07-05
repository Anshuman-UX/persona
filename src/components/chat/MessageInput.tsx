'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically adjust height as content expands
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSend(trimmedInput);
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter, but allow Shift+Enter for newlines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-bg-surface border-t border-gray-200">
      <div className="relative flex-1 flex items-end bg-white rounded-[24px] border border-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition duration-150 ease-in-out shadow-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Tutor is thinking...' : 'Ask a question or share code...'}
          disabled={disabled}
          rows={1}
          className="w-full pl-5 pr-14 py-4 max-h-[200px] resize-none outline-none bg-transparent text-black placeholder-gray-400 text-sm font-sans leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled || !input.trim()}
          className="absolute right-2 bottom-2 flex items-center justify-center h-10 w-10 rounded-full bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-50 transition duration-150 ease-in-out"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

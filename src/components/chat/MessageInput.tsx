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
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-slate-900 border-t border-slate-800/80">
      <div className="relative flex-1 flex items-end bg-slate-950 rounded-xl border border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition duration-150 ease-in-out">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Tutor is thinking...' : 'Ask a question or share code...'}
          disabled={disabled}
          rows={1}
          className="w-full pl-4 pr-12 py-3.5 max-h-[200px] resize-none outline-none bg-transparent text-white placeholder-slate-500 text-sm font-sans leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled || !input.trim()}
          className="absolute right-2 bottom-2 flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-50 transition duration-150 ease-in-out"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

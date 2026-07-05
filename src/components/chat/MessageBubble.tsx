'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { PersonaConfig } from '@/types';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  persona?: PersonaConfig;
  isError?: boolean;
  onRetry?: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition duration-150 ease-in-out border border-slate-800"
      title="Copy code to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span className="text-[11px]">Copy</span>
        </>
      )}
    </button>
  );
}

export function MessageBubble({ role, content, persona, isError, onRetry }: MessageBubbleProps) {
  const isUser = role === 'user';
  
  // Custom markdown rendering components
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      // Multi-line code block with syntax highlighting
      if (!inline && (match || codeString.includes('\n'))) {
        const language = match ? match[1] : 'text';
        return (
          <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-800/80 shadow-md">
            <div className="flex justify-between items-center bg-slate-950 px-4 py-1.5 text-xs text-slate-400 font-mono border-b border-slate-800/85">
              <span>{language}</span>
              <CopyButton text={codeString} />
            </div>
            <div className="text-sm">
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  background: '#090d16',
                  padding: '1.25rem',
                  fontSize: '0.875rem',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      // Inline code
      return (
        <code
          {...props}
          className="bg-slate-950/80 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-sm border border-slate-800/50"
        >
          {children}
        </code>
      );
    },
    // Restyle other markdown tags for dark theme chat bubbles
    p({ children }: any) {
      return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
    },
    li({ children }: any) {
      return <li className="leading-relaxed">{children}</li>;
    },
    h1({ children }: any) {
      return <h1 className="text-xl font-bold mt-4 mb-2 text-white border-b border-slate-800 pb-1">{children}</h1>;
    },
    h2({ children }: any) {
      return <h2 className="text-lg font-bold mt-4 mb-2 text-white">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-md font-semibold mt-3 mb-1 text-slate-200">{children}</h3>;
    },
    blockquote({ children }: any) {
      return <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-3 bg-indigo-950/20 text-slate-300 italic rounded-r-lg">{children}</blockquote>;
    },
  };

  return (
    <div className={`flex w-full gap-3 py-4 ${isUser ? 'justify-end' : 'justify-start'} border-b border-slate-900/50`}>
      {/* Tutor Avatar (only for assistant) */}
      {!isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
          {persona?.metadata.name.charAt(0) || 'P'}
        </div>
      )}

      {/* Bubble Content Wrapper */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] gap-1">
        {/* Sender Name */}
        <div className={`text-xs text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : (persona?.metadata.name || 'Assistant')}
        </div>

        {/* Message Bubble itself */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-sm text-sm border ${
            isUser
              ? 'bg-indigo-600 text-white border-indigo-500'
              : isError
              ? 'bg-red-950/30 text-red-200 border-red-900/40'
              : 'bg-slate-900/45 text-slate-200 border-slate-800/80'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          )}

          {isError && onRetry && (
            <div className="mt-4 flex justify-start">
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 transition-colors text-xs font-medium border border-red-900/50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar (only for user) */}
      {isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
          U
        </div>
      )}
    </div>
  );
}

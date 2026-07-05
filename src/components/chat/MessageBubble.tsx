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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition duration-150 ease-in-out border border-white/10"
      title="Copy code to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Copy</span>
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
          <div className="relative group my-4 rounded-xl overflow-hidden border border-bg-dark shadow-md bg-bg-dark text-white">
            <div className="flex justify-between items-center bg-black px-4 py-2 text-xs text-gray-400 font-mono border-b border-gray-800">
              <span className="uppercase tracking-widest font-bold">{language}</span>
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
          className="bg-gray-100 px-1.5 py-0.5 rounded text-black font-mono text-sm border border-gray-200"
        >
          {children}
        </code>
      );
    },
    // Restyle other markdown tags for light theme chat bubbles
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
      return <h1 className="text-xl font-heading font-bold mt-5 mb-3 text-black border-b border-gray-200 pb-2">{children}</h1>;
    },
    h2({ children }: any) {
      return <h2 className="text-lg font-heading font-bold mt-4 mb-2 text-black">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-md font-heading font-bold mt-3 mb-1 text-gray-800">{children}</h3>;
    },
    blockquote({ children }: any) {
      return <blockquote className="border-l-[3px] border-black pl-4 py-1 my-3 bg-gray-50 text-gray-600 italic rounded-r-lg">{children}</blockquote>;
    },
  };

  return (
    <div className={`flex w-full gap-3 py-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Tutor Avatar (only for assistant) */}
      {!isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-black font-heading font-extrabold shadow-sm mt-5">
          {persona?.metadata.name.charAt(0) || 'P'}
        </div>
      )}

      {/* Bubble Content Wrapper */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] gap-1">
        {/* Sender Name */}
        <div className={`text-xs font-bold text-gray-500 ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
          {isUser ? 'You' : (persona?.metadata.name || 'Assistant')}
        </div>

        {/* Message Bubble itself */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-sm text-sm border ${
            isUser
              ? 'bg-gray-100 text-black border-transparent'
              : isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-white text-black border-gray-200'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors text-xs font-bold border border-red-200"
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
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-heading font-extrabold shadow-sm mt-5">
          U
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { personas } from '@/personas';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PersonaSwitcher() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('hitesh');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedPersonaId');
    if (saved && (saved === 'hitesh' || saved === 'piyush')) {
      setSelectedId(saved);
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem('selectedPersonaId', id);
  };

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaId: selectedId,
          title: `Chat with ${selectedId === 'hitesh' ? 'Hitesh' : 'Piyush'}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create conversation');
      }

      const conversation = await res.json();
      
      // Dispatch a custom event to notify Sidebar of updates
      window.dispatchEvent(new Event('conversation-created'));
      
      router.push(`/dashboard/chat/${conversation.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not start a new chat session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 text-center tracking-tight flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        Select a Mentor
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {Object.entries(personas).map(([id, persona]) => {
          const isSelected = selectedId === id;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`flex flex-col items-center p-5 rounded-xl border text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/5'
                  : 'bg-slate-950/40 border-slate-800/85 hover:border-slate-700/80'
              }`}
            >
              <div className="h-14 w-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-extrabold text-xl mb-3 shadow-inner">
                {persona.metadata.name.charAt(0)}
              </div>
              <h3 className="font-bold text-white text-base">
                {persona.metadata.name}
              </h3>
              <p className="text-[11px] text-indigo-300 mt-1 font-mono uppercase tracking-wider">
                {persona.identity.role.join(' & ')}
              </p>
              <p className="text-xs text-slate-500 mt-2 px-2 leading-relaxed">
                {persona.metadata.description}
              </p>
            </button>
          );
        })}
      </div>
      <button
        onClick={handleStartChat}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-lg shadow-indigo-600/15"
      >
        <MessageSquare className="h-4.5 w-4.5" />
        {loading ? 'Creating session...' : 'Start a New Chat'}
      </button>
    </div>
  );
}

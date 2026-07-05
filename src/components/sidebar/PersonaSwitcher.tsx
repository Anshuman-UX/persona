'use client';

import React, { useState, useEffect } from 'react';
import { personas } from '@/personas';
import { MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PersonaSwitcher() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('');
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
    <div className="max-w-xl w-full mx-auto p-10 bg-white rounded-[32px] border border-gray-200 shadow-xl">
      <h2 className="text-3xl font-heading font-black text-black mb-10 text-center tracking-tight flex items-center justify-center gap-2">
        <Sparkles className="h-6 w-6 text-black" />
        Select a Mentor
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {Object.entries(personas).map(([id, persona]) => {
          const isSelected = selectedId === id;
          const pastelColor = id === 'hitesh' ? 'bg-pastel-yellow' : 'bg-pastel-blue';
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`relative flex flex-col items-center p-6 rounded-3xl border-2 text-center transition-all duration-300 ease-out ${
                isSelected
                  ? `${pastelColor} border-black shadow-md scale-[1.02]`
                  : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-black">
                  <CheckCircle2 className="h-6 w-6 fill-black text-white" />
                </div>
              )}
              <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-black font-heading font-extrabold text-2xl mb-4 shadow-sm">
                {persona.metadata.name.charAt(0)}
              </div>
              <h3 className="font-heading font-bold text-black text-xl mb-3">
                {persona.metadata.name}
              </h3>
              <div className="bg-black/5 px-3 py-1 rounded-full mb-3 border border-black/10">
                <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">
                  {persona.identity.role[0] || 'Mentor'}
                </p>
              </div>
              <p className="text-sm text-gray-600 px-1 leading-relaxed font-medium line-clamp-3">
                {persona.metadata.description}
              </p>
            </button>
          );
        })}
      </div>
      <button
        onClick={handleStartChat}
        disabled={loading || !selectedId}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 mt-2 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-lg"
      >
        <MessageSquare className="h-5 w-5" />
        {loading ? 'Creating session...' : 'Start a New Chat'}
      </button>
    </div>
  );
}

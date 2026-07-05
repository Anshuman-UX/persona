'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/lib/auth/actions';
import { MessageSquare, Plus, Trash2, LogOut, Menu, X } from 'lucide-react';
import { Conversation } from '@/types';

function formatRelativeTime(dateString: string) {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'Just now';
    
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  } catch {
    return '';
  }
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setError(null);
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      } else {
        throw new Error('Failed to load conversations');
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Could not load chats.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Listen for custom events to refresh list
    window.addEventListener('conversation-created', fetchConversations);
    return () => {
      window.removeEventListener('conversation-created', fetchConversations);
    };
  }, []);

  const handleNewChat = async () => {
    setLoading(true);
    try {
      const savedPersona = localStorage.getItem('selectedPersonaId') || 'hitesh';
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaId: savedPersona,
          title: `Chat with ${savedPersona === 'hitesh' ? 'Hitesh' : 'Piyush'}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create conversation');
      }

      const newConv = await res.json();
      setConversations(prev => [newConv, ...prev]);
      setIsMobileOpen(false);
      router.push(`/dashboard/chat/${newConv.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not start new conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation? This will delete all messages.')) {
      return;
    }

    // Optimistic Update
    const originalConversations = [...conversations];
    setConversations(prev => prev.filter(c => c.id !== id));

    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      // If the currently active chat is deleted, redirect to dashboard root
      if (pathname.includes(`/dashboard/chat/${id}`)) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Could not delete conversation.');
      setConversations(originalConversations);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logoutAction();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800/80 text-slate-200">
      {/* Top Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
            P
          </div>
          <span className="font-bold text-white text-base tracking-wide">
            Persona Tutor
          </span>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
          className="sm:hidden p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition duration-150 ease-in-out disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {loading ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1.5 custom-scrollbar">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 tracking-wider">
          History
        </div>
        {isInitialLoading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 px-2 py-3 rounded-lg bg-slate-800/40">
                <div className="h-4 w-4 rounded bg-slate-700/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-700/50 rounded w-3/4" />
                  <div className="h-2 bg-slate-700/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-3 py-4 mx-2 mt-2 bg-red-950/30 border border-red-900/50 rounded-lg text-center">
            <p className="text-xs text-red-400 mb-2">{error}</p>
            <button
              onClick={fetchConversations}
              className="text-xs px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-8 text-center flex flex-col items-center">
             <MessageSquare className="h-8 w-8 text-slate-700 mb-3" />
             <p className="text-sm font-medium text-slate-400 mb-1">Start your first chat</p>
             <p className="text-xs text-slate-500">Conversations will appear here</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = pathname.endsWith(`/chat/${conv.id}`);
            const mentorName = conv.persona_id === 'hitesh' ? 'Hitesh' : 'Piyush';
            
            return (
              <Link
                key={conv.id}
                href={`/dashboard/chat/${conv.id}`}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <MessageSquare className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  <div className="truncate">
                    <div className="truncate text-slate-200 font-medium">{conv.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {mentorName} &bull; {formatRelativeTime(conv.created_at)}
                    </div>
                  </div>
                </div>
                
                {/* Trash delete button */}
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  aria-label="Delete Conversation"
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-slate-700 hover:text-red-400 transition-all duration-150 flex-shrink-0"
                  title="Delete Conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </Link>
            );
          })
        )}
      </div>

      {/* Bottom Logout actions */}
      <div className="p-4 border-t border-slate-850">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition duration-150 ease-in-out text-sm"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Bar */}
      <div className="sm:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shadow-md text-slate-400 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden sm:block w-72 h-screen flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobileOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex">
          {/* Backdrop mask */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          {/* Slide-out drawer panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl z-55">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

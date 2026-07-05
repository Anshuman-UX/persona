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
    <div className="flex flex-col h-full bg-bg-surface border-r border-gray-200 text-gray-900">
      {/* Top Brand Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
          <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center text-white font-heading font-extrabold text-sm">
            P
          </div>
          <span className="font-heading font-bold text-black text-lg tracking-tight">
            Persona Tutor
          </span>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
          className="sm:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-5 pt-8 border-b border-gray-200/60 pb-8">
        <button
          onClick={handleNewChat}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm transition duration-150 ease-in-out disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {loading ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar pt-6 pb-4">
        <div className="px-3 py-2 text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">
          History
        </div>
        {isInitialLoading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 px-2 py-3 rounded-lg bg-gray-100">
                <div className="h-4 w-4 rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-3 py-4 mx-2 mt-2 bg-red-50 border border-red-100 rounded-xl text-center">
            <p className="text-xs font-medium text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchConversations}
              className="text-xs px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-8 text-center flex flex-col items-center">
             <MessageSquare className="h-8 w-8 text-gray-300 mb-3" />
             <p className="text-sm font-bold text-gray-400 mb-1">Start your first chat</p>
             <p className="text-xs text-gray-400">Conversations will appear here</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = pathname.endsWith(`/chat/${conv.id}`);
            const mentorName = conv.persona_id === 'hitesh' ? 'Hitesh' : 'Piyush';
            const dotColor = conv.persona_id === 'hitesh' ? 'bg-yellow-400' : 'bg-blue-400';
            
            return (
              <Link
                key={conv.id}
                href={`/dashboard/chat/${conv.id}`}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white shadow-md border border-gray-200 text-black font-bold scale-[1.02]'
                    : 'hover:bg-white/60 text-gray-500 hover:text-black border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${dotColor} flex-shrink-0 shadow-sm`} />
                  <div className="truncate">
                    <div className="truncate text-gray-900 font-bold">{conv.title}</div>
                    <div className="text-[11px] font-medium text-gray-400 mt-1">
                      {formatRelativeTime(conv.created_at)}
                    </div>
                  </div>
                </div>
                
                {/* Trash delete button */}
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  aria-label="Delete Conversation"
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-gray-100 hover:text-red-600 transition-all duration-150 flex-shrink-0"
                  title="Delete Conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Link>
            );
          })
        )}
      </div>

      {/* Bottom Logout actions */}
      <div className="p-5 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-full hover:bg-gray-100 text-gray-600 hover:text-black font-bold transition duration-150 ease-in-out text-sm"
        >
          <LogOut className="h-4 w-4" />
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
          className="p-2.5 rounded-full bg-white border border-gray-200 shadow-md text-gray-500 hover:text-black"
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />
          {/* Slide-out drawer panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-bg-surface shadow-2xl z-55">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

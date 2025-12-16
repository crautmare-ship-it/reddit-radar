'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";

interface Lead {
  id: string;
  title: string;
  body?: string;
  subreddit: string;
  url: string;
  score: number;
  author: string;
  created: number;
  numComments: number;
}

interface GeneratedReply {
  reply: string;
  tone: string;
  tips: string[];
  aiConfigured: boolean;
}

// Format relative time
function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

// Parse Reddit URL to extract post info
function parseRedditUrl(url: string): { subreddit: string; postId: string } | null {
  const patterns = [
    /reddit\.com\/r\/([^/]+)\/comments\/([^/]+)/,
    /redd\.it\/([^/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      if (pattern.source.includes('redd.it')) {
        return { subreddit: 'unknown', postId: match[1] };
      }
      return { subreddit: match[1], postId: match[2] };
    }
  }
  return null;
}

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [message, setMessage] = useState('');
  const [source, setSource] = useState<'reddit' | 'mock'>('mock');
  
  // Reply modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatingReply, setGeneratingReply] = useState(false);
  const [generatedReply, setGeneratedReply] = useState<GeneratedReply | null>(null);
  const [replyError, setReplyError] = useState('');
  const [copied, setCopied] = useState(false);

  // Manual import state
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importTitle, setImportTitle] = useState('');
  const [importBody, setImportBody] = useState('');
  const [importError, setImportError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadLeads();
    }
  }, [isLoaded, isSignedIn]);

  // Redirect to sign-in if not authenticated
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#86868b]">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const loadLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      
      setLeads(data.leads || []);
      setConfigured(data.configured !== false);
      setMessage(data.message || '');
      setSource(data.source || 'mock');
    } catch (error) {
      console.error('Failed to load leads:', error);
      setMessage('Error loading leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateReply = async (lead: Lead) => {
    setSelectedLead(lead);
    setGeneratingReply(true);
    setGeneratedReply(null);
    setReplyError('');
    setCopied(false);

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postTitle: lead.title,
          postBody: lead.body || '',
          subreddit: lead.subreddit,
          postUrl: lead.url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reply');
      }

      setGeneratedReply(data);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : 'Failed to generate reply');
    } finally {
      setGeneratingReply(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedReply?.reply) {
      await navigator.clipboard.writeText(generatedReply.reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeModal = () => {
    setSelectedLead(null);
    setGeneratedReply(null);
    setReplyError('');
  };

  const handleImportUrl = (url: string) => {
    setImportUrl(url);
    setImportError('');
    
    const parsed = parseRedditUrl(url);
    if (url && !parsed) {
      setImportError('Invalid Reddit URL. Please paste a link to a Reddit post.');
    }
  };

  const importLead = () => {
    if (!importUrl || !importTitle) {
      setImportError('URL and title are required');
      return;
    }
    
    const parsed = parseRedditUrl(importUrl);
    if (!parsed) {
      setImportError('Invalid Reddit URL');
      return;
    }
    
    const newLead: Lead = {
      id: `import_${Date.now()}`,
      title: importTitle,
      body: importBody,
      subreddit: parsed.subreddit,
      url: importUrl,
      score: 0,
      author: 'imported',
      created: Date.now(),
      numComments: 0,
    };
    
    setLeads([newLead, ...leads]);
    setShowImport(false);
    setImportUrl('');
    setImportTitle('');
    setImportBody('');
    setImportError('');
  };

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors">
      <div className="mx-auto max-w-[980px] px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-fade-in-up">
            <h1 className="text-[32px] font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[40px]">
              Dashboard
            </h1>
            <p className="mt-2 text-[17px] text-[#86868b]">
              {loading ? 'Searching Reddit...' : `${leads.length} leads found`}
            </p>
          </div>
          
          <div className="animate-fade-in-up animate-delay-100 flex items-center gap-3">
            {/* Data Source Badge */}
            {!loading && configured && (
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium ${
                source === 'reddit' 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${source === 'reddit' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${source === 'reddit' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                </span>
                {source === 'reddit' ? 'Live' : 'Demo'}
              </span>
            )}
            
            <button
              onClick={() => setShowImport(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 text-[13px] font-medium text-[var(--foreground)] backdrop-blur-xl transition-all hover:bg-white hover:shadow-sm active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Import
            </button>
            
            <button
              onClick={loadLeads}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-[13px] font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Not Configured State */}
        {!loading && !configured && (
          <div className="card-apple animate-fade-in-up p-10 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mb-3 text-[21px] font-semibold text-[var(--foreground)]">No keywords configured</h2>
            <p className="mx-auto mb-8 max-w-md text-[15px] text-[#86868b]">
              {message || 'Set up your keywords and subreddits to start discovering leads on Reddit.'}
            </p>
            <Link
              href="/settings"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--foreground)] px-6 text-[15px] font-medium text-[var(--background)] transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              Configure Keywords
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`card-apple animate-fade-in-up p-6`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-4 h-5 w-3/4 rounded-lg bg-[var(--foreground)]/5"></div>
                <div className="mb-5 h-4 w-1/2 rounded-lg bg-[var(--foreground)]/5"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-20 rounded-lg bg-[var(--foreground)]/5"></div>
                  <div className="h-4 w-24 rounded-lg bg-[var(--foreground)]/5"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && configured && leads.length === 0 && (
          <div className="card-apple animate-fade-in-up p-10 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--foreground)]/5">
              <svg className="h-7 w-7 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="mb-3 text-[21px] font-semibold text-[var(--foreground)]">No leads found</h2>
            <p className="mx-auto mb-6 max-w-md text-[15px] text-[#86868b]">
              No Reddit posts match your keywords right now. Try adding more problem keywords, competitor names, or subreddits to discover more leads.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/settings"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-[14px] font-medium text-[var(--background)] transition-all hover:opacity-90"
              >
                Adjust Keywords
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <button
                onClick={loadLeads}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--foreground)]/5 px-5 text-[14px] font-medium text-[var(--foreground)] transition-all hover:bg-[var(--foreground)]/10"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Leads List */}
        {!loading && leads.length > 0 && (
          <div className="space-y-4">
            {leads.map((lead, index) => (
              <div
                key={lead.id}
                className="card-apple animate-fade-in-up group p-6"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="text-[17px] font-semibold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {lead.title}
                  </h2>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 px-3 py-1.5 text-[13px] font-semibold text-orange-600 dark:text-orange-400">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {lead.score}
                  </span>
                </div>
                
                {/* Body Preview */}
                {lead.body && (
                  <p className="mb-4 line-clamp-2 text-[15px] leading-relaxed text-[#86868b]">
                    {lead.body}
                  </p>
                )}
                
                {/* Meta */}
                <div className="mb-5 flex flex-wrap items-center gap-4 text-[13px] text-[#86868b]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)]/5 px-3 py-1">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
                    </svg>
                    r/{lead.subreddit}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {lead.numComments}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeAgo(lead.created)}
                  </span>
                  <span className="text-[#86868b]/60">u/{lead.author}</span>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--foreground)] px-4 text-[13px] font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Open on Reddit
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={() => generateReply(lead)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 text-[13px] font-medium text-orange-600 transition-all hover:bg-orange-500/20 active:scale-[0.98] dark:text-orange-400"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        {!loading && configured && source === 'mock' && (
          <div className="mt-8 card-apple animate-fade-in-up animate-delay-300 flex items-start gap-4 border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-medium text-amber-600 dark:text-amber-400">
                Showing demo data
              </p>
              <p className="mt-1 text-[13px] text-amber-600/80 dark:text-amber-400/80">
                Reddit API credentials not configured. Add REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET to see real leads.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xl">
          <div className="w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95">
            <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
              <div>
                <h3 className="text-[19px] font-semibold text-[var(--foreground)]">
                  Import Reddit Post
                </h3>
                <p className="mt-1 text-[13px] text-[#86868b]">
                  Paste a Reddit URL to analyze and generate a reply
                </p>
              </div>
              <button
                onClick={() => { setShowImport(false); setImportError(''); }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#86868b] transition-colors hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                  Reddit URL
                </label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => handleImportUrl(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/10 dark:border-white/10"
                  placeholder="https://www.reddit.com/r/SaaS/comments/..."
                />
              </div>
              
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                  Post Title
                </label>
                <input
                  type="text"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/10 dark:border-white/10"
                  placeholder="Copy the post title here"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                  Post Body <span className="font-normal text-[#86868b]">(optional)</span>
                </label>
                <textarea
                  value={importBody}
                  onChange={(e) => setImportBody(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/10 dark:border-white/10"
                  rows={4}
                  placeholder="Paste the post content for better context"
                />
              </div>
              
              {importError && (
                <p className="text-[13px] text-red-500">{importError}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 border-t border-black/5 p-6 dark:border-white/5">
              <button
                onClick={() => { setShowImport(false); setImportError(''); }}
                className="h-10 rounded-full px-5 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={importLead}
                className="h-10 rounded-full bg-[var(--foreground)] px-6 text-[13px] font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Import & Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xl">
          <div className="max-h-[90vh] w-full max-w-2xl animate-scale-in overflow-auto rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
              <div>
                <h3 className="text-[19px] font-semibold text-[var(--foreground)]">
                  Generate Reply
                </h3>
                <p className="mt-1 text-[13px] text-[#86868b]">
                  r/{selectedLead.subreddit}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#86868b] transition-colors hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Original Post */}
              <div className="mb-6 rounded-xl bg-[var(--foreground)]/[0.03] p-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Original Post</p>
                <p className="text-[15px] font-medium text-[var(--foreground)]">{selectedLead.title}</p>
                {selectedLead.body && (
                  <p className="mt-3 text-[14px] leading-relaxed text-[#86868b] line-clamp-3">
                    {selectedLead.body}
                  </p>
                )}
              </div>

              {/* Loading State */}
              {generatingReply && (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-2 border-[var(--foreground)]/10"></div>
                      <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-orange-500"></div>
                    </div>
                    <p className="text-[13px] text-[#86868b]">Generating reply...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {replyError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                  <p className="text-[14px] font-medium text-red-500">{replyError}</p>
                  <button
                    onClick={() => generateReply(selectedLead)}
                    className="mt-3 text-[13px] font-medium text-red-500 underline-offset-2 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Generated Reply */}
              {generatedReply && (
                <div className="space-y-5">
                  {/* AI Badge */}
                  {!generatedReply.aiConfigured && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <span className="text-lg">⚡</span>
                      <p className="text-[13px] font-medium text-amber-600 dark:text-amber-400">
                        Demo mode - Add OPENAI_API_KEY for AI-generated replies
                      </p>
                    </div>
                  )}

                  {/* Reply Content */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Draft Reply</p>
                      <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)]/5 px-3 py-1.5 text-[12px] font-medium text-[var(--foreground)] transition-all hover:bg-[var(--foreground)]/10"
                      >
                        {copied ? (
                          <>
                            <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl border border-black/5 bg-white p-5 dark:border-white/5 dark:bg-white/5">
                      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--foreground)]">
                        {generatedReply.reply}
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  {generatedReply.tips && generatedReply.tips.length > 0 && (
                    <div className="rounded-xl bg-[var(--foreground)]/[0.03] p-5">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Tips</p>
                      <ul className="space-y-2">
                        {generatedReply.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#86868b]">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#86868b]"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {generatedReply && (
              <div className="flex items-center justify-between border-t border-black/5 p-6 dark:border-white/5">
                <button
                  onClick={() => generateReply(selectedLead)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 px-5 text-[13px] font-medium text-[var(--foreground)] transition-all hover:bg-[var(--foreground)]/5 active:scale-[0.98] dark:border-white/10"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
                <a
                  href={selectedLead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--foreground)] px-6 text-[13px] font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Open Reddit to Reply
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

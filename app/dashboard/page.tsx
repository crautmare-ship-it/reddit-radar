'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

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

export default function Dashboard() {
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

  useEffect(() => {
    loadLeads();
  }, []);

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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {loading ? 'Loading...' : `${leads.length} leads found`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Data Source Badge */}
            {!loading && configured && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                source === 'reddit' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  source === 'reddit' ? 'bg-green-500' : 'bg-amber-500'
                }`}></span>
                {source === 'reddit' ? 'Live Reddit Data' : 'Demo Data'}
              </span>
            )}
            
            <button
              onClick={loadLeads}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Not Configured State */}
        {!loading && !configured && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">No keywords configured</h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              {message || 'Set up your keywords and subreddits to start finding leads.'}
            </p>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl"
            >
              Configure Keywords
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-3 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800"></div>
                  <div className="h-4 w-20 rounded bg-zinc-100 dark:bg-zinc-800"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && configured && leads.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">No leads found</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Try adjusting your keywords or adding more subreddits.
            </p>
          </div>
        )}

        {/* Leads List */}
        {!loading && leads.length > 0 && (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="group rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold leading-snug text-black dark:text-white">
                    {lead.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    ↑ {lead.score}
                  </span>
                </div>
                
                {/* Body Preview */}
                {lead.body && (
                  <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {lead.body}
                  </p>
                )}
                
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
                    </svg>
                    r/{lead.subreddit}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {lead.numComments} comments
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeAgo(lead.created)}
                  </span>
                  <span className="text-zinc-400">by u/{lead.author}</span>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Open on Reddit
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={() => generateReply(lead)}
                    className="inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-400 dark:hover:bg-orange-950"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50">
            <div className="flex gap-3">
              <svg className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Showing demo data
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Reddit API credentials not configured. Add REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET to see real leads.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-700">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Generate Reply
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  r/{selectedLead.subreddit}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {/* Original Post */}
              <div className="mb-5 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Original Post</p>
                <p className="font-medium text-black dark:text-white">{selectedLead.title}</p>
                {selectedLead.body && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {selectedLead.body}
                  </p>
                )}
              </div>

              {/* Loading State */}
              {generatingReply && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="h-8 w-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Generating reply...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {replyError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{replyError}</p>
                  <button
                    onClick={() => generateReply(selectedLead)}
                    className="mt-3 text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Generated Reply */}
              {generatedReply && (
                <div className="space-y-4">
                  {/* AI Badge */}
                  {!generatedReply.aiConfigured && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        ⚡ Demo mode - Add OPENAI_API_KEY or ANTHROPIC_API_KEY for AI-generated replies
                      </p>
                    </div>
                  )}

                  {/* Reply Content */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Draft Reply</p>
                      <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        {copied ? (
                          <>
                            <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-black dark:text-white">
                        {generatedReply.reply}
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  {generatedReply.tips && generatedReply.tips.length > 0 && (
                    <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Tips</p>
                      <ul className="space-y-1.5">
                        {generatedReply.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400"></span>
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
              <div className="flex items-center justify-between border-t border-zinc-200 p-5 dark:border-zinc-700">
                <button
                  onClick={() => generateReply(selectedLead)}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
                <a
                  href={selectedLead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl"
                >
                  Open Reddit to Reply
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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

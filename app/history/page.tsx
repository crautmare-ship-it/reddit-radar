'use client';

import { useState, useEffect } from "react";

interface ReplyHistory {
  id: number;
  postTitle: string;
  postBody: string;
  postUrl: string;
  subreddit: string;
  generatedReply: string;
  replyTone: string;
  tokensUsed: number;
  createdAt: string;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ReplyHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Delete this reply from history?')) return;
    
    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      setHistory(history.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const copyToClipboard = async (id: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Reply History
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {loading ? 'Loading...' : `${history.length} saved replies`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-3 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="mb-4 h-20 w-full rounded bg-zinc-100 dark:bg-zinc-800"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">No replies yet</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              When you generate AI replies from leads on the Dashboard, they&apos;ll be automatically saved here. You can copy, view, or delete your past replies anytime.
            </p>
            <a
              href="/dashboard"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-600"
            >
              Go to Dashboard
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 transition-all dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
                        </svg>
                        r/{item.subreddit}
                      </span>
                      <span>•</span>
                      <span>{timeAgo(item.createdAt)}</span>
                      {item.tokensUsed > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.tokensUsed} tokens</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-medium text-black dark:text-white line-clamp-1">
                      {item.postTitle}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 capitalize">
                    {item.replyTone}
                  </span>
                </div>

                {/* Reply Preview/Full */}
                <div 
                  className={`rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800 ${expandedId !== item.id ? 'cursor-pointer' : ''}`}
                  onClick={() => expandedId !== item.id && setExpandedId(item.id)}
                >
                  <p className={`text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap ${expandedId !== item.id ? 'line-clamp-3' : ''}`}>
                    {item.generatedReply}
                  </p>
                  {expandedId !== item.id && item.generatedReply.length > 200 && (
                    <button className="mt-2 text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400">
                      Show more...
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(item.id, item.generatedReply)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    {copiedId === item.id ? (
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
                  <a
                    href={item.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Post
                  </a>
                  {expandedId === item.id && (
                    <button
                      onClick={() => setExpandedId(null)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      Collapse
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 ml-auto"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

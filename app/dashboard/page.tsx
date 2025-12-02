'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

interface Lead {
  id: string;
  title: string;
  subreddit: string;
  url: string;
  score: number;
  author: string;
  created: number;
  numComments: number;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [message, setMessage] = useState('');

  // Load leads on mount
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
    } catch (error) {
      console.error('Failed to load leads:', error);
      setMessage('Error loading leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl w-full px-6 py-16">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-4">
          Dashboard
        </h1>
        
        {loading ? (
          <p className="text-lg text-zinc-700 dark:text-zinc-400 mb-4">
            Loading leads...
          </p>
        ) : !configured ? (
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-lg text-zinc-700 dark:text-zinc-400 mb-4">
              {message}
            </p>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
            >
              Configure Keywords in Settings
            </Link>
          </div>
        ) : (
          <p className="text-lg text-zinc-700 dark:text-zinc-400 mb-4">
            Here are Reddit threads matching your keywords. In production, these would be real Reddit posts.
          </p>
        )}

        <div className="mb-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-200 text-black px-4 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
          >
            Go to Settings
          </Link>
        </div>

        {!loading && leads.length > 0 && (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold text-black dark:text-zinc-50">
                    {lead.title}
                  </h2>
                  <span className="text-xs rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    Score: {lead.score}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  r/{lead.subreddit} • {lead.numComments} comments
                </p>
                <a
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Open thread on Reddit
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

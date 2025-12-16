'use client';

import { useState, useEffect } from "react";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";

interface UsageStats {
  currentMonth: {
    totalReplies: number;
    totalTokens: number;
    estimatedCost: number;
    month: string;
  };
  allTime: {
    totalReplies: number;
    totalTokens: number;
    estimatedCost: number;
  };
}

export default function AnalyticsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadUsage();
    }
  }, [isLoaded, isSignedIn]);

  // Auth check
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const loadUsage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/usage');
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Failed to load usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Usage Analytics
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Track your AI reply generation usage
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-2 h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="h-8 w-16 rounded bg-zinc-100 dark:bg-zinc-800"></div>
              </div>
            ))}
          </div>
        )}

        {usage && (
          <>
            {/* Current Month Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                {formatMonth(usage.currentMonth.month)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Replies Generated</p>
                  <p className="mt-1 text-3xl font-bold text-black dark:text-white">
                    {usage.currentMonth.totalReplies}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tokens Used</p>
                  <p className="mt-1 text-3xl font-bold text-black dark:text-white">
                    {formatNumber(usage.currentMonth.totalTokens)}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Est. Cost</p>
                  <p className="mt-1 text-3xl font-bold text-black dark:text-white">
                    ${usage.currentMonth.estimatedCost.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>

            {/* All Time Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                All Time
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Replies</p>
                  <p className="mt-1 text-3xl font-bold text-black dark:text-white">
                    {usage.allTime.totalReplies}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Tokens</p>
                  <p className="mt-1 text-3xl font-bold text-black dark:text-white">
                    {formatNumber(usage.allTime.totalTokens)}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Cost</p>
                  <p className="mt-1 text-3xl font-bold text-black dark:text-white">
                    ${usage.allTime.estimatedCost.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <div className="flex gap-3">
                <svg className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Pricing estimate
                  </p>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Cost estimates are based on GPT-4o-mini pricing (~$0.15/1M input, ~$0.60/1M output tokens). Actual costs may vary based on the model used.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

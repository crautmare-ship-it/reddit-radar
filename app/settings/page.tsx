'use client';

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";

export default function Settings() {
  // Product form state
  const [productName, setProductName] = useState('');
  const [productWebsite, setProductWebsite] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState('');

  // Keywords form state
  const [problemKeywords, setProblemKeywords] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [subreddits, setSubreddits] = useState('');
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [keywordsMessage, setKeywordsMessage] = useState('');

  // Load existing settings on mount
  useEffect(() => {
    loadProductSettings();
    loadKeywordSettings();
  }, []);

  // Load product settings from API
  const loadProductSettings = async () => {
    try {
      const response = await fetch('/api/settings/product');
      const data = await response.json();
      if (data.name) setProductName(data.name);
      if (data.website) setProductWebsite(data.website);
      if (data.targetAudience) setTargetAudience(data.targetAudience);
    } catch {
      console.error('Failed to load product settings');
    }
  };

  // Load keyword settings from API
  const loadKeywordSettings = async () => {
    try {
      const response = await fetch('/api/settings/keywords');
      const data = await response.json();
      if (data.problemKeywords) setProblemKeywords(data.problemKeywords.join('\n'));
      if (data.competitors) setCompetitors(data.competitors.join('\n'));
      if (data.subreddits) setSubreddits(data.subreddits.join('\n'));
    } catch {
      console.error('Failed to load keyword settings');
    }
  };

  // Save product settings
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage('');

    try {
      const response = await fetch('/api/settings/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          website: productWebsite,
          targetAudience: targetAudience,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage('✓ Product settings saved successfully!');
        setTimeout(() => setProductMessage(''), 3000);
      } else {
        setProductMessage(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch {
      setProductMessage('Error: Failed to save product settings');
    } finally {
      setProductLoading(false);
    }
  };

  // Save keyword settings
  const handleKeywordsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setKeywordsLoading(true);
    setKeywordsMessage('');

    try {
      const response = await fetch('/api/settings/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemKeywords,
          competitors,
          subreddits,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setKeywordsMessage('✓ Keywords saved successfully!');
        setTimeout(() => setKeywordsMessage(''), 3000);
      } else {
        setKeywordsMessage(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch {
      setKeywordsMessage('Error: Failed to save keywords');
    } finally {
      setKeywordsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl w-full px-6 py-16 space-y-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Settings
        </h1>

        <div className="mt-1 mb-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-200 text-black px-4 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
          >
            Dashboard
          </Link>
        </div>

        {/* Product section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Product
          </h2>
          <p className="text-zinc-700 dark:text-zinc-400">
            Tell us about your SaaS. This will be used when generating replies.
          </p>
          <form onSubmit={handleProductSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Product name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Example: ChurnWatch"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Product website
              </label>
              <input
                type="text"
                value={productWebsite}
                onChange={(e) => setProductWebsite(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="https://your-saas.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Who is it for?
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Example: small B2B SaaS founders, HR managers..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={productLoading}
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {productLoading ? 'Saving...' : 'Save Product'}
            </button>
            {productMessage && (
              <p className={`text-sm ${productMessage.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {productMessage}
              </p>
            )}
          </form>
        </section>

        {/* Keywords section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Keywords & Subreddits
          </h2>
          <p className="text-zinc-700 dark:text-zinc-400">
            These will tell the system what to look for on Reddit.
          </p>
          <form onSubmit={handleKeywordsSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Problem keywords (one per line)
              </label>
              <textarea
                value={problemKeywords}
                onChange={(e) => setProblemKeywords(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                rows={3}
                placeholder={"how to reduce churn\nbest crm for freelancers\nalternative to X"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Competitor / tool names (one per line)
              </label>
              <textarea
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                rows={2}
                placeholder={"HubSpot\nIntercom"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Subreddits to monitor (one per line)
              </label>
              <textarea
                value={subreddits}
                onChange={(e) => setSubreddits(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                rows={2}
                placeholder={"SaaS\nEntrepreneur\nindiehackers"}
              />
            </div>
            <button
              type="submit"
              disabled={keywordsLoading}
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {keywordsLoading ? 'Saving...' : 'Save Keywords'}
            </button>
            {keywordsMessage && (
              <p className={`text-sm ${keywordsMessage.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {keywordsMessage}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

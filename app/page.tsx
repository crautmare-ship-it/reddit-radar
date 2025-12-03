import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
            </span>
            Now with Reddit API integration
          </div>
          
          {/* Headline */}
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            Find your next customers on{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Reddit
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Every day, discover Reddit threads where people are asking for exactly what your SaaS does. Get notified, engage authentically, and turn conversations into customers.
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30"
            >
              Go to Dashboard
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/settings"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-base font-semibold text-black transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              Configure Keywords
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Smart Keyword Matching</h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Set up problem keywords, competitor names, and target subreddits. We&apos;ll find the most relevant discussions.
            </p>
          </div>
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Real-time Reddit Data</h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Fresh leads from Reddit&apos;s API, sorted by engagement. Jump into conversations while they&apos;re still active.
            </p>
          </div>
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">AI Reply Drafts</h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Coming soon: Get AI-generated reply suggestions that sound natural and helpful, not spammy.
            </p>
          </div>
        </div>
        
        {/* How it Works */}
        <div className="mt-24">
          <h2 className="mb-12 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-black">
                1
              </div>
              <h3 className="mb-2 font-semibold text-black dark:text-white">Configure your product</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Tell us about your SaaS, target audience, and keywords to watch.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-black">
                2
              </div>
              <h3 className="mb-2 font-semibold text-black dark:text-white">We scan Reddit</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Our system searches your target subreddits for matching discussions.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-black">
                3
              </div>
              <h3 className="mb-2 font-semibold text-black dark:text-white">Engage & convert</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Review leads, jump into conversations, and help people discover your solution.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Built for SaaS founders who want to grow through authentic engagement.
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Secondary Navigation for Landing Page - anchor links only */}
      <div className="sticky top-16 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-3">
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">How it Works</a>
            <a href="#pricing" className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">Pricing</a>
            <a href="#faq" className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">FAQ</a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
            </span>
            Trusted by 500+ SaaS founders
          </div>
          
          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            Stop chasing leads.{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Let them find you
            </span>{" "}
            on Reddit
          </h1>
          
          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Every day, thousands of people ask Reddit for software recommendations. Redd Radar finds those conversations and helps you join them authentically—before your competitors do.
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30"
            >
              Start Free Trial
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#demo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-8 text-base font-semibold text-black transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </a>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-zinc-200 to-zinc-300 text-xs font-medium text-zinc-600 dark:border-zinc-900 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-300">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">4.9/5 from 120+ reviews</span>
            </div>
          </div>
        </div>
        
        {/* Demo Video Placeholder */}
        <div id="demo" className="mt-16 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-zinc-800">
                <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Demo video coming soon</p>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div id="features" className="mt-24">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Features</span>
            <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">Everything you need to turn Reddit into your growth engine</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 transition-colors group-hover:bg-orange-200 dark:bg-orange-900/30 dark:group-hover:bg-orange-900/50">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Smart Keyword Matching</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Set up problem keywords, competitor names, and target subreddits. We&apos;ll find the most relevant discussions.
              </p>
            </div>
            
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Real-time Reddit Data</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Fresh leads from Reddit&apos;s API, sorted by engagement. Jump into conversations while they&apos;re still active.
              </p>
            </div>
            
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">AI Reply Generation</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Get AI-generated reply suggestions that sound natural and helpful. Customize tone and save templates.
              </p>
            </div>
            
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 transition-colors group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-900/50">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Reply History</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Track every reply you&apos;ve generated. Search, copy, and reuse your best-performing responses.
              </p>
            </div>
            
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-pink-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 transition-colors group-hover:bg-pink-200 dark:bg-pink-900/30 dark:group-hover:bg-pink-900/50">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Usage Analytics</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Monitor your AI usage, token consumption, and cost estimates with beautiful charts.
              </p>
            </div>
            
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-yellow-200 hover:shadow-lg hover:shadow-yellow-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-yellow-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 transition-colors group-hover:bg-yellow-200 dark:bg-yellow-900/30 dark:group-hover:bg-yellow-900/50">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Manual Lead Import</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Found a Reddit thread yourself? Paste the URL and let our AI analyze it and generate a reply.
              </p>
            </div>
          </div>
        </div>
        
        {/* How it Works */}
        <div id="how-it-works" className="mt-24">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">How it Works</span>
            <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">Three steps to Reddit-driven growth</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="relative text-center">
              <div className="absolute left-1/2 top-5 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-200 to-transparent sm:block dark:via-zinc-800"></div>
              <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white shadow-lg shadow-orange-500/25">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Configure your product</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Tell us about your SaaS, describe your target audience, and add keywords to monitor.
              </p>
            </div>
            <div className="relative text-center">
              <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white shadow-lg shadow-orange-500/25">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">We scan Reddit 24/7</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Our system searches your target subreddits and ranks discussions by relevance and engagement.
              </p>
            </div>
            <div className="relative text-center">
              <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white shadow-lg shadow-orange-500/25">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Engage & convert</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Get AI-generated reply suggestions, jump into conversations, and turn readers into customers.
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">Testimonials</span>
            <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">Loved by founders worldwide</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                &quot;Redd Radar helped us find 50+ qualified leads in our first month. The AI replies are incredibly natural—people actually respond positively.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                  JM
                </div>
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Jake Morrison</p>
                  <p className="text-xs text-zinc-500">Founder, DevTools Inc</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                &quot;We went from 0 to 200 users just by engaging authentically on Reddit. Redd Radar made it scalable.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-bold text-white">
                  SC
                </div>
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Sarah Chen</p>
                  <p className="text-xs text-zinc-500">CEO, AnalyticsHub</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                &quot;The best Reddit marketing tool I&apos;ve used. The keyword matching is spot-on and the reply templates save hours every week.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-bold text-white">
                  MK
                </div>
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Mike Kim</p>
                  <p className="text-xs text-zinc-500">Founder, LaunchPad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing */}
        <div id="pricing" className="mt-24">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Pricing</span>
            <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {/* Free Plan */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-black dark:text-white">Starter</h3>
              <p className="mt-1 text-sm text-zinc-500">Perfect for trying out</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-black dark:text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  50 leads/month
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  10 AI replies/month
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  3 keywords
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Basic analytics
                </li>
              </ul>
              <Link href="/dashboard" className="mt-6 block w-full rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-orange-500 bg-white p-6 shadow-lg shadow-orange-500/10 dark:bg-zinc-900">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">Pro</h3>
              <p className="mt-1 text-sm text-zinc-500">For serious founders</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-black dark:text-white">$29</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  500 leads/month
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  100 AI replies/month
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Unlimited keywords
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Reply templates
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Priority support
                </li>
              </ul>
              <Link href="/dashboard" className="mt-6 block w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:from-orange-600 hover:to-red-700">
                Start Free Trial
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-black dark:text-white">Enterprise</h3>
              <p className="mt-1 text-sm text-zinc-500">For growing teams</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-black dark:text-white">$99</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Unlimited leads
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  500 AI replies/month
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Team collaboration
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  API access
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Dedicated support
                </li>
              </ul>
              <Link href="/dashboard" className="mt-6 block w-full rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div id="faq" className="mt-24">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">FAQ</span>
            <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            <details className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-black dark:text-white">
                How does Redd Radar find relevant Reddit threads?
                <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                We use Reddit&apos;s official API to search for posts matching your keywords across your target subreddits. Our algorithm ranks results by relevance, recency, and engagement potential to surface the best opportunities.
              </p>
            </details>
            
            <details className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-black dark:text-white">
                Will my replies get flagged as spam?
                <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Our AI generates helpful, contextual responses—not promotional spam. The key is to provide genuine value first. We focus on answering questions and solving problems, with a soft mention of your product only when truly relevant.
              </p>
            </details>
            
            <details className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-black dark:text-white">
                Does Redd Radar post replies automatically?
                <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                No. Redd Radar generates reply suggestions that you can review, edit, and then post yourself. This gives you full control over your engagement and ensures authenticity in every interaction.
              </p>
            </details>
            
            <details className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-black dark:text-white">
                What AI model powers the reply generation?
                <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                We use GPT-4o-mini for fast, cost-effective, and high-quality reply generation. The model is fine-tuned to write naturally and avoid common AI tells like excessive enthusiasm or generic responses.
              </p>
            </details>
            
            <details className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-black dark:text-white">
                Can I cancel my subscription anytime?
                <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Absolutely! You can cancel your subscription at any time with no questions asked. Your access continues until the end of your billing period.
              </p>
            </details>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to find your next customers on Reddit?</h2>
          <p className="mx-auto mt-4 max-w-xl text-orange-100">
            Join 500+ founders who use Redd Radar to turn Reddit conversations into paying customers.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-orange-600 shadow-lg transition-all hover:shadow-xl"
          >
            Start Your Free Trial
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <span className="text-lg font-bold text-black dark:text-white">Redd Radar</span>
              </div>
              <p className="text-sm text-zinc-500">
                Find your next customers on Reddit through authentic engagement.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-black dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#features" className="hover:text-black dark:hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-black dark:hover:text-white">Pricing</a></li>
                <li><a href="#faq" className="hover:text-black dark:hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-black dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black dark:hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-black dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-black dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
            © {new Date().getFullYear()} Redd Radar. Built for SaaS founders who want to grow through authentic engagement.
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AuthCTAButton } from "./components/AuthCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* Sub-navigation */}
      <div className="sticky top-16 z-40 glass border-b border-black/5 dark:border-white/5">
        <div className="mx-auto flex max-w-[980px] items-center justify-center px-6 py-3">
          <div className="flex items-center gap-8">
            <a href="#features" className="text-xs font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]">Features</a>
            <a href="#how-it-works" className="text-xs font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]">How it Works</a>
            <a href="#pricing" className="text-xs font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]">Pricing</a>
            <a href="#faq" className="text-xs font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]">FAQ</a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-3xl" />
          <div className="absolute -top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[980px] px-6 pb-20 pt-24 text-center">
          {/* Eyebrow */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--foreground)]/5 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-[var(--foreground)]/80">Trusted by 500+ founders</span>
          </div>

          {/* Main headline */}
          <h1 className="animate-fade-in-up animate-delay-100 mx-auto max-w-4xl text-[48px] font-semibold leading-[1.08] tracking-[-0.015em] text-[var(--foreground)] sm:text-[56px] lg:text-[80px]">
            Find customers.
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Not leads.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-6 max-w-2xl text-[21px] font-normal leading-[1.381] text-[#86868b]">
            Redd Radar finds Reddit conversations where people are actively looking for solutions like yours. Join discussions authentically and convert readers into customers.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up animate-delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AuthCTAButton className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-8 text-[17px] font-normal text-[var(--background)] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]" />
            <a
              href="#demo"
              className="inline-flex h-[52px] items-center justify-center gap-2 text-[17px] font-normal text-[var(--accent)] transition-colors hover:underline"
            >
              Watch the film
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Hero image/video placeholder */}
        <div id="demo" className="animate-fade-in-up animate-delay-400 relative mx-auto max-w-[1200px] px-6">
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-b from-zinc-100 to-zinc-50 shadow-2xl dark:border-white/5 dark:from-zinc-900 dark:to-black">
            <div className="aspect-[16/9] flex items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-xl dark:bg-black/50">
                  <svg className="ml-1 h-8 w-8 text-[var(--foreground)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-[15px] text-[#86868b]">Product demo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="relative z-10 -mt-8">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-white/60 py-8 shadow-sm backdrop-blur-xl dark:bg-white/5 sm:flex-row sm:gap-12">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                  <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-xs font-semibold text-white ring-2 ring-white dark:ring-black`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-[#86868b]">500+ active users</span>
            </div>
            <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-[#86868b]">4.9 rating</span>
            </div>
            <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
            <span className="text-sm text-[#86868b]">50K+ leads found</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-[980px] px-6 py-32">
        <div className="text-center">
          <h2 className="text-[14px] font-semibold uppercase tracking-wide text-orange-500">Features</h2>
          <p className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)] sm:text-[48px]">
            Everything you need.
            <br />
            <span className="text-[#86868b]">Nothing you don&apos;t.</span>
          </p>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🔍', title: 'Smart Search', desc: 'AI-powered keyword matching finds the most relevant conversations across any subreddit.' },
            { icon: '⚡', title: 'Real-time Data', desc: 'Fresh leads updated every hour. Jump into conversations while they\'re still active.' },
            { icon: '💬', title: 'AI Replies', desc: 'Generate natural, helpful responses that don\'t sound like marketing spam.' },
            { icon: '📊', title: 'Analytics', desc: 'Track your usage, monitor costs, and measure the impact of your engagement.' },
            { icon: '📝', title: 'Templates', desc: 'Save your best-performing reply formats and reuse them with one click.' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes. Switch between light and dark themes anytime.' },
          ].map((feature, i) => (
            <div
              key={i}
              className="card-apple group flex flex-col gap-4"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="text-[19px] font-semibold text-[var(--foreground)]">{feature.title}</h3>
              <p className="text-[15px] leading-relaxed text-[#86868b]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[var(--foreground)]/[0.02] py-32">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="text-center">
            <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[var(--accent)]">How it Works</h2>
            <p className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)] sm:text-[48px]">
              Three steps to growth.
            </p>
          </div>

          <div className="mt-20 grid gap-12 sm:grid-cols-3">
            {[
              { num: '01', title: 'Configure', desc: 'Tell us about your product and add keywords to monitor.' },
              { num: '02', title: 'Discover', desc: 'We scan Reddit 24/7 and surface the best opportunities.' },
              { num: '03', title: 'Engage', desc: 'Generate AI replies, join conversations, and convert.' },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--foreground)] to-[var(--foreground)]/80 text-2xl font-bold text-[var(--background)]">
                  {step.num}
                </div>
                <h3 className="mb-3 text-[24px] font-semibold text-[var(--foreground)]">{step.title}</h3>
                <p className="text-[15px] text-[#86868b]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[980px] px-6 py-32">
        <div className="text-center">
          <h2 className="text-[14px] font-semibold uppercase tracking-wide text-green-500">Testimonials</h2>
          <p className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)] sm:text-[48px]">
            Founders love us.
          </p>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          {[
            { quote: 'Found 50+ qualified leads in our first month. The AI replies feel incredibly natural.', name: 'Jake M.', role: 'DevTools Inc', color: 'from-blue-500 to-cyan-500' },
            { quote: 'We went from 0 to 200 users just by engaging authentically on Reddit.', name: 'Sarah C.', role: 'AnalyticsHub', color: 'from-purple-500 to-pink-500' },
            { quote: 'The best Reddit marketing tool I\'ve used. Saves hours every week.', name: 'Mike K.', role: 'LaunchPad', color: 'from-orange-500 to-red-500' },
          ].map((testimonial, i) => (
            <div key={i} className="card-apple flex flex-col justify-between">
              <div>
                <div className="mb-4 flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[17px] leading-relaxed text-[var(--foreground)]">&quot;{testimonial.quote}&quot;</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-semibold text-white`}>
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[var(--foreground)]">{testimonial.name}</p>
                  <p className="text-[13px] text-[#86868b]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[var(--foreground)]/[0.02] py-32">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="text-center">
            <h2 className="text-[14px] font-semibold uppercase tracking-wide text-purple-500">Pricing</h2>
            <p className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)] sm:text-[48px]">
              Simple pricing.
              <br />
              <span className="text-[#86868b]">No surprises.</span>
            </p>
          </div>

          <div className="mt-20 grid gap-5 sm:grid-cols-3">
            {[
              { name: 'Starter', price: '$0', period: '/month', features: ['50 leads/month', '10 AI replies', '3 keywords', 'Basic analytics'], cta: 'Get started', featured: false },
              { name: 'Pro', price: '$29', period: '/month', features: ['500 leads/month', '100 AI replies', 'Unlimited keywords', 'Reply templates', 'Priority support'], cta: 'Start trial', featured: true },
              { name: 'Enterprise', price: '$99', period: '/month', features: ['Unlimited leads', '500 AI replies', 'Team access', 'API access', 'Dedicated support'], cta: 'Contact us', featured: false },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-2xl p-8 transition-all ${
                  plan.featured
                    ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xl'
                    : 'card-apple'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-[17px] font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-[48px] font-semibold tracking-tight">{plan.price}</span>
                  <span className={plan.featured ? 'text-white/60' : 'text-[#86868b]'}>{plan.period}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-[15px]">
                      <svg className={`h-5 w-5 ${plan.featured ? 'text-green-400' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.featured ? 'text-white/80' : 'text-[#86868b]'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignedOut>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button
                      className={`mt-8 flex h-12 w-full items-center justify-center rounded-xl text-[17px] font-medium transition-all ${
                        plan.featured
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className={`mt-8 flex h-12 items-center justify-center rounded-xl text-[17px] font-medium transition-all ${
                      plan.featured
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90'
                    }`}
                  >
                    Go to Dashboard
                  </Link>
                </SignedIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[680px] px-6 py-32">
        <div className="text-center">
          <h2 className="text-[14px] font-semibold uppercase tracking-wide text-yellow-500">FAQ</h2>
          <p className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)]">
            Questions? Answers.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {[
            { q: 'How does Redd Radar find relevant threads?', a: 'We use Reddit\'s public API to search for posts matching your keywords. Our algorithm ranks by relevance, recency, and engagement potential.' },
            { q: 'Will my replies get flagged as spam?', a: 'Our AI generates helpful, contextual responses—not promotional spam. We focus on providing genuine value first.' },
            { q: 'Does it post replies automatically?', a: 'No. You review, edit, and post replies yourself. This ensures authenticity in every interaction.' },
            { q: 'What AI model do you use?', a: 'GPT-4o-mini for fast, cost-effective, high-quality reply generation that sounds natural.' },
            { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel anytime with no questions asked. Access continues until your billing period ends.' },
          ].map((faq, i) => (
            <details key={i} className="group card-apple cursor-pointer">
              <summary className="flex items-center justify-between text-[17px] font-medium text-[var(--foreground)]">
                {faq.q}
                <svg className="h-5 w-5 flex-shrink-0 text-[#86868b] transition-transform duration-200 group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-[#86868b]">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[680px] px-6 text-center">
          <h2 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)] sm:text-[56px]">
            Ready to find your
            <br />
            next customers?
          </h2>
          <p className="mt-6 text-[21px] text-[#86868b]">
            Join 500+ founders using Redd Radar to grow on Reddit.
          </p>
          <div className="mt-10">
            <AuthCTAButton className="group inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-10 text-[17px] font-medium text-[var(--background)] transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
              <span>Start your free trial</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </AuthCTAButton>
          </div>
          <p className="mt-4 text-[13px] text-[#86868b]">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[var(--foreground)]/[0.02] py-16 dark:border-white/5">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-[17px] font-semibold text-[var(--foreground)]">Redd Radar</span>
              </div>
              <p className="mt-4 text-[13px] text-[#86868b]">
                Find your next customers through authentic Reddit engagement.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'FAQ'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="text-[13px] font-semibold text-[var(--foreground)]">{section.title}</h4>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-[13px] text-[#86868b] transition-colors hover:text-[var(--foreground)]">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-black/5 pt-8 text-center text-[12px] text-[#86868b] dark:border-white/5">
            © {new Date().getFullYear()} Redd Radar. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

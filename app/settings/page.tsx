'use client';

import { useState, useEffect, FormEvent } from "react";

interface ReplyTemplate {
  id: number;
  name: string;
  tone: string;
  instructions: string;
  isDefault: boolean;
}

export default function Settings() {
  // Product form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productWebsite, setProductWebsite] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState('');
  const [productInitialLoading, setProductInitialLoading] = useState(true);

  // Keywords form state
  const [problemKeywords, setProblemKeywords] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [subreddits, setSubreddits] = useState('');
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [keywordsMessage, setKeywordsMessage] = useState('');
  const [keywordsInitialLoading, setKeywordsInitialLoading] = useState(true);

  // Templates state
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateTone, setNewTemplateTone] = useState('helpful');
  const [newTemplateInstructions, setNewTemplateInstructions] = useState('');

  useEffect(() => {
    loadProductSettings();
    loadKeywordSettings();
    loadTemplates();
  }, []);

  const loadProductSettings = async () => {
    try {
      const response = await fetch('/api/settings/product');
      const data = await response.json();
      if (data.name) setProductName(data.name);
      if (data.description) setProductDescription(data.description);
      if (data.website) setProductWebsite(data.website);
      if (data.targetAudience) setTargetAudience(data.targetAudience);
      if (data.features) setProductFeatures(data.features.join('\n'));
    } catch {
      console.error('Failed to load product settings');
    } finally {
      setProductInitialLoading(false);
    }
  };

  const loadKeywordSettings = async () => {
    try {
      const response = await fetch('/api/settings/keywords');
      const data = await response.json();
      if (data.problemKeywords) setProblemKeywords(data.problemKeywords.join('\n'));
      if (data.competitors) setCompetitors(data.competitors.join('\n'));
      if (data.subreddits) setSubreddits(data.subreddits.join('\n'));
    } catch {
      console.error('Failed to load keyword settings');
    } finally {
      setKeywordsInitialLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch {
      console.error('Failed to load templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!newTemplateName.trim()) return;
    
    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTemplateName,
          tone: newTemplateTone,
          instructions: newTemplateInstructions,
        }),
      });
      
      setNewTemplateName('');
      setNewTemplateTone('helpful');
      setNewTemplateInstructions('');
      setShowTemplateForm(false);
      loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const deleteTemplate = async (id: number) => {
    if (id === 0) return; // Can't delete default templates
    try {
      await fetch(`/api/templates?id=${id}`, { method: 'DELETE' });
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const setDefaultTemplate = async (id: number) => {
    if (id === 0) return; // Default templates can't be set as default via API
    try {
      await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to set default:', error);
    }
  };

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
          description: productDescription,
          website: productWebsite,
          targetAudience: targetAudience,
          features: productFeatures.split('\n').map(f => f.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage('success');
        setTimeout(() => setProductMessage(''), 3000);
      } else {
        setProductMessage(`error:${data.error || 'Failed to save'}`);
      }
    } catch {
      setProductMessage('error:Failed to save product settings');
    } finally {
      setProductLoading(false);
    }
  };

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
        setKeywordsMessage('success');
        setTimeout(() => setKeywordsMessage(''), 3000);
      } else {
        setKeywordsMessage(`error:${data.error || 'Failed to save'}`);
      }
    } catch {
      setKeywordsMessage('error:Failed to save keywords');
    } finally {
      setKeywordsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors">
      <div className="mx-auto max-w-[760px] px-6 py-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-[32px] font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[40px]">
            Settings
          </h1>
          <p className="mt-2 text-[17px] text-[#86868b]">
            Configure your product and keywords to find relevant Reddit leads.
          </p>
        </div>

        <div className="space-y-8">
          {/* Product Section */}
          <section className="card-apple animate-fade-in-up animate-delay-100 p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-[19px] font-semibold text-[var(--foreground)]">
                  Your Product
                </h2>
                <p className="mt-1 text-[14px] text-[#86868b]">
                  Tell us about your SaaS so we can find the right conversations.
                </p>
              </div>
            </div>
            
            {productInitialLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="mb-2 h-4 w-28 rounded-lg bg-[var(--foreground)]/5"></div>
                    <div className="h-12 rounded-xl bg-[var(--foreground)]/5"></div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Product name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                    placeholder="e.g., ChurnWatch, MailPilot, DataSync"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Product description
                  </label>
                  <p className="mb-2 text-[12px] text-[#86868b]">
                    What does your product do? Be specific - this helps AI generate accurate replies.
                  </p>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                    rows={3}
                    placeholder="e.g., An analytics platform that helps SaaS companies predict and prevent customer churn using AI-powered insights and automated email campaigns."
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={productWebsite}
                    onChange={(e) => setProductWebsite(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                    placeholder="https://your-product.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Target audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                    placeholder="e.g., SaaS founders, marketing teams, freelancers"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Key features <span className="font-normal text-[#86868b]">(one per line)</span>
                  </label>
                  <p className="mb-2 text-[12px] text-[#86868b]">
                    List your main features - AI will ONLY mention these, preventing hallucination.
                  </p>
                  <textarea
                    value={productFeatures}
                    onChange={(e) => setProductFeatures(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                    rows={4}
                    placeholder={"Churn prediction with 95% accuracy\nAutomated win-back email campaigns\nReal-time customer health scores\nSlack & HubSpot integrations"}
                  />
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={productLoading}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-blue-500 px-6 text-[13px] font-medium text-white transition-all hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
                  >
                    {productLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Product'
                    )}
                  </button>
                  
                  {productMessage === 'success' && (
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Saved successfully
                    </span>
                  )}
                  
                  {productMessage.startsWith('error:') && (
                    <span className="text-[13px] font-medium text-red-500">
                      {productMessage.replace('error:', '')}
                    </span>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Keywords Section */}
          <section className="card-apple animate-fade-in-up animate-delay-200 p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[19px] font-semibold text-[var(--foreground)]">
                  Keywords & Subreddits
                </h2>
                <p className="mt-1 text-[14px] text-[#86868b]">
                  Define what to search for on Reddit. One item per line.
                </p>
              </div>
            </div>

            {keywordsInitialLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="mb-2 h-4 w-36 rounded-lg bg-[var(--foreground)]/5"></div>
                    <div className="h-28 rounded-xl bg-[var(--foreground)]/5"></div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleKeywordsSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Problem keywords
                  </label>
                  <p className="mb-2 text-[12px] text-[#86868b]">
                    What problems does your product solve? Enter phrases people might search for.
                  </p>
                  <textarea
                    value={problemKeywords}
                    onChange={(e) => setProblemKeywords(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-white/10"
                    rows={4}
                    placeholder={"how to reduce churn\nbest tool for customer feedback\nanalytics dashboard recommendation"}
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Competitor names
                  </label>
                  <p className="mb-2 text-[12px] text-[#86868b]">
                    Products people might compare you to or ask for alternatives.
                  </p>
                  <textarea
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-white/10"
                    rows={3}
                    placeholder={"HubSpot\nIntercom\nMixpanel"}
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">
                    Subreddits to monitor
                  </label>
                  <p className="mb-2 text-[12px] text-[#86868b]">
                    Where does your target audience hang out? Don&apos;t include &quot;r/&quot;.
                  </p>
                  <textarea
                    value={subreddits}
                    onChange={(e) => setSubreddits(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[var(--foreground)]/[0.02] px-4 py-3 text-[15px] text-[var(--foreground)] transition-all placeholder:text-[#86868b] focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-white/10"
                    rows={3}
                    placeholder={"SaaS\nEntrepreneur\nstartups\nindiehackers"}
                  />
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={keywordsLoading}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--foreground)] px-6 text-[13px] font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  >
                    {keywordsLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--background)]/30 border-t-[var(--background)]"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Keywords'
                    )}
                  </button>
                  
                  {keywordsMessage === 'success' && (
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Saved successfully
                    </span>
                  )}
                  
                  {keywordsMessage.startsWith('error:') && (
                    <span className="text-[13px] font-medium text-red-500">
                      {keywordsMessage.replace('error:', '')}
                    </span>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Templates Section */}
          <section className="card-apple animate-fade-in-up animate-delay-300 p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[19px] font-semibold text-[var(--foreground)]">
                    Reply Templates
                  </h2>
                  <p className="mt-1 text-[14px] text-[#86868b]">
                    Customize how AI generates your replies.
                  </p>
                </div>
              </div>
              {!showTemplateForm && (
                <button
                  onClick={() => setShowTemplateForm(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/10 px-4 text-[13px] font-medium text-[var(--foreground)] transition-all hover:bg-[var(--foreground)]/5 active:scale-[0.98] dark:border-white/10"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              )}
            </div>

            {/* New Template Form */}
            {showTemplateForm && (
              <div className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
                <h3 className="mb-4 text-[15px] font-semibold text-[var(--foreground)]">New Template</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">Name</label>
                    <input
                      type="text"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 text-[14px] text-[var(--foreground)] placeholder:text-[#86868b] focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-white/10 dark:bg-black/50"
                      placeholder="e.g., Friendly Expert"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">Tone</label>
                    <select
                      value={newTemplateTone}
                      onChange={(e) => setNewTemplateTone(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 text-[14px] text-[var(--foreground)] focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-white/10 dark:bg-black/50"
                    >
                      <option value="helpful">Helpful</option>
                      <option value="casual">Casual</option>
                      <option value="professional">Professional</option>
                      <option value="technical">Technical</option>
                      <option value="empathetic">Empathetic</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[var(--foreground)]">Custom Instructions</label>
                    <textarea
                      value={newTemplateInstructions}
                      onChange={(e) => setNewTemplateInstructions(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 text-[14px] text-[var(--foreground)] placeholder:text-[#86868b] focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-white/10 dark:bg-black/50"
                      rows={2}
                      placeholder="e.g., Use analogies to explain complex concepts. Include a relevant emoji."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={saveTemplate}
                      className="h-9 rounded-full bg-purple-500 px-5 text-[13px] font-medium text-white transition-all hover:bg-purple-600 active:scale-[0.98]"
                    >
                      Save Template
                    </button>
                    <button
                      onClick={() => setShowTemplateForm(false)}
                      className="h-9 rounded-full px-5 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Templates List */}
            {templatesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-black/5 p-4 dark:border-white/5">
                    <div className="h-5 w-32 rounded-lg bg-[var(--foreground)]/5"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id || template.name}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                      template.isDefault
                        ? 'border-purple-500/30 bg-purple-500/5'
                        : 'border-black/5 hover:border-black/10 dark:border-white/5 dark:hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-medium text-[var(--foreground)]">{template.name}</span>
                        {template.isDefault && (
                          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-500">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] text-[#86868b]">
                        {template.tone}
                        {template.instructions && ` • ${template.instructions.slice(0, 50)}${template.instructions.length > 50 ? '...' : ''}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!template.isDefault && template.id !== 0 && (
                        <button
                          onClick={() => setDefaultTemplate(template.id)}
                          className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#86868b] transition-colors hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
                        >
                          Set Default
                        </button>
                      )}
                      {template.id !== 0 && (
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="rounded-full px-3 py-1.5 text-[12px] font-medium text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Tips Section */}
          <section className="card-apple animate-fade-in-up animate-delay-400 bg-[var(--foreground)]/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-[var(--foreground)]">
              <svg className="h-4 w-4 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips for better results
            </h3>
            <ul className="space-y-3 text-[14px] text-[#86868b]">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#86868b]/50"></span>
                Use specific problem phrases people actually type, not marketing speak
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#86868b]/50"></span>
                Include common misspellings or variations of competitor names
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#86868b]/50"></span>
                Start with 3-5 subreddits and expand based on results
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#86868b]/50"></span>
                &quot;Alternative to X&quot; and &quot;X vs Y&quot; are high-intent keywords
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

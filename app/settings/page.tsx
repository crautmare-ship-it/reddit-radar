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
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Configure your product and keywords to find relevant Reddit leads.
          </p>
        </div>

        <div className="space-y-8">
          {/* Product Section */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Your Product
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Tell us about your SaaS so we can find the right conversations.
                </p>
              </div>
            </div>
            
            {productInitialLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="mb-2 h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800"></div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Product name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    placeholder="e.g., ChurnWatch, MailPilot, DataSync"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Product description
                  </label>
                  <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                    What does your product do? Be specific - this helps AI generate accurate replies.
                  </p>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-black transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    rows={3}
                    placeholder="e.g., An analytics platform that helps SaaS companies predict and prevent customer churn using AI-powered insights and automated email campaigns."
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={productWebsite}
                    onChange={(e) => setProductWebsite(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    placeholder="https://your-product.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Target audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    placeholder="e.g., SaaS founders, marketing teams, freelancers"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Key features (one per line)
                  </label>
                  <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                    List your main features - AI will ONLY mention these, preventing hallucination.
                  </p>
                  <textarea
                    value={productFeatures}
                    onChange={(e) => setProductFeatures(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-black transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    rows={4}
                    placeholder={"Churn prediction with 95% accuracy\nAutomated win-back email campaigns\nReal-time customer health scores\nSlack & HubSpot integrations"}
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={productLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {productLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Product'
                    )}
                  </button>
                  
                  {productMessage === 'success' && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved successfully
                    </span>
                  )}
                  
                  {productMessage.startsWith('error:') && (
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {productMessage.replace('error:', '')}
                    </span>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Keywords Section */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Keywords & Subreddits
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Define what to search for on Reddit. One item per line.
                </p>
              </div>
            </div>

            {keywordsInitialLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="mb-2 h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800"></div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleKeywordsSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Problem keywords
                  </label>
                  <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                    What problems does your product solve? Enter phrases people might search for.
                  </p>
                  <textarea
                    value={problemKeywords}
                    onChange={(e) => setProblemKeywords(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-black transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    rows={4}
                    placeholder={"how to reduce churn\nbest tool for customer feedback\nanalytics dashboard recommendation"}
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Competitor names
                  </label>
                  <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Products people might compare you to or ask for alternatives.
                  </p>
                  <textarea
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-black transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    rows={3}
                    placeholder={"HubSpot\nIntercom\nMixpanel"}
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Subreddits to monitor
                  </label>
                  <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                    Where does your target audience hang out? Don&apos;t include &quot;r/&quot;.
                  </p>
                  <textarea
                    value={subreddits}
                    onChange={(e) => setSubreddits(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-black transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    rows={3}
                    placeholder={"SaaS\nEntrepreneur\nstartups\nindiehackers"}
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={keywordsLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl disabled:opacity-50"
                  >
                    {keywordsLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Keywords'
                    )}
                  </button>
                  
                  {keywordsMessage === 'success' && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved successfully
                    </span>
                  )}
                  
                  {keywordsMessage.startsWith('error:') && (
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {keywordsMessage.replace('error:', '')}
                    </span>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Templates Section */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">
                    Reply Templates
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Customize how AI generates your replies.
                  </p>
                </div>
              </div>
              {!showTemplateForm && (
                <button
                  onClick={() => setShowTemplateForm(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Template
                </button>
              )}
            </div>

            {/* New Template Form */}
            {showTemplateForm && (
              <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950/30">
                <h3 className="mb-3 font-medium text-purple-900 dark:text-purple-100">New Template</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-purple-800 dark:text-purple-200">Name</label>
                    <input
                      type="text"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm dark:border-purple-700 dark:bg-purple-900/50 dark:text-white"
                      placeholder="e.g., Friendly Expert"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-purple-800 dark:text-purple-200">Tone</label>
                    <select
                      value={newTemplateTone}
                      onChange={(e) => setNewTemplateTone(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm dark:border-purple-700 dark:bg-purple-900/50 dark:text-white"
                    >
                      <option value="helpful">Helpful</option>
                      <option value="casual">Casual</option>
                      <option value="professional">Professional</option>
                      <option value="technical">Technical</option>
                      <option value="empathetic">Empathetic</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-purple-800 dark:text-purple-200">Custom Instructions</label>
                    <textarea
                      value={newTemplateInstructions}
                      onChange={(e) => setNewTemplateInstructions(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm dark:border-purple-700 dark:bg-purple-900/50 dark:text-white"
                      rows={2}
                      placeholder="e.g., Use analogies to explain complex concepts. Include a relevant emoji."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveTemplate}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                    >
                      Save Template
                    </button>
                    <button
                      onClick={() => setShowTemplateForm(false)}
                      className="rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/50"
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
                  <div key={i} className="animate-pulse rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                    <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id || template.name}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      template.isDefault
                        ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/30'
                        : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black dark:text-white">{template.name}</span>
                        {template.isDefault && (
                          <span className="rounded-full bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                        Tone: {template.tone}
                        {template.instructions && ` • ${template.instructions.slice(0, 50)}${template.instructions.length > 50 ? '...' : ''}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!template.isDefault && template.id !== 0 && (
                        <button
                          onClick={() => setDefaultTemplate(template.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          Set Default
                        </button>
                      )}
                      {template.id !== 0 && (
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
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
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
              <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips for better results
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400"></span>
                Use specific problem phrases people actually type, not marketing speak
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400"></span>
                Include common misspellings or variations of competitor names
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400"></span>
                Start with 3-5 subreddits and expand based on results
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400"></span>
                &quot;Alternative to X&quot; and &quot;X vs Y&quot; are high-intent keywords
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

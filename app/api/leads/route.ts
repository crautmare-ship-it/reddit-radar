/**
 * API Route: Leads
 * 
 * GET /api/leads - Returns Reddit leads matching configured keywords
 * 
 * Uses the Reddit API to search for posts in configured subreddits
 * that match problem keywords or mention competitors.
 * All data is scoped to the authenticated user.
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { keywordStorage, productStorage } from '@/lib/storage';
import { searchReddit, isRedditConfigured, Lead } from '@/lib/reddit';

/**
 * Generates mock Reddit leads for demo/testing when Reddit API is not configured
 */
function generateMockLeads(
  problemKeywords: string[],
  competitors: string[],
  subreddits: string[]
): Lead[] {
  const leads: Lead[] = [];
  
  const targetSubreddits = subreddits.length > 0 
    ? subreddits 
    : ['SaaS', 'Entrepreneur', 'indiehackers'];
  
  problemKeywords.slice(0, 3).forEach((keyword, index) => {
    const subreddit = targetSubreddits[index % targetSubreddits.length];
    leads.push({
      id: `mock_${Date.now()}_${index}`,
      title: `Looking for solution: ${keyword}`,
      body: `I've been trying to find a good solution for ${keyword}. Any recommendations?`,
      subreddit: subreddit,
      url: `https://www.reddit.com/r/${subreddit}/`,
      score: Math.floor(Math.random() * 100) + 50,
      author: `user${Math.floor(Math.random() * 1000)}`,
      created: Date.now() - Math.floor(Math.random() * 86400000),
      numComments: Math.floor(Math.random() * 50) + 5,
    });
  });
  
  competitors.slice(0, 2).forEach((competitor, index) => {
    const subreddit = targetSubreddits[index % targetSubreddits.length];
    leads.push({
      id: `mock_comp_${Date.now()}_${index}`,
      title: `Alternative to ${competitor}?`,
      body: `I've been using ${competitor} but looking for alternatives. What do you recommend?`,
      subreddit: subreddit,
      url: `https://www.reddit.com/r/${subreddit}/`,
      score: Math.floor(Math.random() * 80) + 40,
      author: `user${Math.floor(Math.random() * 1000)}`,
      created: Date.now() - Math.floor(Math.random() * 86400000),
      numComments: Math.floor(Math.random() * 40) + 3,
    });
  });
  
  return leads.sort((a, b) => b.score - a.score);
}

/**
 * GET handler - Returns leads from Reddit API or mock data
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if keywords are configured for this user
    const keywords = await keywordStorage.get(userId);
    const product = await productStorage.get(userId);
    
    if (!keywords || 
        (keywords.problemKeywords.length === 0 && 
         keywords.competitors.length === 0)) {
      return NextResponse.json({
        leads: [],
        configured: false,
        message: 'No keywords configured. Please configure your keywords in Settings.',
      });
    }

    // Check if Reddit API is configured
    const redditConfigured = isRedditConfigured();
    
    let leads: Lead[];
    let source: 'reddit' | 'mock';

    if (redditConfigured) {
      // Use real Reddit API
      const allKeywords = [
        ...keywords.problemKeywords,
        ...keywords.competitors.map(c => `alternative to ${c}`),
        ...keywords.competitors,
      ];
      
      const subreddits = keywords.subreddits.length > 0 
        ? keywords.subreddits 
        : ['SaaS', 'Entrepreneur', 'indiehackers', 'startups'];
      
      leads = await searchReddit(subreddits, allKeywords, { 
        limit: 10, 
        time: 'week' 
      });
      source = 'reddit';
    } else {
      // Fall back to mock data
      leads = generateMockLeads(
        keywords.problemKeywords,
        keywords.competitors,
        keywords.subreddits
      );
      source = 'mock';
    }
    
    return NextResponse.json({
      leads,
      configured: true,
      product: product ? product.name : null,
      source,
      redditConfigured,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

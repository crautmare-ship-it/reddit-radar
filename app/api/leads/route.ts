/**
 * API Route: Leads
 * 
 * GET /api/leads - Returns Reddit leads (currently mock data)
 * 
 * NOTE: This is currently a placeholder that generates mock leads based on saved keywords.
 * In a production version, this would:
 * 1. Use the Reddit API (https://www.reddit.com/dev/api) to search for posts
 * 2. Filter results by the configured subreddits
 * 3. Match against problem keywords and competitor names
 * 4. Return real Reddit threads with actual links and metadata
 * 
 * Reddit API Integration would require:
 * - OAuth authentication (client ID, client secret)
 * - Rate limiting handling (60 requests per minute for OAuth)
 * - Using endpoints like: GET /r/{subreddit}/search or GET /search
 */

import { NextResponse } from 'next/server';
import { keywordStorage, productStorage } from '@/lib/storage';

// Lead structure matching Reddit's post format
export interface Lead {
  id: string;
  title: string;
  subreddit: string;
  url: string;
  score: number;
  author: string;
  created: number;
  numComments: number;
}

/**
 * Generates mock Reddit leads based on configured keywords
 * This simulates what real Reddit API data would look like
 */
function generateMockLeads(
  problemKeywords: string[],
  competitors: string[],
  subreddits: string[]
): Lead[] {
  const leads: Lead[] = [];
  
  // Default subreddits if none configured
  const targetSubreddits = subreddits.length > 0 
    ? subreddits 
    : ['SaaS', 'Entrepreneur', 'indiehackers'];
  
  // Generate mock leads based on problem keywords
  problemKeywords.slice(0, 3).forEach((keyword, index) => {
    const subreddit = targetSubreddits[index % targetSubreddits.length];
    leads.push({
      id: `mock_${Date.now()}_${index}`,
      title: `Looking for solution: ${keyword}`,
      subreddit: subreddit,
      url: `https://www.reddit.com/r/${subreddit}/`,
      score: Math.floor(Math.random() * 100) + 50,
      author: `user${Math.floor(Math.random() * 1000)}`,
      created: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
      numComments: Math.floor(Math.random() * 50) + 5,
    });
  });
  
  // Generate mock leads based on competitor mentions
  competitors.slice(0, 2).forEach((competitor, index) => {
    const subreddit = targetSubreddits[index % targetSubreddits.length];
    leads.push({
      id: `mock_comp_${Date.now()}_${index}`,
      title: `Alternative to ${competitor}?`,
      subreddit: subreddit,
      url: `https://www.reddit.com/r/${subreddit}/`,
      score: Math.floor(Math.random() * 80) + 40,
      author: `user${Math.floor(Math.random() * 1000)}`,
      created: Date.now() - Math.floor(Math.random() * 86400000),
      numComments: Math.floor(Math.random() * 40) + 3,
    });
  });
  
  // Sort by score (descending)
  return leads.sort((a, b) => b.score - a.score);
}

/**
 * GET handler - Returns mock leads based on configured keywords
 */
export async function GET() {
  try {
    // Check if keywords are configured
    const keywords = await keywordStorage.get();
    const product = await productStorage.get();
    
    if (!keywords || 
        (keywords.problemKeywords.length === 0 && 
         keywords.competitors.length === 0)) {
      return NextResponse.json({
        leads: [],
        configured: false,
        message: 'No keywords configured. Please configure your keywords in Settings.',
      });
    }
    
    // Generate mock leads based on keywords
    // TODO: Replace this with actual Reddit API integration
    const leads = generateMockLeads(
      keywords.problemKeywords,
      keywords.competitors,
      keywords.subreddits
    );
    
    return NextResponse.json({
      leads,
      configured: true,
      product: product ? product.name : null,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

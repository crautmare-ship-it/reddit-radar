/**
 * Reddit API Client for Redd Radar
 * Uses Reddit's OAuth API to search for posts matching keywords
 * 
 * Reddit API Docs: https://www.reddit.com/dev/api
 * Rate limits: 60 requests per minute for OAuth
 */

// Reddit post structure
export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  subreddit: string;
  url: string;
  permalink: string;
  score: number;
  author: string;
  created_utc: number;
  num_comments: number;
}

// Transformed lead structure for our app
export interface Lead {
  id: string;
  title: string;
  body: string;
  subreddit: string;
  url: string;
  score: number;
  author: string;
  created: number;
  numComments: number;
}

// Token cache to avoid re-authenticating on every request
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get Reddit OAuth access token using client credentials flow
 * This is for "script" type apps (server-side only)
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Reddit API credentials not configured. Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET.');
  }

  // Reddit requires Basic Auth with client credentials
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'RedditRadar/1.0.0',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Reddit auth failed: ${error}`);
  }

  const data = await response.json();
  
  // Cache the token
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };

  return data.access_token;
}

/**
 * Make an authenticated request to Reddit's OAuth API
 */
async function redditFetch(endpoint: string): Promise<Response> {
  const token = await getAccessToken();
  
  const response = await fetch(`https://oauth.reddit.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'RedditRadar/1.0.0',
    },
  });

  return response;
}

/**
 * Search a subreddit for posts matching a query
 */
async function searchSubreddit(
  subreddit: string,
  query: string,
  options: { limit?: number; time?: string } = {}
): Promise<RedditPost[]> {
  const { limit = 25, time = 'week' } = options;
  
  const params = new URLSearchParams({
    q: query,
    restrict_sr: 'true',
    sort: 'relevance',
    t: time,
    limit: limit.toString(),
  });

  const response = await redditFetch(`/r/${subreddit}/search?${params}`);
  
  if (!response.ok) {
    console.error(`Failed to search r/${subreddit}:`, response.status);
    return [];
  }

  const data = await response.json();
  
  return (data.data?.children || []).map((child: { data: RedditPost }) => child.data);
}

/**
 * Search across multiple subreddits for posts matching keywords
 */
export async function searchReddit(
  subreddits: string[],
  keywords: string[],
  options: { limit?: number; time?: string } = {}
): Promise<Lead[]> {
  const { limit = 10, time = 'week' } = options;
  
  const allPosts: RedditPost[] = [];
  const seenIds = new Set<string>();

  // Search each subreddit with each keyword
  for (const subreddit of subreddits) {
    for (const keyword of keywords) {
      try {
        const posts = await searchSubreddit(subreddit, keyword, { limit, time });
        
        // Deduplicate posts
        for (const post of posts) {
          if (!seenIds.has(post.id)) {
            seenIds.add(post.id);
            allPosts.push(post);
          }
        }
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error searching r/${subreddit} for "${keyword}":`, error);
      }
    }
  }

  // Transform to our Lead format
  const leads: Lead[] = allPosts.map(post => ({
    id: post.id,
    title: post.title,
    body: post.selftext || '',
    subreddit: post.subreddit,
    url: `https://www.reddit.com${post.permalink}`,
    score: post.score,
    author: post.author,
    created: post.created_utc * 1000, // Convert to milliseconds
    numComments: post.num_comments,
  }));

  // Sort by score (highest first)
  leads.sort((a, b) => b.score - a.score);

  return leads;
}

/**
 * Get hot/new posts from specific subreddits (no search query)
 */
export async function getSubredditPosts(
  subreddits: string[],
  options: { sort?: 'hot' | 'new' | 'top'; limit?: number } = {}
): Promise<Lead[]> {
  const { sort = 'hot', limit = 25 } = options;
  
  const allPosts: RedditPost[] = [];
  const seenIds = new Set<string>();

  for (const subreddit of subreddits) {
    try {
      const response = await redditFetch(`/r/${subreddit}/${sort}?limit=${limit}`);
      
      if (!response.ok) {
        console.error(`Failed to get r/${subreddit}:`, response.status);
        continue;
      }

      const data = await response.json();
      const posts = (data.data?.children || []).map((child: { data: RedditPost }) => child.data);
      
      for (const post of posts) {
        if (!seenIds.has(post.id)) {
          seenIds.add(post.id);
          allPosts.push(post);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error getting r/${subreddit}:`, error);
    }
  }

  // Transform to Lead format
  return allPosts.map(post => ({
    id: post.id,
    title: post.title,
    body: post.selftext || '',
    subreddit: post.subreddit,
    url: `https://www.reddit.com${post.permalink}`,
    score: post.score,
    author: post.author,
    created: post.created_utc * 1000,
    numComments: post.num_comments,
  }));
}

/**
 * Check if Reddit API is configured
 */
export function isRedditConfigured(): boolean {
  return !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
}

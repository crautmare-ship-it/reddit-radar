/**
 * Database storage utilities for Redd Radar
 * Uses Vercel Postgres to persist product and keyword settings
 * All data is scoped to individual users via user_id
 */

import { sql, isDatabaseConfigured, initializeDatabase } from './db';

// Type definitions for our data structures
export interface ProductSettings {
  name: string;
  description: string;
  website: string;
  targetAudience: string;
  features: string[];
}

export interface KeywordSettings {
  problemKeywords: string[];
  competitors: string[];
  subreddits: string[];
}

export interface ReplyHistory {
  id: number;
  postTitle: string;
  postBody: string;
  postUrl: string;
  subreddit: string;
  generatedReply: string;
  replyTone: string;
  tokensUsed: number;
  createdAt: string;
}

export interface UsageStats {
  totalReplies: number;
  totalTokens: number;
  estimatedCost: number;
  month: string;
}

export interface ReplyTemplate {
  id: number;
  name: string;
  tone: string;
  instructions: string;
  isDefault: boolean;
}

// Track if database has been initialized
let dbInitialized = false;

/**
 * Ensure database tables exist before operations
 */
async function ensureDatabase() {
  if (dbInitialized) return;
  
  const isConfigured = await isDatabaseConfigured();
  if (!isConfigured) {
    throw new Error('Database not configured. Please set POSTGRES_URL environment variable.');
  }
  
  await initializeDatabase();
  dbInitialized = true;
}

/**
 * Product settings storage using Vercel Postgres
 * All operations are scoped to a specific user_id
 */
export const productStorage = {
  async get(userId: string): Promise<ProductSettings | null> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT name, description, website, target_audience, features 
        FROM product_settings 
        WHERE user_id = ${userId}
        ORDER BY id DESC 
        LIMIT 1
      `;
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        name: row.name,
        description: row.description || '',
        website: row.website,
        targetAudience: row.target_audience,
        features: row.features || [],
      };
    } catch (error) {
      console.error('Error reading product settings:', error);
      return null;
    }
  },
  
  async save(userId: string, data: ProductSettings): Promise<void> {
    await ensureDatabase();
    
    // Check if a record exists for this user
    const existing = await sql`SELECT id FROM product_settings WHERE user_id = ${userId} LIMIT 1`;
    
    // Convert features array to PostgreSQL array format
    const featuresArray = JSON.stringify(data.features).replace('[', '{').replace(']', '}').replace(/"/g, '');
    
    if (existing.rows.length > 0) {
      // Update existing record
      await sql`
        UPDATE product_settings 
        SET name = ${data.name},
            description = ${data.description},
            website = ${data.website}, 
            target_audience = ${data.targetAudience},
            features = ${featuresArray}::text[],
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
      `;
    } else {
      // Insert new record for this user
      await sql`
        INSERT INTO product_settings (user_id, name, description, website, target_audience, features)
        VALUES (${userId}, ${data.name}, ${data.description}, ${data.website}, ${data.targetAudience}, ${featuresArray}::text[])
      `;
    }
  },
};

/**
 * Keyword settings storage using Vercel Postgres
 * All operations are scoped to a specific user_id
 */
export const keywordStorage = {
  async get(userId: string): Promise<KeywordSettings | null> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT problem_keywords, competitors, subreddits 
        FROM keyword_settings 
        WHERE user_id = ${userId}
        ORDER BY id DESC 
        LIMIT 1
      `;
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        problemKeywords: row.problem_keywords || [],
        competitors: row.competitors || [],
        subreddits: row.subreddits || [],
      };
    } catch (error) {
      console.error('Error reading keyword settings:', error);
      return null;
    }
  },
  
  async save(userId: string, data: KeywordSettings): Promise<void> {
    await ensureDatabase();
    
    // Check if a record exists for this user
    const existing = await sql`SELECT id FROM keyword_settings WHERE user_id = ${userId} LIMIT 1`;
    
    // Convert arrays to PostgreSQL array format
    const problemKeywordsArray = JSON.stringify(data.problemKeywords).replace('[', '{').replace(']', '}').replace(/"/g, '');
    const competitorsArray = JSON.stringify(data.competitors).replace('[', '{').replace(']', '}').replace(/"/g, '');
    const subredditsArray = JSON.stringify(data.subreddits).replace('[', '{').replace(']', '}').replace(/"/g, '');
    
    if (existing.rows.length > 0) {
      // Update existing record
      await sql`
        UPDATE keyword_settings 
        SET problem_keywords = ${problemKeywordsArray}::text[], 
            competitors = ${competitorsArray}::text[], 
            subreddits = ${subredditsArray}::text[],
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
      `;
    } else {
      // Insert new record for this user
      await sql`
        INSERT INTO keyword_settings (user_id, problem_keywords, competitors, subreddits)
        VALUES (${userId}, ${problemKeywordsArray}::text[], ${competitorsArray}::text[], ${subredditsArray}::text[])
      `;
    }
  },
};

/**
 * Reply history storage
 */
export const replyHistoryStorage = {
  async save(userId: string, data: {
    postTitle: string;
    postBody: string;
    postUrl: string;
    subreddit: string;
    generatedReply: string;
    replyTone: string;
    tokensUsed: number;
  }): Promise<void> {
    await ensureDatabase();
    
    await sql`
      INSERT INTO reply_history (user_id, post_title, post_body, post_url, subreddit, generated_reply, reply_tone, tokens_used)
      VALUES (${userId}, ${data.postTitle}, ${data.postBody}, ${data.postUrl}, ${data.subreddit}, ${data.generatedReply}, ${data.replyTone}, ${data.tokensUsed})
    `;
  },
  
  async getAll(userId: string, limit: number = 50): Promise<ReplyHistory[]> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT id, post_title, post_body, post_url, subreddit, generated_reply, reply_tone, tokens_used, created_at
        FROM reply_history
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      
      return result.rows.map(row => ({
        id: row.id,
        postTitle: row.post_title,
        postBody: row.post_body || '',
        postUrl: row.post_url,
        subreddit: row.subreddit,
        generatedReply: row.generated_reply,
        replyTone: row.reply_tone,
        tokensUsed: row.tokens_used || 0,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error('Error reading reply history:', error);
      return [];
    }
  },
  
  async delete(userId: string, id: number): Promise<void> {
    await ensureDatabase();
    await sql`DELETE FROM reply_history WHERE id = ${id} AND user_id = ${userId}`;
  },
};

/**
 * Usage stats storage
 */
export const usageStatsStorage = {
  async increment(userId: string, tokensUsed: number): Promise<void> {
    await ensureDatabase();
    
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    await sql`
      INSERT INTO usage_stats (user_id, month, total_replies, total_tokens)
      VALUES (${userId}, ${month}, 1, ${tokensUsed})
      ON CONFLICT (user_id, month)
      DO UPDATE SET 
        total_replies = usage_stats.total_replies + 1,
        total_tokens = usage_stats.total_tokens + ${tokensUsed},
        updated_at = CURRENT_TIMESTAMP
    `;
  },
  
  async get(userId: string): Promise<UsageStats> {
    try {
      await ensureDatabase();
      
      const month = new Date().toISOString().slice(0, 7);
      
      const result = await sql`
        SELECT total_replies, total_tokens, month
        FROM usage_stats
        WHERE user_id = ${userId} AND month = ${month}
      `;
      
      if (result.rows.length === 0) {
        return { totalReplies: 0, totalTokens: 0, estimatedCost: 0, month };
      }
      
      const row = result.rows[0];
      const totalTokens = row.total_tokens || 0;
      // GPT-4o-mini pricing: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
      // Estimate average: ~$0.30 per 1M tokens
      const estimatedCost = (totalTokens / 1000000) * 0.30;
      
      return {
        totalReplies: row.total_replies || 0,
        totalTokens,
        estimatedCost: Math.round(estimatedCost * 1000) / 1000,
        month: row.month,
      };
    } catch (error) {
      console.error('Error reading usage stats:', error);
      return { totalReplies: 0, totalTokens: 0, estimatedCost: 0, month: new Date().toISOString().slice(0, 7) };
    }
  },
  
  async getAllTime(userId: string): Promise<{ totalReplies: number; totalTokens: number; estimatedCost: number }> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT COALESCE(SUM(total_replies), 0) as total_replies, COALESCE(SUM(total_tokens), 0) as total_tokens
        FROM usage_stats
        WHERE user_id = ${userId}
      `;
      
      const row = result.rows[0];
      const totalTokens = parseInt(row.total_tokens) || 0;
      const estimatedCost = (totalTokens / 1000000) * 0.30;
      
      return {
        totalReplies: parseInt(row.total_replies) || 0,
        totalTokens,
        estimatedCost: Math.round(estimatedCost * 1000) / 1000,
      };
    } catch (error) {
      console.error('Error reading all-time usage:', error);
      return { totalReplies: 0, totalTokens: 0, estimatedCost: 0 };
    }
  },
};

/**
 * Reply templates storage
 */
export const templateStorage = {
  async getAll(userId: string): Promise<ReplyTemplate[]> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT id, name, tone, instructions, is_default
        FROM reply_templates
        WHERE user_id = ${userId}
        ORDER BY is_default DESC, created_at ASC
      `;
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        tone: row.tone,
        instructions: row.instructions || '',
        isDefault: row.is_default || false,
      }));
    } catch (error) {
      console.error('Error reading templates:', error);
      return [];
    }
  },
  
  async save(userId: string, data: { name: string; tone: string; instructions: string; isDefault?: boolean }): Promise<void> {
    await ensureDatabase();
    
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await sql`UPDATE reply_templates SET is_default = false WHERE user_id = ${userId}`;
    }
    
    await sql`
      INSERT INTO reply_templates (user_id, name, tone, instructions, is_default)
      VALUES (${userId}, ${data.name}, ${data.tone}, ${data.instructions}, ${data.isDefault || false})
    `;
  },
  
  async delete(userId: string, id: number): Promise<void> {
    await ensureDatabase();
    await sql`DELETE FROM reply_templates WHERE id = ${id} AND user_id = ${userId}`;
  },
  
  async setDefault(userId: string, id: number): Promise<void> {
    await ensureDatabase();
    await sql`UPDATE reply_templates SET is_default = false WHERE user_id = ${userId}`;
    await sql`UPDATE reply_templates SET is_default = true WHERE id = ${id} AND user_id = ${userId}`;
  },
};

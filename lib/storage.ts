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

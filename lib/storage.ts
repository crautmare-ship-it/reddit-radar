/**
 * Database storage utilities for Redd Radar
 * Uses Vercel Postgres to persist product and keyword settings
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
 */
export const productStorage = {
  async get(): Promise<ProductSettings | null> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT name, description, website, target_audience, features 
        FROM product_settings 
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
  
  async save(data: ProductSettings): Promise<void> {
    await ensureDatabase();
    
    // Check if a record exists
    const existing = await sql`SELECT id FROM product_settings LIMIT 1`;
    
    if (existing.rows.length > 0) {
      // Update existing record
      await sql`
        UPDATE product_settings 
        SET name = ${data.name},
            description = ${data.description},
            website = ${data.website}, 
            target_audience = ${data.targetAudience},
            features = ${data.features},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.rows[0].id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO product_settings (name, description, website, target_audience, features)
        VALUES (${data.name}, ${data.description}, ${data.website}, ${data.targetAudience}, ${data.features})
      `;
    }
  },
};

/**
 * Keyword settings storage using Vercel Postgres
 */
export const keywordStorage = {
  async get(): Promise<KeywordSettings | null> {
    try {
      await ensureDatabase();
      
      const result = await sql`
        SELECT problem_keywords, competitors, subreddits 
        FROM keyword_settings 
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
  
  async save(data: KeywordSettings): Promise<void> {
    await ensureDatabase();
    
    // Check if a record exists
    const existing = await sql`SELECT id FROM keyword_settings LIMIT 1`;
    
    if (existing.rows.length > 0) {
      // Update existing record
      await sql`
        UPDATE keyword_settings 
        SET problem_keywords = ${data.problemKeywords}, 
            competitors = ${data.competitors}, 
            subreddits = ${data.subreddits},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.rows[0].id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO keyword_settings (problem_keywords, competitors, subreddits)
        VALUES (${data.problemKeywords}, ${data.competitors}, ${data.subreddits})
      `;
    }
  },
};

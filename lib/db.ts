/**
 * Database layer for Reddit Radar using Vercel Postgres
 * Handles product and keyword settings storage in PostgreSQL
 */

import { sql } from '@vercel/postgres';
import { ProductSettings, KeywordSettings } from './storage';

/**
 * Initialize database tables if they don't exist
 * This is called automatically when database functions are used
 */
async function initializeTables() {
  try {
    // Create product_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS product_settings (
        id SERIAL PRIMARY KEY,
        product_name TEXT NOT NULL,
        product_website TEXT NOT NULL,
        target_audience TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create keyword_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS keyword_settings (
        id SERIAL PRIMARY KEY,
        problem_keywords JSONB DEFAULT '[]'::jsonb,
        competitors JSONB DEFAULT '[]'::jsonb,
        subreddits JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

/**
 * Get product settings from database
 */
export async function getProductSettings(): Promise<ProductSettings | null> {
  try {
    await initializeTables();
    
    const result = await sql`
      SELECT product_name, product_website, target_audience
      FROM product_settings
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      name: row.product_name as string,
      website: row.product_website as string,
      targetAudience: row.target_audience as string,
    };
  } catch (error) {
    console.error('Error fetching product settings from database:', error);
    throw error;
  }
}

/**
 * Save product settings to database
 */
export async function saveProductSettings(data: ProductSettings): Promise<void> {
  try {
    await initializeTables();
    
    // Check if a record exists
    const existing = await sql`
      SELECT id FROM product_settings LIMIT 1
    `;

    if (existing.rows.length > 0) {
      // Update existing record
      await sql`
        UPDATE product_settings
        SET product_name = ${data.name},
            product_website = ${data.website},
            target_audience = ${data.targetAudience},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.rows[0].id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO product_settings (product_name, product_website, target_audience)
        VALUES (${data.name}, ${data.website}, ${data.targetAudience})
      `;
    }
  } catch (error) {
    console.error('Error saving product settings to database:', error);
    throw error;
  }
}

/**
 * Get keyword settings from database
 */
export async function getKeywordSettings(): Promise<KeywordSettings | null> {
  try {
    await initializeTables();
    
    const result = await sql`
      SELECT problem_keywords, competitors, subreddits
      FROM keyword_settings
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      problemKeywords: row.problem_keywords as string[],
      competitors: row.competitors as string[],
      subreddits: row.subreddits as string[],
    };
  } catch (error) {
    console.error('Error fetching keyword settings from database:', error);
    throw error;
  }
}

/**
 * Save keyword settings to database
 */
export async function saveKeywordSettings(data: KeywordSettings): Promise<void> {
  try {
    await initializeTables();
    
    // Check if a record exists
    const existing = await sql`
      SELECT id FROM keyword_settings LIMIT 1
    `;

    if (existing.rows.length > 0) {
      // Update existing record
      await sql`
        UPDATE keyword_settings
        SET problem_keywords = ${JSON.stringify(data.problemKeywords)}::jsonb,
            competitors = ${JSON.stringify(data.competitors)}::jsonb,
            subreddits = ${JSON.stringify(data.subreddits)}::jsonb,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.rows[0].id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO keyword_settings (problem_keywords, competitors, subreddits)
        VALUES (
          ${JSON.stringify(data.problemKeywords)}::jsonb,
          ${JSON.stringify(data.competitors)}::jsonb,
          ${JSON.stringify(data.subreddits)}::jsonb
        )
      `;
    }
  } catch (error) {
    console.error('Error saving keyword settings to database:', error);
    throw error;
  }
}

/**
 * Check if database is configured (has required environment variables)
 */
export function isDatabaseConfigured(): boolean {
  // Vercel Postgres automatically sets these environment variables
  // when you connect a database to your project
  return !!(
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

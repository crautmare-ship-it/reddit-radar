/**
 * Vercel Postgres database utilities for Redd Radar
 * Handles database connection and schema initialization
 */

import { sql } from '@vercel/postgres';

/**
 * Initialize the database schema
 * Creates tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    // Create product_settings table with user_id for multi-user support
    await sql`
      CREATE TABLE IF NOT EXISTS product_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        website VARCHAR(500) NOT NULL,
        target_audience TEXT NOT NULL,
        features TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add new columns if they don't exist (for existing databases)
    try {
      await sql`ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
      await sql`ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}'`;
      await sql`ALTER TABLE product_settings ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)`;
      // Create index on user_id for faster lookups
      await sql`CREATE INDEX IF NOT EXISTS idx_product_settings_user_id ON product_settings(user_id)`;
    } catch {
      // Columns might already exist, ignore errors
    }

    // Create keyword_settings table with user_id for multi-user support
    await sql`
      CREATE TABLE IF NOT EXISTS keyword_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        problem_keywords TEXT[] DEFAULT '{}',
        competitors TEXT[] DEFAULT '{}',
        subreddits TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add user_id column to keyword_settings if it doesn't exist
    try {
      await sql`ALTER TABLE keyword_settings ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)`;
      // Create index on user_id for faster lookups
      await sql`CREATE INDEX IF NOT EXISTS idx_keyword_settings_user_id ON keyword_settings(user_id)`;
    } catch {
      // Column might already exist, ignore errors
    }

    // Create reply_history table for saving generated replies
    await sql`
      CREATE TABLE IF NOT EXISTS reply_history (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        post_title TEXT NOT NULL,
        post_body TEXT DEFAULT '',
        post_url TEXT NOT NULL,
        subreddit VARCHAR(255) NOT NULL,
        generated_reply TEXT NOT NULL,
        reply_tone VARCHAR(50) DEFAULT 'helpful',
        tokens_used INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_reply_history_user_id ON reply_history(user_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_reply_history_created_at ON reply_history(created_at DESC)`;
    } catch {
      // Indexes might already exist
    }

    // Create usage_stats table for tracking AI usage
    await sql`
      CREATE TABLE IF NOT EXISTS usage_stats (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        total_replies INTEGER DEFAULT 0,
        total_tokens INTEGER DEFAULT 0,
        month VARCHAR(7) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, month)
      )
    `;
    
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_usage_stats_user_id ON usage_stats(user_id)`;
    } catch {
      // Index might already exist
    }

    // Create reply_templates table for custom templates
    await sql`
      CREATE TABLE IF NOT EXISTS reply_templates (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        tone VARCHAR(50) NOT NULL,
        instructions TEXT DEFAULT '',
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_reply_templates_user_id ON reply_templates(user_id)`;
    } catch {
      // Index might already exist
    }

    console.log('Database schema initialized successfully');
    return { success: true };
  } catch (error: unknown) {
    // Ignore "already exists" errors (race condition on first load)
    const dbError = error as { code?: string };
    if (dbError.code === '23505' || dbError.code === '42P07') {
      console.log('Database tables already exist');
      return { success: true };
    }
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Check if the database is configured and accessible
 */
export async function isDatabaseConfigured(): Promise<boolean> {
  try {
    // Check if POSTGRES_URL is set
    if (!process.env.POSTGRES_URL) {
      return false;
    }
    // Try a simple query to verify connection
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export { sql };

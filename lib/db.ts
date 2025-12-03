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
    // Create product_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS product_settings (
        id SERIAL PRIMARY KEY,
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
    } catch {
      // Columns might already exist, ignore errors
    }

    // Create keyword_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS keyword_settings (
        id SERIAL PRIMARY KEY,
        problem_keywords TEXT[] DEFAULT '{}',
        competitors TEXT[] DEFAULT '{}',
        subreddits TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

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

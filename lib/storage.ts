/**
 * Storage utilities for Reddit Radar
 * Uses Vercel Postgres database when available, falls back to in-memory storage
 * 
 * Note: File-based storage has been replaced with database storage for production.
 * In-memory fallback is used for local development without database setup.
 */

import {
  isDatabaseConfigured,
  getProductSettings as dbGetProduct,
  saveProductSettings as dbSaveProduct,
  getKeywordSettings as dbGetKeywords,
  saveKeywordSettings as dbSaveKeywords,
} from './db';

// Type definitions for our data structures
export interface ProductSettings {
  name: string;
  website: string;
  targetAudience: string;
}

export interface KeywordSettings {
  problemKeywords: string[];
  competitors: string[];
  subreddits: string[];
}

// In-memory storage fallback for local development without database
let memoryProductSettings: ProductSettings | null = null;
let memoryKeywordSettings: KeywordSettings | null = null;

// Flag to track if we've shown the warning
let hasShownWarning = false;

/**
 * Show warning once if database is not configured
 */
function warnIfNoDatabaseConfigured() {
  if (!hasShownWarning && !isDatabaseConfigured()) {
    console.warn(
      '⚠️  Database not configured. Using in-memory storage (data will not persist).\n' +
      '   For production, set up Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres'
    );
    hasShownWarning = true;
  }
}

/**
 * Product settings storage
 * Uses database when configured, otherwise falls back to in-memory storage
 */
export const productStorage = {
  async get(): Promise<ProductSettings | null> {
    if (isDatabaseConfigured()) {
      try {
        return await dbGetProduct();
      } catch (error) {
        console.error('Database error, falling back to in-memory storage:', error);
        warnIfNoDatabaseConfigured();
        return memoryProductSettings;
      }
    }
    warnIfNoDatabaseConfigured();
    return memoryProductSettings;
  },
  async save(data: ProductSettings): Promise<void> {
    if (isDatabaseConfigured()) {
      try {
        await dbSaveProduct(data);
        return;
      } catch (error) {
        console.error('Database error, falling back to in-memory storage:', error);
        warnIfNoDatabaseConfigured();
        memoryProductSettings = data;
        return;
      }
    }
    warnIfNoDatabaseConfigured();
    memoryProductSettings = data;
  },
};

/**
 * Keyword settings storage
 * Uses database when configured, otherwise falls back to in-memory storage
 */
export const keywordStorage = {
  async get(): Promise<KeywordSettings | null> {
    if (isDatabaseConfigured()) {
      try {
        return await dbGetKeywords();
      } catch (error) {
        console.error('Database error, falling back to in-memory storage:', error);
        warnIfNoDatabaseConfigured();
        return memoryKeywordSettings;
      }
    }
    warnIfNoDatabaseConfigured();
    return memoryKeywordSettings;
  },
  async save(data: KeywordSettings): Promise<void> {
    if (isDatabaseConfigured()) {
      try {
        await dbSaveKeywords(data);
        return;
      } catch (error) {
        console.error('Database error, falling back to in-memory storage:', error);
        warnIfNoDatabaseConfigured();
        memoryKeywordSettings = data;
        return;
      }
    }
    warnIfNoDatabaseConfigured();
    memoryKeywordSettings = data;
  },
};

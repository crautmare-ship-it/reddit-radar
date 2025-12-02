/**
 * Simple file-based storage utilities for Reddit Radar
 * Uses JSON files to persist product and keyword settings
 */

import { promises as fs } from 'fs';
import path from 'path';

// Storage directory path
const DATA_DIR = path.join(process.cwd(), 'data');

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

/**
 * Ensures the data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Reads data from a JSON file
 */
async function readJSON<T>(filename: string): Promise<T | null> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist or is invalid, return null
    return null;
  }
}

/**
 * Writes data to a JSON file
 */
async function writeJSON<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Product settings storage
 */
export const productStorage = {
  async get(): Promise<ProductSettings | null> {
    return readJSON<ProductSettings>('product.json');
  },
  async save(data: ProductSettings): Promise<void> {
    return writeJSON('product.json', data);
  },
};

/**
 * Keyword settings storage
 */
export const keywordStorage = {
  async get(): Promise<KeywordSettings | null> {
    return readJSON<KeywordSettings>('keywords.json');
  },
  async save(data: KeywordSettings): Promise<void> {
    return writeJSON('keywords.json', data);
  },
};

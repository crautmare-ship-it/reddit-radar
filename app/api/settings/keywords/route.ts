/**
 * API Route: Keyword Settings
 * 
 * GET  /api/settings/keywords - Retrieve saved keywords and subreddits
 * POST /api/settings/keywords - Save keywords and subreddits
 * 
 * All data is scoped to the authenticated user
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { keywordStorage, KeywordSettings } from '@/lib/storage';

/**
 * GET handler - Retrieve keyword settings for the current user
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const keywords = await keywordStorage.get(userId);
    
    if (!keywords) {
      // Return empty keyword settings if none exist
      return NextResponse.json({
        problemKeywords: [],
        competitors: [],
        subreddits: [],
      });
    }
    
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Error reading keyword settings:', error);
    return NextResponse.json(
      { error: 'Failed to read keyword settings' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Save keyword settings for the current user
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Helper function to parse textarea input (one item per line)
    const parseTextarea = (text: string): string[] => {
      if (!text || typeof text !== 'string') return [];
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    };
    
    const keywordData: KeywordSettings = {
      problemKeywords: parseTextarea(body.problemKeywords || ''),
      competitors: parseTextarea(body.competitors || ''),
      subreddits: parseTextarea(body.subreddits || ''),
    };
    
    await keywordStorage.save(userId, keywordData);
    
    return NextResponse.json({
      success: true,
      message: 'Keyword settings saved successfully',
      data: keywordData,
    });
  } catch (error) {
    console.error('Error saving keyword settings:', error);
    return NextResponse.json(
      { error: 'Failed to save keyword settings' },
      { status: 500 }
    );
  }
}

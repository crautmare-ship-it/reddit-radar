/**
 * API Route: Usage Stats
 * 
 * GET /api/usage - Get usage statistics for the current user
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { usageStatsStorage } from '@/lib/storage';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const [currentMonth, allTime] = await Promise.all([
      usageStatsStorage.get(userId),
      usageStatsStorage.getAllTime(userId),
    ]);
    
    return NextResponse.json({
      currentMonth,
      allTime,
    });
  } catch (error) {
    console.error('Error reading usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to read usage stats' },
      { status: 500 }
    );
  }
}

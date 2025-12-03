/**
 * API Route: Reply History
 * 
 * GET    /api/history - Get all reply history
 * DELETE /api/history - Delete a reply from history
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { replyHistoryStorage } from '@/lib/storage';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const history = await replyHistoryStorage.getAll(userId);
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error reading history:', error);
    return NextResponse.json(
      { error: 'Failed to read history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await replyHistoryStorage.delete(userId, parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting history:', error);
    return NextResponse.json(
      { error: 'Failed to delete history' },
      { status: 500 }
    );
  }
}

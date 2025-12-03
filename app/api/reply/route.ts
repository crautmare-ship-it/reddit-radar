/**
 * API Route: Generate Reply
 * 
 * POST /api/reply - Generate an AI reply for a Reddit post
 * 
 * Uses the authenticated user's product settings
 * Saves generated replies to history and tracks usage
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateReply } from '@/lib/ai';
import { productStorage, replyHistoryStorage, usageStatsStorage } from '@/lib/storage';

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
    
    const { postTitle, postBody, subreddit, replyStyle, postUrl } = body;
    
    if (!postTitle || !subreddit) {
      return NextResponse.json(
        { error: 'postTitle and subreddit are required' },
        { status: 400 }
      );
    }

    // Get product settings for the current user
    const product = await productStorage.get(userId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not configured. Please set up your product in Settings first.' },
        { status: 400 }
      );
    }

    // Generate the reply with full product context
    const result = await generateReply({
      postTitle,
      postBody: postBody || '',
      subreddit,
      productName: product.name,
      productDescription: product.description || `A solution for ${product.targetAudience}`,
      productWebsite: product.website,
      targetAudience: product.targetAudience,
      productFeatures: product.features || [],
      replyStyle: replyStyle || 'helpful',
    });

    // Save to history (async, don't wait)
    if (postUrl) {
      replyHistoryStorage.save(userId, {
        postTitle,
        postBody: postBody || '',
        postUrl,
        subreddit,
        generatedReply: result.reply,
        replyTone: result.tone,
        tokensUsed: result.tokensUsed,
      }).catch(err => console.error('Failed to save history:', err));
    }

    // Track usage (async, don't wait)
    if (result.tokensUsed > 0) {
      usageStatsStorage.increment(userId, result.tokensUsed)
        .catch(err => console.error('Failed to track usage:', err));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}

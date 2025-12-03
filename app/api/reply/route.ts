/**
 * API Route: Generate Reply
 * 
 * POST /api/reply - Generate an AI reply for a Reddit post
 */

import { NextResponse } from 'next/server';
import { generateReply, isAIConfigured } from '@/lib/ai';
import { productStorage } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { postTitle, postBody, subreddit, replyStyle } = body;
    
    if (!postTitle || !subreddit) {
      return NextResponse.json(
        { error: 'postTitle and subreddit are required' },
        { status: 400 }
      );
    }

    // Get product settings
    const product = await productStorage.get();
    
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}

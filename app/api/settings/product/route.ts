/**
 * API Route: Product Settings
 * 
 * GET  /api/settings/product - Retrieve saved product information
 * POST /api/settings/product - Save product information
 * 
 * All data is scoped to the authenticated user
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { productStorage, ProductSettings } from '@/lib/storage';

/**
 * GET handler - Retrieve product settings for the current user
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
    
    const product = await productStorage.get(userId);
    
    if (!product) {
      // Return empty product if none exists
      return NextResponse.json({
        name: '',
        description: '',
        website: '',
        targetAudience: '',
        features: [],
      });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error reading product settings:', error);
    return NextResponse.json(
      { error: 'Failed to read product settings' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Save product settings for the current user
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
    
    // Validate required fields
    if (!body.name || !body.website || !body.targetAudience) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const productData: ProductSettings = {
      name: body.name.trim(),
      description: (body.description || '').trim(),
      website: body.website.trim(),
      targetAudience: body.targetAudience.trim(),
      features: Array.isArray(body.features) ? body.features.map((f: string) => f.trim()).filter(Boolean) : [],
    };
    
    await productStorage.save(userId, productData);
    
    return NextResponse.json({
      success: true,
      message: 'Product settings saved successfully',
      data: productData,
    });
  } catch (error) {
    console.error('Error saving product settings:', error);
    return NextResponse.json(
      { error: 'Failed to save product settings' },
      { status: 500 }
    );
  }
}

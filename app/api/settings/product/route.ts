/**
 * API Route: Product Settings
 * 
 * GET  /api/settings/product - Retrieve saved product information
 * POST /api/settings/product - Save product information
 */

import { NextResponse } from 'next/server';
import { productStorage, ProductSettings } from '@/lib/storage';

/**
 * GET handler - Retrieve product settings
 */
export async function GET() {
  try {
    const product = await productStorage.get();
    
    if (!product) {
      // Return empty product if none exists
      return NextResponse.json({
        name: '',
        website: '',
        targetAudience: '',
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
 * POST handler - Save product settings
 */
export async function POST(request: Request) {
  try {
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
      website: body.website.trim(),
      targetAudience: body.targetAudience.trim(),
    };
    
    await productStorage.save(productData);
    
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

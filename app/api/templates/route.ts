/**
 * API Route: Reply Templates
 * 
 * GET    /api/templates - Get all templates
 * POST   /api/templates - Create a new template
 * DELETE /api/templates - Delete a template
 * PUT    /api/templates - Set a template as default
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { templateStorage } from '@/lib/storage';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const templates = await templateStorage.getAll(userId);
    
    // If no templates, return default ones
    if (templates.length === 0) {
      return NextResponse.json({
        templates: [
          { id: 0, name: 'Helpful', tone: 'helpful', instructions: 'Be genuinely helpful and focus on solving the problem.', isDefault: true },
          { id: 0, name: 'Casual', tone: 'casual', instructions: 'Use a friendly, conversational tone.', isDefault: false },
          { id: 0, name: 'Professional', tone: 'professional', instructions: 'Maintain a professional, business-like tone.', isDefault: false },
        ],
      });
    }
    
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json(
      { error: 'Failed to read templates' },
      { status: 500 }
    );
  }
}

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
    
    if (!body.name || !body.tone) {
      return NextResponse.json(
        { error: 'Name and tone are required' },
        { status: 400 }
      );
    }
    
    await templateStorage.save(userId, {
      name: body.name.trim(),
      tone: body.tone.trim(),
      instructions: (body.instructions || '').trim(),
      isDefault: body.isDefault || false,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
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
    
    await templateStorage.delete(userId, parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await templateStorage.setDefault(userId, body.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting default template:', error);
    return NextResponse.json(
      { error: 'Failed to set default template' },
      { status: 500 }
    );
  }
}

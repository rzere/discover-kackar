import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // List all files in the bucket (including subdirectories)
    const { data: files, error } = await supabaseAdmin.storage
      .from('images')
      .list('', {
        limit: 100,
        offset: 0
      });
    
    if (error) {
      console.error('Error listing files:', error);
      return NextResponse.json({ 
        error: 'Failed to list files',
        details: error.message 
      }, { status: 500 });
    }
    
    // Also check the uploads subdirectory specifically
    const { data: uploadsFiles, error: uploadsError } = await supabaseAdmin.storage
      .from('images')
      .list('uploads', {
        limit: 100,
        offset: 0
      });
    
    return NextResponse.json({
      success: true,
      rootFiles: files || [],
      uploadsFiles: uploadsFiles || [],
      uploadsError: uploadsError?.message || null
    });
    
  } catch (error) {
    console.error('Error checking bucket:', error);
    return NextResponse.json({ 
      error: 'Failed to check bucket',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

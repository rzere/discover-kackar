import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Check images table
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      return NextResponse.json({ 
        success: false, 
        error: imagesError.message,
        images: []
      });
    }
    
    // Check storage bucket
    const { data: storageFiles, error: storageError } = await supabaseAdmin.storage
      .from('images')
      .list();
    
    if (storageError) {
      console.error('Error fetching storage files:', storageError);
      return NextResponse.json({ 
        success: false, 
        error: storageError.message,
        images: images || [],
        storageFiles: []
      });
    }
    
    return NextResponse.json({ 
      success: true,
      images: images || [],
      storageFiles: storageFiles || [],
      imagesCount: images?.length || 0,
      storageCount: storageFiles?.length || 0
    });
    
  } catch (error) {
    console.error('Error in test-images API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      images: [],
      storageFiles: []
    });
  }
}

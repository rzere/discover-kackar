import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET() {
  try {
    // Use the same client as the dashboard
    const { data: images, error: imagesError } = await supabase
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
    
    // Also get count like dashboard does
    const { count: totalImages, error: countError } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting images:', countError);
      return NextResponse.json({ 
        success: false, 
        error: countError.message,
        images: images || [],
        count: 0
      });
    }
    
    return NextResponse.json({ 
      success: true,
      images: images || [],
      count: totalImages || 0,
      imagesCount: images?.length || 0
    });
    
  } catch (error) {
    console.error('Error in test-dashboard-client API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      images: [],
      count: 0
    });
  }
}

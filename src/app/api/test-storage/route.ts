import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return NextResponse.json({ 
        error: 'Failed to list buckets', 
        details: bucketsError.message 
      }, { status: 500 });
    }
    
    console.log('Available buckets:', buckets);
    
    // Check if 'images' bucket exists
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images');
    
    if (!imagesBucket) {
      return NextResponse.json({ 
        error: 'Images bucket not found',
        availableBuckets: buckets?.map(b => b.name) || [],
        message: 'Please create an "images" bucket in your Supabase dashboard'
      }, { status: 404 });
    }
    
    // List files in the images bucket (root)
    const { data: rootFiles, error: rootFilesError } = await supabaseAdmin.storage
      .from('images')
      .list('', {
        limit: 100,
        offset: 0
      });
    
    // List files in the uploads subfolder
    const { data: uploadsFiles, error: uploadsFilesError } = await supabaseAdmin.storage
      .from('images')
      .list('uploads', {
        limit: 100,
        offset: 0
      });
    
    const allFiles = [
      ...(rootFiles || []).map(file => ({ ...file, path: file.name })),
      ...(uploadsFiles || []).map(file => ({ ...file, path: `uploads/${file.name}` }))
    ];
    
    return NextResponse.json({
      success: true,
      bucket: imagesBucket,
      rootFiles: rootFiles || [],
      uploadsFiles: uploadsFiles || [],
      allFiles: allFiles,
      totalFiles: allFiles.length,
      message: 'Storage test successful'
    });
    
  } catch (error) {
    console.error('Error in storage test:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

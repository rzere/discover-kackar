import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('=== TEST UPLOAD START ===');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length);
    
    // Generate filename
    const timestamp = Date.now();
    const filename = `test_${timestamp}_${file.name}`;
    console.log('Generated filename:', filename);
    
    // Upload to Supabase
    const supabaseAdmin = getSupabaseAdmin();
    console.log('Supabase admin client created');
    
    // Try uploading to root first
    console.log('Attempting upload to root directory...');
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    console.log('Upload result:', { uploadData, uploadError });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ 
        error: 'Upload failed', 
        details: uploadError.message 
      }, { status: 500 });
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filename);
    
    console.log('Public URL:', publicUrl);
    console.log('=== TEST UPLOAD SUCCESS ===');
    
    return NextResponse.json({
      success: true,
      filename,
      publicUrl,
      message: 'Test upload successful'
    });
    
  } catch (error) {
    console.error('=== TEST UPLOAD ERROR ===', error);
    return NextResponse.json({ 
      error: 'Test upload failed',
      details: error.message 
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Test 1: Try to create a simple text file
    console.log('Testing simple text upload...');
    const testContent = 'Hello World!';
    const testBuffer = Buffer.from(testContent, 'utf8');
    
    const { data: textUpload, error: textError } = await supabaseAdmin.storage
      .from('images')
      .upload('test.txt', testBuffer, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: true
      });
    
    console.log('Text upload result:', { textUpload, textError });
    
    // Test 2: Try to list the bucket again
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('images')
      .list('', { limit: 100 });
    
    console.log('Files after text upload:', files);
    
    // Test 3: Try to get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl('test.txt');
    
    console.log('Public URL for test.txt:', publicUrl);
    
    return NextResponse.json({
      success: true,
      textUpload,
      textError: textError?.message || null,
      files: files || [],
      publicUrl,
      message: 'Debug test completed'
    });
    
  } catch (error) {
    console.error('Debug storage error:', error);
    return NextResponse.json({ 
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

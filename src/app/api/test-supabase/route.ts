import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    const supabaseAdmin = getSupabaseAdmin();
    console.log('Supabase admin client created');
    
    // Test database connection
    const { data: dbTest, error: dbError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError.message 
      }, { status: 500 });
    }
    
    console.log('Database connection successful');
    
    // Test storage connection
    const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets();
    
    if (storageError) {
      console.error('Storage connection error:', storageError);
      return NextResponse.json({ 
        error: 'Storage connection failed',
        details: storageError.message 
      }, { status: 500 });
    }
    
    console.log('Storage connection successful');
    console.log('Available buckets:', buckets?.map(b => b.name));
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      buckets: buckets?.map(b => b.name) || [],
      database: 'Connected',
      storage: 'Connected'
    });
    
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({ 
      error: 'Supabase test failed',
      details: error.message 
    }, { status: 500 });
  }
}

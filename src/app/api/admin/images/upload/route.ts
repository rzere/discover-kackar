import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Check if ImageMagick is available
function isImageMagickAvailable(): boolean {
  try {
    execSync('magick -version', { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execSync('convert -version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

// Image optimization function
async function optimizeImage(inputBuffer: Buffer, baseName: string): Promise<{
  mobile: { buffer: Buffer; size: number };
  tablet: { buffer: Buffer; size: number };
  desktop: { buffer: Buffer; size: number };
}> {
  const tempDir = join(process.cwd(), 'temp');
  const inputPath = join(tempDir, `${baseName}_original.jpg`);
  const outputDir = join(tempDir, 'optimized');
  
  // Create temp directories
  await mkdir(tempDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });
  
  // Write original file
  await writeFile(inputPath, inputBuffer);
  
  // Check if ImageMagick is available
  if (!isImageMagickAvailable()) {
    console.log('⚠️ ImageMagick not available, using original image for all sizes');
    return {
      mobile: { buffer: inputBuffer, size: inputBuffer.length },
      tablet: { buffer: inputBuffer, size: inputBuffer.length },
      desktop: { buffer: inputBuffer, size: inputBuffer.length }
    };
  }
  
  const sizes = [
    { suffix: 'mobile', width: 640, quality: 80 },
    { suffix: 'tablet', width: 1024, quality: 85 },
    { suffix: 'desktop', width: 1920, quality: 90 }
  ];
  
  const results: any = {};
  
  for (const { suffix, width, quality } of sizes) {
    const outputPath = join(outputDir, `${baseName}_${suffix}.webp`);
    
    try {
      // Try magick command first (ImageMagick v7)
      let command = `magick "${inputPath}" -resize ${width}x -quality ${quality} -format webp "${outputPath}"`;
      
      try {
        execSync(command, { stdio: 'ignore' });
      } catch (magickError) {
        console.log(`Magick failed, trying convert command...`);
        // Fallback to convert command (ImageMagick v6 or older)
        command = `convert "${inputPath}" -resize ${width}x -quality ${quality} -format webp "${outputPath}"`;
        execSync(command, { stdio: 'ignore' });
      }
      
      const optimizedBuffer = await import('fs').then(fs => fs.promises.readFile(outputPath));
      results[suffix] = {
        buffer: optimizedBuffer,
        size: optimizedBuffer.length
      };
      
      console.log(`✅ Optimized ${suffix}: ${Math.round(optimizedBuffer.length / 1024)}KB (${width}px wide)`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${suffix}:`, error);
      
      // If optimization fails, use original image as fallback
      console.log(`Using original image as fallback for ${suffix}`);
      const fallbackBuffer = await import('fs').then(fs => fs.promises.readFile(inputPath));
      results[suffix] = {
        buffer: fallbackBuffer,
        size: fallbackBuffer.length
      };
    }
  }
  
  return results;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting image upload process...');
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    // For now, let's skip authentication to test the upload
    // TODO: Implement proper authentication for API routes
    console.log('Skipping authentication for testing...');
    
    // Create a mock user with a valid UUID for testing
    const user = { id: '00000000-0000-0000-0000-000000000000' };
    console.log('Using test user:', user.id);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed.' }, { status: 400 });
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${timestamp}_${randomString}.${fileExtension}`;
    const optimizedFilename = `${timestamp}_${randomString}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Starting image upload...');
    console.log('Original file size:', Math.round(buffer.length / 1024 / 1024), 'MB');
    
    // For Vercel deployment, skip optimization and use original image
    // ImageMagick is not available in serverless environment
    console.log('⚠️ Skipping image optimization in serverless environment');
    const optimizedImages = {
      mobile: { buffer: buffer, size: buffer.length },
      tablet: { buffer: buffer, size: buffer.length },
      desktop: { buffer: buffer, size: buffer.length }
    };
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Upload optimized images to Supabase storage
    const uploadPromises = [];
    const uploadedFiles: any = {};
    
    // Determine content type based on file extension
    const contentType = fileExtension === 'png' ? 'image/png' : 
                       fileExtension === 'webp' ? 'image/webp' : 
                       fileExtension === 'avif' ? 'image/avif' : 'image/jpeg';
    
    // Upload single image (no optimization in serverless environment)
    uploadPromises.push(
      supabaseAdmin.storage
        .from('images')
        .upload(filename, buffer, {
          contentType: contentType,
          cacheControl: '3600',
          upsert: false
        })
        .then(result => {
          uploadedFiles.original = result;
          return result;
        })
    );
    
    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);
    
    // Check for upload errors
    const uploadErrors = uploadResults.filter(result => result.error);
    if (uploadErrors.length > 0) {
      console.error('Error uploading image:', uploadErrors);
      return NextResponse.json({ 
        error: 'Failed to upload image to storage', 
        details: uploadErrors[0]?.error?.message || 'Unknown upload error'
      }, { status: 500 });
    }
    
    console.log('Image uploaded successfully');

    // Get public URL for the uploaded image
    const imageUrl = supabaseAdmin.storage.from('images').getPublicUrl(filename).data.publicUrl;
    
    console.log('Generated public URL:', imageUrl);

    // Create simple data structure (no optimization in serverless)
    const imageData = {
      original: {
        size: file.size,
        path: imageUrl,
        filename: filename
      }
    };

    // Get image dimensions (we'll need to implement this differently for Supabase)
    // For now, we'll set them as null and can add dimension detection later
    let width: number | null = null;
    let height: number | null = null;

    // Parse tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null;

    // Save to database
    console.log('Saving image data to database...');
    console.log('Image data:', {
      filename: filename,
      original_filename: file.name,
      file_path: imageUrl,
      file_size: file.size,
      mime_type: contentType,
      category,
      uploaded_by: user.id
    });
    
    const { data, error } = await supabaseAdmin
      .from('images')
      .insert({
        filename: filename,
        original_filename: file.name,
        file_path: imageUrl,
        file_size: file.size,
        mime_type: contentType,
        width,
        height,
        category: category as any,
        alt_text: altText || null,
        caption: caption || null,
        tags: tagArray,
        is_optimized: false, // No optimization in serverless environment
        optimization_data: imageData,
        uploaded_by: null // Skip user association for now
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error saving image to database:', error);
      console.error('Database error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: 'Failed to save image', details: error.message }, { status: 500 });
    }
    
    console.log('Image saved to database successfully:', data);

    return NextResponse.json({ 
      image: data,
      upload_info: {
        original_size: Math.round(file.size / 1024 / 1024 * 100) / 100 + ' MB',
        file_type: contentType,
        optimization: 'Skipped (serverless environment)'
      },
      message: 'Image uploaded successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/images/upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

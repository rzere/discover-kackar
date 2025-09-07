import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getCurrentUser, isEditor } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canEdit = await isEditor(user.id);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}_${randomString}.${fileExtension}`;
    const optimizedFilename = `${timestamp}_${randomString}`;

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'images', 'uploads');
    const optimizedDir = join(process.cwd(), 'public', 'images', 'optimized');
    
    try {
      await mkdir(uploadDir, { recursive: true });
      await mkdir(optimizedDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save original file
    const filePath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Get image dimensions
    let width: number | null = null;
    let height: number | null = null;
    try {
      const identifyCommand = `identify -format "%wx%h" "${filePath}"`;
      const dimensions = execSync(identifyCommand, { encoding: 'utf8' }).trim();
      [width, height] = dimensions.split('x').map(Number);
    } catch (error) {
      console.warn('Could not get image dimensions:', error);
    }

    // Optimize image (create mobile, tablet, desktop versions)
    const optimizationData: any = {
      original: {
        size: file.size,
        path: `/images/uploads/${filename}`
      }
    };

    try {
      const sizes = [
        { suffix: 'mobile', width: 640, quality: 80 },
        { suffix: 'tablet', width: 1024, quality: 85 },
        { suffix: 'desktop', width: 1920, quality: 90 }
      ];

      for (const { suffix, width: targetWidth, quality } of sizes) {
        const outputPath = join(optimizedDir, `${optimizedFilename}_${suffix}.avif`);
        
        try {
          const convertCommand = `convert "${filePath}" -resize ${targetWidth}x -quality ${quality} -format avif "${outputPath}"`;
          execSync(convertCommand, { stdio: 'ignore' });
          
          const stats = await import('fs').then(fs => fs.promises.stat(outputPath));
          optimizationData[suffix] = {
            size: stats.size,
            path: `/images/optimized/${optimizedFilename}_${suffix}.avif`,
            width: targetWidth,
            quality
          };
        } catch (error) {
          console.warn(`Failed to create ${suffix} version:`, error);
        }
      }
    } catch (error) {
      console.warn('Image optimization failed:', error);
    }

    // Parse tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null;

    // Save to database
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('images')
      .insert({
        filename: filename,
        original_filename: file.name,
        file_path: `/images/uploads/${filename}`,
        file_size: file.size,
        mime_type: file.type,
        width,
        height,
        category: category as any,
        alt_text: altText || null,
        caption: caption || null,
        tags: tagArray,
        is_optimized: Object.keys(optimizationData).length > 1,
        optimization_data: optimizationData,
        uploaded_by: user.id
      })
      .select(`
        *,
        uploaded_by_profile:profiles!images_uploaded_by_fkey(*)
      `)
      .single();

    if (error) {
      console.error('Error saving image to database:', error);
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
    }

    return NextResponse.json({ 
      image: data,
      message: 'Image uploaded and optimized successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/images/upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

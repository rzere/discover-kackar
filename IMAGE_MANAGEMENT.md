# 🖼️ Image Management Guide

## Problem Solved
The repository was too large to push to GitHub due to 121+ high-resolution images (93 JPG, 15 PNG, 8 AVIF, 5 MP4). This guide explains how to manage images efficiently.

## Current Setup

### Gitignore Configuration
Large image files are now gitignored:
```
/public/images/*.jpg
/public/images/*.jpeg
/public/images/*.png
/public/images/*.avif
/public/images/*.webp
/public/images/*.mp4
```

### Essential Images (Always Kept)
- `placeholder.jpg` - Fallback image for missing assets
- `logo.*` - Brand logos
- `favicon.*` - Website favicon

## Development Workflow

### 1. Setup Images for Local Development
```bash
# Copy essential images from assets folder
node scripts/setup-images.js setup
```

This copies:
- 7 hero images for the main page
- 9 category images for the category grid
- Uses placeholder for missing images

### 2. Clean Up Images
```bash
# Remove all images except essentials
node scripts/setup-images.js clean
```

## Production Deployment

### Option 1: CDN Integration (Recommended)
1. Upload images to a CDN service:
   - **Cloudinary** (recommended for images)
   - **AWS S3 + CloudFront**
   - **Vercel Blob Storage**
   - **Google Cloud Storage**

2. Update `getImageUrl()` function:
```typescript
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/images/placeholder.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Use CDN URL in production
  if (process.env.NODE_ENV === 'production') {
    return `https://your-cdn.com/images/${imagePath}`;
  }
  
  return `/images/${imagePath}`;
}
```

### Option 2: Keep Images in Repository
If you prefer to keep images in the repository:
1. Remove image rules from `.gitignore`
2. Use Git LFS (Large File Storage):
```bash
git lfs track "*.jpg"
git lfs track "*.png"
git lfs track "*.avif"
git lfs track "*.webp"
git lfs track "*.mp4"
```

## Image Optimization

### Current Images Used
- **Hero Section**: 5 rotating landscape images
- **Categories**: 9 category-specific images
- **Gallery**: 50+ photos for the image gallery
- **Content**: Specific images for articles

### Optimization Recommendations
1. **Compress images** before uploading to CDN
2. **Use WebP format** for better compression
3. **Implement responsive images** with different sizes
4. **Add lazy loading** for gallery images

## File Structure
```
discoverkackar-website/
├── public/
│   └── images/
│       ├── placeholder.jpg (kept in repo)
│       └── [other images] (gitignored)
├── scripts/
│   └── setup-images.js (image management script)
├── src/
│   └── lib/
│       └── utils/
│           └── imageUtils.ts (image URL handling)
└── .gitignore (image exclusion rules)
```

## Benefits
- ✅ **Smaller repository** - Easy to push to GitHub
- ✅ **Faster clones** - No large image downloads
- ✅ **Better performance** - CDN delivery
- ✅ **Flexible deployment** - Easy to switch image sources
- ✅ **Development friendly** - Local images for development

## Next Steps
1. Run `node scripts/setup-images.js setup` to copy images locally
2. Test the website with local images
3. Choose a CDN service for production
4. Update the `getImageUrl()` function for production URLs
5. Deploy with optimized image delivery

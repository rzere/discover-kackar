// Utility functions for handling images in the Discover Kaçkar website

export function getImageUrl(imagePath: string, size: 'mobile' | 'tablet' | 'desktop' = 'desktop'): string {
  // Handle empty or invalid paths
  if (!imagePath) return '/images/placeholder.jpg';
  
  // If it's already a full URL (CDN, external), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For AVIF files, return as-is
  if (imagePath.endsWith('.avif')) {
    return `/images/${imagePath}`;
  }
  
  // For optimized images, use the responsive versions
  const baseName = imagePath.replace(/\.(jpg|jpeg|png)$/i, '');
  const optimizedPath = `/images/optimized/${baseName}_${size}.avif`;
  
  // Return optimized path (browser will fallback to original if optimized doesn't exist)
  return optimizedPath;
}

// Get responsive image URL based on screen size
export function getResponsiveImageUrl(imagePath: string, width?: number): string {
  if (!imagePath) return '/images/placeholder.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Determine size based on width or default to desktop
  let size: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (width) {
    if (width <= 640) size = 'mobile';
    else if (width <= 1024) size = 'tablet';
    else size = 'desktop';
  }
  
  return getImageUrl(imagePath, size);
}

export function getOptimizedImageUrl(imagePath: string, width: number, height?: number): string {
  // This would integrate with your image optimization service
  // For now, return the base URL
  return getImageUrl(imagePath);
}

export const imageCategories = {
  hero: 'hero',
  category: 'categories',
  content: 'content',
  gallery: 'gallery',
} as const;

export type ImageCategory = typeof imageCategories[keyof typeof imageCategories];

export function getImagesByCategory(category: ImageCategory): string[] {
  // Only use images that actually exist in the public/images directory
  const categoryImages = {
    hero: [
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
      'discover_over_the_clouds_eeff360dff.avif',
      'ayder_plateau_3_58bd958670.avif'
    ],
    categories: [
      'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg', // Nature & Adventure
      'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg', // Culture & Local Life
      'aa-01_edited.jpg', // Gastronomy
      'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg', // Music & Dance
      'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg', // Sustainable Tourism
      'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg', // Health & Wellness
      'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg', // Photography & Art
      'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg', // Educational & Research
      'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg'  // Events & Festivals
    ],
    content: [
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg', // Hero content
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg', // Adventure content
      'aa-01_edited.jpg', // Food content
      'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg', // Nature content
      'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg', // Cultural content
      'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg'  // Local life content
    ],
    gallery: [
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg',
      'aa-01_edited.jpg',
      'discover_over_the_clouds_eeff360dff.avif',
      'ayder_plateau_3_58bd958670.avif'
    ],
  };
  
  return categoryImages[category] || [];
}

// Placeholder function for uploading images in admin panel
export async function uploadImage(file: File, category: ImageCategory): Promise<string> {
  // Mock upload - in real implementation, this would upload to storage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${category}/${file.name}`);
    }, 2000);
  });
}

// Generate responsive image srcset
export function generateSrcSet(imagePath: string): string {
  const baseUrl = getImageUrl(imagePath);
  return `${baseUrl} 1x, ${baseUrl} 2x`;
}

// Get a random image from a category
export function getRandomImageFromCategory(category: ImageCategory): string {
  const images = getImagesByCategory(category);
  if (images.length === 0) return '/images/placeholder.jpg';
  return images[Math.floor(Math.random() * images.length)];
}

// Get a specific image by index from a category
export function getImageFromCategory(category: ImageCategory, index: number = 0): string {
  const images = getImagesByCategory(category);
  if (images.length === 0) return '/images/placeholder.jpg';
  return images[index % images.length];
}

// Get category-specific image for a given category slug or ID
export function getCategoryImage(categorySlugOrId: string): string {
  const categoryImages = {
    // By slug (from Supabase) - Updated with all 9 categories
    'nature': 'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
    'culture': 'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
    'gastronomy': 'aa-01_edited.jpg',
    'music-dance': 'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
    'sustainable-tourism': 'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
    'health-wellness': 'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
    'photography-art': 'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg',
    'educational-research': 'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg',
    'events-festivals': 'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg',
    // Legacy support for old slugs
    'adventure': 'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
    'accommodation': 'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
    'transportation': 'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
    // By ID (legacy support)
    '1': 'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg', // Nature & Adventure
    '2': 'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg', // Culture & Local Life
    '3': 'aa-01_edited.jpg', // Gastronomy
    '4': 'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg', // Music & Dance
    '5': 'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg', // Sustainable Tourism
    '6': 'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg', // Health & Wellness
    '7': 'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg', // Photography & Art
    '8': 'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg', // Educational & Research
    '9': 'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg'  // Events & Festivals
  };
  
  return categoryImages[categorySlugOrId as keyof typeof categoryImages] || '/images/placeholder.jpg';
}
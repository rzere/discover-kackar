// Utility functions for handling images in the Discover Kaçkar website

export function getImageUrl(imagePath: string): string {
  // Handle empty or invalid paths
  if (!imagePath) return '/images/placeholder.jpg';
  
  // If it's already a full URL (CDN, external), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For local images, serve from public/images
  // This works both in development and production when images are committed
  return `/images/${imagePath}`;
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
  // Real images from the assets folder organized by category
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
      'treking1.jpg', // Hiking content
      'rev-01.jpg', // Local life content
      'aa-02_edited.jpg', // Food content
      'Kackar_HiRes-nodumsports_moritzklee-MK_02101-2.jpg', // Adventure content
      'Kackar_HiRes-nodumsports_moritzklee-MK_02200-2.jpg', // Nature content
      'Kackar_HiRes-nodumsports_moritzklee-MK_02209-2.jpg'  // Cultural content
    ],
    gallery: [
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0051-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0064-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0107-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0145-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0149-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0160-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0210-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0244-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0259-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-DJI_0967-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-HYPERLAPSE_0001-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-LH6A1480-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-LH6A1570-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-LH6A1700-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02101-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02200-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02209-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02388-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02496-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02525-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02866-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_02906-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_03039-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_03101-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_03146-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_03196-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_03352-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_03917.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04619.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04638.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04647.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04660.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04688.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04700.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04743.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04749.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04810.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04835.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_04922.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05236.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05458.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05564.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05603.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05623.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05649.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_05671.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_09902-2.jpg',
      'Kackar_HiRes-nodumsports_moritzklee-MK_09945-2.jpg'
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

// Get category-specific image for a given category ID
export function getCategoryImage(categoryId: string): string {
  const categoryImages = {
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
  
  return categoryImages[categoryId as keyof typeof categoryImages] || getRandomImageFromCategory('categories');
}
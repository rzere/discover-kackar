import { useState, useEffect } from 'react';
import { getResponsiveImageUrl } from '@/lib/utils/imageUtils';

export function useResponsiveImage(imagePath: string) {
  const [imageUrl, setImageUrl] = useState(() => getResponsiveImageUrl(imagePath));

  useEffect(() => {
    const updateImageUrl = () => {
      const width = window.innerWidth;
      setImageUrl(getResponsiveImageUrl(imagePath, width));
    };

    // Set initial image URL
    updateImageUrl();

    // Add resize listener
    window.addEventListener('resize', updateImageUrl);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateImageUrl);
    };
  }, [imagePath]);

  return imageUrl;
}

// Hook to get the appropriate image size based on screen width
export function useImageSize() {
  const [size, setSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setSize('mobile');
      } else if (width <= 1024) {
        setSize('tablet');
      } else {
        setSize('desktop');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return size;
}

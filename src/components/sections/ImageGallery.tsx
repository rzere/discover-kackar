'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';

interface Image {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  category: string;
  is_optimized: boolean;
  created_at: string;
  updated_at: string;
}

export default function ImageGallery() {
  const locale = useLocale() as 'tr' | 'en';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/admin/images');
        const result = await response.json();
        
        if (response.ok && result.data) {
          // Deduplicate images by grouping by base name and selecting the largest version
          const deduplicatedImages = deduplicateImages(result.data);
          setImages(deduplicatedImages);
        } else {
          console.error('Error fetching images:', result.error);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  // Function to deduplicate images by base name and select the largest version
  const deduplicateImages = (imageList: Image[]) => {
    const imageGroups: { [key: string]: Image[] } = {};
    
    // Group images by their base name (without size suffix)
    imageList.forEach(image => {
      // Extract base name by removing size suffixes like _mobile, _tablet, _desktop
      const baseName = image.original_filename
        .replace(/_(mobile|tablet|desktop)\.(jpg|jpeg|png|webp|avif)$/i, '')
        .replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
      
      if (!imageGroups[baseName]) {
        imageGroups[baseName] = [];
      }
      imageGroups[baseName].push(image);
    });
    
    // For each group, select the image with the largest file size
    const deduplicatedImages: Image[] = [];
    Object.values(imageGroups).forEach(group => {
      if (group.length === 1) {
        // Only one image in group, use it
        deduplicatedImages.push(group[0]);
      } else {
        // Multiple images, select the one with largest file size
        const largestImage = group.reduce((prev, current) => 
          current.file_size > prev.file_size ? current : prev
        );
        deduplicatedImages.push(largestImage);
      }
    });
    
    // Sort by creation date (newest first)
    return deduplicatedImages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };
  
  // Show only first 12 images initially, or all if showAll is true
  const displayedImages = showAll ? images : images.slice(0, 12);

  const openModal = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayedImages.length) % displayedImages.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            {locale === 'tr' ? 'Kaçkar\'dan Kareler' : 'Glimpses of Kaçkar'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locale === 'tr' 
              ? 'Kaçkar Dağları\'nın büyüleyici manzaralarını keşfedin'
              : 'Discover the enchanting landscapes of the Kaçkar Mountains'
            }
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => openModal(image.file_path, index)}
              >
                <img
                  src={image.file_path}
                  alt={image.alt_text || image.original_filename || `Kaçkar ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    console.log('Image failed to load:', image.file_path);
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More/Less Button */}
        {!loading && images.length > 12 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-50 transition-colors shadow-lg border-2 border-primary"
            >
              {showAll 
                ? (locale === 'tr' ? 'Daha Az Göster' : 'Show Less')
                : (locale === 'tr' ? 'Daha Fazla Görüntüle' : 'View More Images')
              }
              <svg className={`w-5 h-5 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-7xl max-h-[90vh] mx-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <CaretLeft size={24} />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <CaretRight size={24} />
            </button>

            {/* Image */}
            <img
              src={displayedImages[currentIndex]?.file_path || selectedImage}
              alt={displayedImages[currentIndex]?.alt_text || displayedImages[currentIndex]?.original_filename || `Kaçkar ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              {currentIndex + 1} / {displayedImages.length}
            </div>
          </div>

          {/* Backdrop Click to Close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeModal}
          />
        </div>
      )}
    </section>
  );
}

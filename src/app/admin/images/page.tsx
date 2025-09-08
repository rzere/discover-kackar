// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
// Using API routes instead of direct Supabase calls
import { Plus, Upload, Trash, Eye, Download } from '@phosphor-icons/react';

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
  optimization_data?: {
    original: {
      size: number;
      path: string;
      filename: string;
    };
    mobile: {
      size: number;
      path: string;
      filename: string;
    };
    tablet: {
      size: number;
      path: string;
      filename: string;
    };
    desktop: {
      size: number;
      path: string;
      filename: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export default function AdminImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/images');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch images');
      }
      
      setImages(result.data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'admin-upload');

        // Upload to API
        const response = await fetch('/api/admin/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        console.log('Upload result:', result);

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Refresh images list
      fetchImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete image');
      }

      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image: ' + error.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate optimization statistics
  const optimizationStats = images.reduce((stats, image) => {
    if (image.is_optimized && image.optimization_data) {
      stats.totalOriginalSize += image.optimization_data.original.size;
      stats.totalOptimizedSize += image.optimization_data.mobile.size;
      stats.optimizedCount++;
    } else {
      stats.unoptimizedCount++;
    }
    return stats;
  }, {
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
    optimizedCount: 0,
    unoptimizedCount: 0
  });

  const compressionRatio = optimizationStats.totalOriginalSize > 0 
    ? Math.round((1 - optimizationStats.totalOptimizedSize / optimizationStats.totalOriginalSize) * 100)
    : 0;

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Images</h1>
          <p className="text-gray-600 mt-2">Manage website images and media</p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            <Upload size={20} />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      </div>

      {/* Optimization Statistics */}
      {images.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Optimization Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{optimizationStats.optimizedCount}</div>
              <div className="text-sm text-gray-600">Optimized Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{optimizationStats.unoptimizedCount}</div>
              <div className="text-sm text-gray-600">Original Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatFileSize(optimizationStats.totalOriginalSize)}</div>
              <div className="text-sm text-gray-600">Original Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{compressionRatio}%</div>
              <div className="text-sm text-gray-600">Space Saved</div>
            </div>
          </div>
          {optimizationStats.optimizedCount > 0 && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600">
                Optimized images are <span className="font-semibold text-green-600">{compressionRatio}% smaller</span> than originals!
              </span>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">Uploading images...</span>
            <span className="text-blue-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.file_path}`}
                alt={image.alt_text}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate mb-1">
                {image.original_filename}
              </h3>
              {image.is_optimized && image.optimization_data ? (
                <div className="text-sm text-gray-500 mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Original:</span>
                    <span className="text-xs font-medium">{formatFileSize(image.optimization_data.original.size)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Mobile:</span>
                    <span className="text-xs font-medium text-green-600">{formatFileSize(image.optimization_data.mobile.size)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Tablet:</span>
                    <span className="text-xs font-medium text-green-600">{formatFileSize(image.optimization_data.tablet.size)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Desktop:</span>
                    <span className="text-xs font-medium text-green-600">{formatFileSize(image.optimization_data.desktop.size)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-200">
                    <span className="text-xs text-gray-400">Compression:</span>
                    <span className="text-xs font-bold text-green-600">
                      {Math.round((1 - image.optimization_data.mobile.size / image.optimization_data.original.size) * 100)}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-2">
                  {formatFileSize(image.file_size)}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  image.is_optimized 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {image.is_optimized ? 'Optimized' : 'Original'}
                </span>
                <span className="text-xs text-gray-500">
                  {image.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded yet</h3>
          <p className="text-gray-500 mb-4">Upload your first image to get started</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Upload Images
          </button>
        </div>
      )}
    </div>
  );
}

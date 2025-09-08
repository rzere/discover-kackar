// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
// Using API routes instead of direct Supabase calls
import { Plus, PencilSimple, Trash, Eye, Upload, X, Image, Check } from '@phosphor-icons/react';

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface Category {
  id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  content?: {
    header?: string;
    bullets?: string[];
    body?: string;
  };
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  hero_image_id?: string;
  hero_image?: Image;
  created_at: string;
  updated_at: string;
}

interface Image {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  category: string;
  alt_text?: string;
  caption?: string;
  tags?: string[];
  is_optimized: boolean;
  optimization_data?: any;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

interface GroupedCategory {
  slug: string;
  locales: {
    [locale: string]: Category;
  };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<GroupedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from API...');
      const response = await fetch('/api/admin/categories');
      const result = await response.json();

      console.log('Categories fetch result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      
      console.log('Setting categories:', result.data);
      
      // Group categories by slug
      const groupedCategories = (result.data || []).reduce((acc: any, category: Category) => {
        if (!acc[category.slug]) {
          acc[category.slug] = {
            slug: category.slug,
            locales: {}
          };
        }
        acc[category.slug].locales[category.locale] = category;
        return acc;
      }, {});
      
      setCategories(Object.values(groupedCategories));
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete category');
      }

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category: ' + error.message);
    }
  };

  const handleSave = async (categoryData: Partial<Category>) => {
    try {
      // Clean up the data before sending - convert empty string to null for UUID fields
      const cleanedData = {
        ...categoryData,
        hero_image_id: categoryData.hero_image_id === '' ? null : categoryData.hero_image_id
      };

      let response;
      if (editingCategory) {
        // Check if we're changing the locale - if so, we need to create a new record
        if (editingCategory.locale !== categoryData.locale) {
          // Create new category for the new locale
          response = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanedData),
          });
        } else {
          // Update existing category (same locale)
          response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanedData),
          });
        }
      } else {
        // Create new category
        response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save category');
      }

      // If we uploaded an image, sync it across all locales of the same category
      if (cleanedData.hero_image_id && cleanedData.slug) {
        try {
          // Find all categories with the same slug but different locales
          const allCategories = await fetch('/api/admin/categories').then(res => res.json());
          if (allCategories.data) {
            const sameSlugCategories = allCategories.data.filter((cat: any) => 
              cat.slug === cleanedData.slug && cat.id !== result.data.id
            );
            
            // Update all other locales to use the same image
            for (const category of sameSlugCategories) {
              await fetch(`/api/admin/categories/${category.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  hero_image_id: cleanedData.hero_image_id
                }),
              });
            }
          }
        } catch (error) {
          console.error('Error syncing image across locales:', error);
          // Don't fail the main operation if sync fails
        }
      }

      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage content categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          onEditingCategoryChange={setEditingCategory}
        />
      )}

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((groupedCategory) => {
            const firstCategory = Object.values(groupedCategory.locales)[0];
            const availableLocales = Object.keys(groupedCategory.locales);
            
            return (
              <div key={groupedCategory.slug} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${firstCategory.color_theme} flex items-center justify-center`}>
                      <span className="text-white text-xl">📁</span>
                    </div>
                    {firstCategory.hero_image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border">
                        <img
                          src={firstCategory.hero_image.file_path}
                          alt={firstCategory.hero_image.alt_text || 'Category hero'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(firstCategory)}
                      className="text-primary hover:text-primary/80"
                    >
                      <PencilSimple size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(firstCategory.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{firstCategory.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{firstCategory.description}</p>
                
                {/* Language indicators */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    {availableLocales.map((locale) => (
                      <span
                        key={locale}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          locale === 'en' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {locale.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    firstCategory.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {firstCategory.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">Order: {firstCategory.sort_order}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">Create your first category to get started</p>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowForm(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Create Category
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryForm({ category, onSave, onCancel, onEditingCategoryChange }: { category: Category | null, onSave: (data: Partial<Category>) => void, onCancel: () => void, onEditingCategoryChange: (category: Category | null) => void }) {
  const [formData, setFormData] = useState({
    slug: category?.slug || '',
    locale: category?.locale || 'en',
    name: category?.name || '',
    description: category?.description || '',
    content: {
      header: category?.content?.header || '',
      bullets: category?.content?.bullets || [''],
      body: category?.content?.body || ''
    },
    icon_name: category?.icon_name || 'Folder',
    color_theme: category?.color_theme || 'from-blue-500 to-blue-600',
    sort_order: category?.sort_order || 1,
    is_active: category?.is_active ?? true,
    hero_image_id: category?.hero_image_id || null
  });

  const [loadingLocale, setLoadingLocale] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [availableImages, setAvailableImages] = useState<Image[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  // Function to fetch current image data
  const fetchCurrentImage = async (imageId: string) => {
    if (!imageId) return;
    
    try {
      const response = await fetch(`/api/admin/images/${imageId}`);
      const result = await response.json();
      
      if (response.ok && result.data) {
        setCurrentImage(result.data);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  // Function to fetch available images
  const fetchAvailableImages = async () => {
    setLoadingImages(true);
    try {
      const response = await fetch('/api/admin/images');
      if (response.ok) {
        const result = await response.json();
        setAvailableImages(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching available images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Function to select an existing image
  const handleSelectExistingImage = (image: Image) => {
    setFormData({...formData, hero_image_id: image.id});
    setCurrentImage(image);
    setShowImagePicker(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Function to handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Function to upload image
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    console.log('Starting image upload...');
    console.log('Selected image:', selectedImage.name, selectedImage.size, selectedImage.type);

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('category', 'category');
      formData.append('alt_text', `Hero image for ${formData.name || 'category'}`);
      formData.append('caption', `Category banner for ${formData.name || 'category'}`);

      console.log('Sending upload request to /api/admin/images/upload');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('Upload response body:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      // Update form data with new image ID
      setFormData(prev => ({
        ...prev,
        hero_image_id: result.image.id
      }));

      setCurrentImage(result.image);
      setSelectedImage(null);
      setImagePreview(null);
      setUploadProgress(100);

      // Clean up preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      console.log('Image upload completed successfully');

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Function to remove current image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      hero_image_id: null
    }));
    setCurrentImage(null);
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // Load current image when component mounts or hero_image_id changes
  useEffect(() => {
    if (formData.hero_image_id && formData.hero_image_id !== null) {
      // If we already have the hero_image data from the category, use it
      if (category?.hero_image) {
        setCurrentImage(category.hero_image);
      } else {
        // Otherwise fetch it
        fetchCurrentImage(formData.hero_image_id);
      }
    } else {
      setCurrentImage(null);
    }
  }, [formData.hero_image_id, category?.hero_image]);

  // Function to fetch category data for a specific locale
  const fetchCategoryByLocale = async (slug: string, locale: string) => {
    if (!slug) return null;
    
    try {
      setLoadingLocale(true);
      const response = await fetch(`/api/admin/categories/by-slug?slug=${encodeURIComponent(slug)}&locale=${encodeURIComponent(locale)}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch category');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching category by locale:', error);
      return null;
    } finally {
      setLoadingLocale(false);
    }
  };

  // Handle locale change
  const handleLocaleChange = async (newLocale: string) => {
    const currentSlug = formData.slug;
    
    // If we have a slug, try to fetch existing data for the new locale
    if (currentSlug) {
      const existingCategory = await fetchCategoryByLocale(currentSlug, newLocale);
      
      if (existingCategory) {
        // Load existing data for this locale and update editingCategory state
        const updatedCategory = {
          ...existingCategory,
          locale: newLocale
        };
        
        setFormData({
          ...formData,
          locale: newLocale,
          name: existingCategory.name || '',
          description: existingCategory.description || '',
          content: {
            header: existingCategory.content?.header || '',
            bullets: existingCategory.content?.bullets || [''],
            body: existingCategory.content?.body || ''
          },
          icon_name: existingCategory.icon_name || 'Folder',
          color_theme: existingCategory.color_theme || 'from-blue-500 to-blue-600',
          sort_order: existingCategory.sort_order || 1,
          is_active: existingCategory.is_active ?? true,
          hero_image_id: existingCategory.hero_image_id || null
        });
        
        // Set the current image if it exists
        if (existingCategory.hero_image) {
          setCurrentImage(existingCategory.hero_image);
        } else {
          setCurrentImage(null);
        }
        
        // Update the editingCategory state to reflect the current category being edited
        onEditingCategoryChange(updatedCategory);
      } else {
        // No existing data for this locale, clear the content fields but keep slug and other settings
        setFormData({
          ...formData,
          locale: newLocale,
          name: '',
          description: '',
          content: {
            header: '',
            bullets: [''],
            body: ''
          }
        });
        
        // Clear editingCategory since we're creating a new record for this locale
        onEditingCategoryChange(null);
      }
    } else {
      // No slug yet, just update the locale
      setFormData({
        ...formData,
        locale: newLocale
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  const colorThemes = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{category ? 'Edit Category' : 'Create New Category'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language {loadingLocale && <span className="text-sm text-gray-500">(Loading...)</span>}
            </label>
            <select
              value={formData.locale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              disabled={loadingLocale}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="en">English</option>
              <option value="tr">Turkish</option>
            </select>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 Hero Section Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Nature, Doğa, Culture, Kültür"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This appears as the main title in the hero section</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief description that appears in the hero section"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This appears as the description in the hero section</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Content</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
              <input
                type="text"
                value={formData.content.header}
                onChange={(e) => setFormData({
                  ...formData, 
                  content: {...formData.content, header: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Discover the Untamed Beauty of Kaçkar Mountains"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points</label>
              <div className="space-y-2">
                {formData.content.bullets.map((bullet, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => {
                        const newBullets = [...formData.content.bullets];
                        newBullets[index] = e.target.value;
                        setFormData({
                          ...formData,
                          content: {...formData.content, bullets: newBullets}
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Bullet point ${index + 1}`}
                    />
                    {formData.content.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newBullets = formData.content.bullets.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            content: {...formData.content, bullets: newBullets}
                          });
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      content: {...formData.content, bullets: [...formData.content.bullets, '']}
                    });
                  }}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
              <textarea
                value={formData.content.body}
                onChange={(e) => setFormData({
                  ...formData,
                  content: {...formData.content, body: e.target.value}
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Detailed description of the category..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
            <input
              type="text"
              value={formData.icon_name}
              onChange={(e) => setFormData({...formData, icon_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Leaf, Mountain, Users"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
          <div className="grid grid-cols-4 gap-2">
            {colorThemes.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setFormData({...formData, color_theme: theme})}
                className={`h-10 rounded-lg bg-gradient-to-r ${theme} ${
                  formData.color_theme === theme ? 'ring-2 ring-gray-400' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hero Image Upload Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Image</h3>
          
          {/* Current Image Display */}
          {currentImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
              <div className="relative inline-block">
                <img
                  src={currentImage.file_path}
                  alt={currentImage.alt_text || 'Category hero image'}
                  className="w-32 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {currentImage.original_filename} ({(currentImage.file_size / 1024 / 1024).toFixed(1)}MB)
              </p>
            </div>
          )}

          {/* Image Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ Hero Image</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowImagePicker(!showImagePicker);
                    if (!showImagePicker && availableImages.length === 0) {
                      fetchAvailableImages();
                    }
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Image size={16} className="mr-2" />
                  {showImagePicker ? 'Hide Gallery' : 'Choose from Gallery'}
                </button>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload size={16} className="mr-2" />
                  Upload New Image
                </label>
                
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
              
              {selectedImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(1)}MB)
                  </p>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Upload Progress */}
            {uploadingImage && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading and optimizing image...</p>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>• Supported formats: JPEG, PNG, WebP, AVIF</p>
              <p>• Maximum file size: 50MB</p>
              <p>• Images will be automatically optimized for mobile, tablet, and desktop</p>
            </div>
          </div>

          {/* Image Picker Gallery */}
          {showImagePicker && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Choose from Existing Images</h4>
              {loadingImages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-gray-600">Loading images...</span>
                </div>
              ) : availableImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                  {availableImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleSelectExistingImage(image)}
                      className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                        formData.hero_image_id === image.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.file_path}
                        alt={image.alt_text || image.original_filename}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg">
                        <div className="truncate">{image.original_filename}</div>
                        <div className="text-gray-300">
                          {image.is_optimized ? 'Optimized' : 'Original'} • {formatFileSize(image.file_size)}
                        </div>
                      </div>
                      {formData.hero_image_id === image.id && (
                        <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Image size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No images available</p>
                  <p className="text-sm">Upload some images first</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {category ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

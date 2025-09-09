'use client';

import { useState, useEffect } from 'react';
import { Plus, PencilSimple, Trash, Eye, Upload, X, Image, Check } from '@phosphor-icons/react';
import { Subcategory } from '@/lib/types/content';
import { supabase } from '@/lib/supabase-client';

// Helper function to safely render text (prevents object rendering)
const safeRenderText = (value: any, locale: string = 'en'): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    // Try to get the locale-specific version first
    if (value[locale]) {
      return String(value[locale]);
    }
    // Fallback to English
    if (value.en) {
      return String(value.en);
    }
    // Fallback to Turkish
    if (value.tr) {
      return String(value.tr);
    }
    // If it's an array, join it
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    // Last resort: stringify the object
    return JSON.stringify(value);
  }
  
  return String(value || '');
};

// Function to properly convert text to uppercase based on locale
const toLocaleUppercase = (text: string, locale: string = 'en'): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (locale === 'tr') {
    // Turkish uppercase conversion
    return text
      .replace(/i/g, 'İ')
      .replace(/ı/g, 'I')
      .replace(/ğ/g, 'Ğ')
      .replace(/ü/g, 'Ü')
      .replace(/ş/g, 'Ş')
      .replace(/ö/g, 'Ö')
      .replace(/ç/g, 'Ç')
      .toUpperCase();
  } else {
    // Standard uppercase for English and other languages
    return text.toUpperCase();
  }
};

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
  name: string;
  locale: string;
}

interface SubcategoryWithCategory extends Subcategory {
  category?: Category;
}

interface FormData {
  category_id: string;
  slug: string;
  title: { en: string; tr: string };
  body_text: { en: string; tr: string };
  sort_order: number;
  is_active: boolean;
  image_id: string | null;
  image_alt_text: string;
  image_caption: string;
}

export default function AdminSubcategories() {
  const [subcategories, setSubcategories] = useState<SubcategoryWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [originalCount, setOriginalCount] = useState<number>(0);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category_id: '',
    slug: '',
    title: { en: '', tr: '' },
    body_text: { en: '', tr: '' },
    sort_order: 0,
    is_active: true,
    image_id: null,
    image_alt_text: '',
    image_caption: ''
  });
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'tr'>('en');

  // Helper function to get current language text
  const getCurrentText = (textObj: { en: string; tr: string }) => {
    return textObj[currentLanguage] || '';
  };

  // Helper function to update text for current language
  const updateCurrentText = (textObj: { en: string; tr: string }, newValue: string) => {
    return { ...textObj, [currentLanguage]: newValue };
  };

  // Function to generate a unique slug
  const generateUniqueSlug = async (title: string, categoryId: string, excludeId?: string) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      // Check if slug exists for this category
      const { data: existing } = await (supabase as any)
        .from('subcategories')
        .select('id')
        .eq('category_id', categoryId)
        .eq('slug', slug)
        .neq('id', excludeId || '')
        .single();
      
      if (!existing) {
        return slug;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  // Function to deduplicate subcategories
  const deduplicateSubcategories = (subcategories: SubcategoryWithCategory[]) => {
    const seen = new Map<string, SubcategoryWithCategory>();
    const duplicates: string[] = [];
    
    for (const subcategory of subcategories) {
      // Create a unique key based on slug and category_id
      // This ensures we don't have duplicate subcategories with the same slug in the same category
      const key = `${subcategory.slug}-${subcategory.category_id}`;
      
      if (!seen.has(key)) {
        // First time seeing this combination, keep it
        seen.set(key, subcategory);
      } else {
        // Duplicate found, keep the one with the most recent updated_at
        duplicates.push(key);
        const existing = seen.get(key)!;
        const existingDate = new Date(existing.updated_at || existing.created_at || '');
        const currentDate = new Date(subcategory.updated_at || subcategory.created_at || '');
        
        if (currentDate > existingDate) {
          // Keep the newer one
          seen.set(key, subcategory);
          console.log(`Replacing duplicate: ${key} (keeping newer version)`);
        } else {
          console.log(`Skipping duplicate: ${key} (keeping existing version)`);
        }
      }
    }
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate subcategories:`, duplicates);
      console.log(`Original count: ${subcategories.length}, Deduplicated count: ${seen.size}`);
    }
    
    return Array.from(seen.values());
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/admin/subcategories');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch subcategories');
      }
      
      // Deduplicate subcategories based on slug and category_id
      const originalCount = result.data?.length || 0;
      const deduplicatedData = deduplicateSubcategories(result.data || []);
      const deduplicatedCount = deduplicatedData.length;
      
      setOriginalCount(originalCount);
      
      if (originalCount > deduplicatedCount) {
        console.log(`Deduplication: ${originalCount} → ${deduplicatedCount} subcategories`);
      }
      
      setSubcategories(deduplicatedData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      alert('Error fetching subcategories: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      
      console.log('Categories fetched:', result.data);
      setCategories(result.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    
    // Properly handle multilingual data
    const titleData = typeof subcategory.title === 'object' ? subcategory.title : { en: subcategory.title || '', tr: '' };
    const bodyTextData = typeof subcategory.body_text === 'object' ? subcategory.body_text : { en: subcategory.body_text || '', tr: '' };
    
    setFormData({
      category_id: subcategory.category_id,
      slug: subcategory.slug,
      title: { en: titleData.en || '', tr: titleData.tr || '' },
      body_text: { en: bodyTextData.en || '', tr: bodyTextData.tr || '' },
      sort_order: subcategory.sort_order,
      is_active: subcategory.is_active,
      image_id: subcategory.image_id || null,
      image_alt_text: subcategory.image?.alt_text || '',
      image_caption: subcategory.image?.caption || ''
    });
    setCurrentLanguage('en');
    setShowForm(true);
    
    // Scroll to top to show the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (newLanguage: 'en' | 'tr') => {
    setCurrentLanguage(newLanguage);
    // The form will automatically show the correct language data since it's stored in formData.title[newLanguage]
  };

  const handleTitleChange = (newTitle: string) => {
    setFormData(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [currentLanguage]: newTitle
      }
    }));
    
    // Auto-generate slug if creating new subcategory and slug is empty
    if (!editingSubcategory && !formData.slug && newTitle) {
      const baseSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        slug: baseSlug
      }));
    }
  };

  const handleCreateNew = () => {
    setEditingSubcategory(null);
    setFormData({
      category_id: '',
      slug: '',
      title: { en: '', tr: '' },
      body_text: { en: '', tr: '' },
      sort_order: 0,
      is_active: true,
      image_id: null,
      image_alt_text: '',
      image_caption: ''
    });
    setCurrentLanguage('en');
    setShowForm(true);
    
    // Scroll to top to show the create form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete subcategory');
      }

      fetchSubcategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Error deleting subcategory: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSave = async (subcategoryData: any) => {
    try {
      // Prepare the multilingual data
      let titleData = { en: '', tr: '' };
      let bodyTextData = { en: '', tr: '' };
      
      if (editingSubcategory) {
        // When editing, preserve existing data and update current language
        titleData = {
          en: (editingSubcategory.title as any)?.en || '',
          tr: (editingSubcategory.title as any)?.tr || '',
          [currentLanguage]: subcategoryData.title
        };
        bodyTextData = {
          en: (editingSubcategory.body_text as any)?.en || '',
          tr: (editingSubcategory.body_text as any)?.tr || '',
          [currentLanguage]: subcategoryData.body_text
        };
      } else {
        // When creating new, set current language data
        titleData[currentLanguage] = subcategoryData.title;
        bodyTextData[currentLanguage] = subcategoryData.body_text;
      }

      // Generate unique slug if creating new or if slug is empty
      let finalSlug = subcategoryData.slug;
      if (!editingSubcategory || !finalSlug) {
        finalSlug = await generateUniqueSlug(
          subcategoryData.title, 
          subcategoryData.category_id,
          editingSubcategory?.id
        );
      }

      const cleanedData = {
        category_id: subcategoryData.category_id,
        slug: finalSlug,
        title: titleData,
        body_text: bodyTextData,
        sort_order: subcategoryData.sort_order,
        is_active: subcategoryData.is_active,
        image_id: subcategoryData.image_id === '' ? null : subcategoryData.image_id,
        image_alt_text: subcategoryData.image_alt_text,
        image_caption: subcategoryData.image_caption
      };

      console.log('Saving subcategory with data:', cleanedData);
      console.log('Image ID being saved:', cleanedData.image_id);

      let response;
      if (editingSubcategory) {
        response = await fetch(`/api/admin/subcategories/${editingSubcategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });
      } else {
        response = await fetch('/api/admin/subcategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save subcategory');
      }


      setShowForm(false);
      setEditingSubcategory(null);
      setFormData({
        category_id: '',
        slug: '',
        title: { en: '', tr: '' },
        body_text: { en: '', tr: '' },
        sort_order: 0,
        is_active: true,
        image_id: null,
        image_alt_text: '',
        image_caption: ''
      });
      setCurrentLanguage('en');
      fetchSubcategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Error saving subcategory: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
          <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
          <p className="text-gray-600 mt-2">Manage subcategories for each category</p>
          {originalCount > subcategories.length && (
            <p className="text-sm text-blue-600 mt-1">
              📊 Showing {subcategories.length} unique subcategories (removed {originalCount - subcategories.length} duplicates)
            </p>
          )}
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Subcategory
        </button>
      </div>

      {showForm && (
        <SubcategoryForm
          subcategory={editingSubcategory}
          categories={categories}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingSubcategory(null);
          }}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => {
            try {
              return (
            <div key={subcategory.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {subcategory.image && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border">
                      <img
                        src={subcategory.image.file_path}
                        alt={subcategory.image.alt_text || 'Subcategory image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(subcategory)}
                    className="text-primary hover:text-primary/80"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {toLocaleUppercase(safeRenderText(subcategory.title), 'en')}
              </h3>
              <div className="text-gray-600 text-sm mb-2">
                <div className="line-clamp-2">
                  <span className="font-medium text-blue-600">EN:</span> {safeRenderText(subcategory.body_text, 'en')}
                </div>
                <div className="line-clamp-2">
                  <span className="font-medium text-green-600">TR:</span> {safeRenderText(subcategory.body_text, 'tr')}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="text-sm">
                  <span className="font-medium text-blue-600">EN:</span> {safeRenderText(subcategory.title, 'en')}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-green-600">TR:</span> {safeRenderText(subcategory.title, 'tr')}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  MULTILINGUAL
                </span>
                {subcategory.category && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {safeRenderText(subcategory.category.name)}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  subcategory.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subcategory.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {subcategory.sort_order}</span>
              </div>
            </div>
              );
            } catch (error) {
              console.error('Error rendering subcategory:', subcategory, error);
              return (
                <div key={subcategory.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">Error rendering subcategory: {subcategory.id}</p>
                  <p className="text-sm text-red-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subcategories found</h3>
          <p className="text-gray-500 mb-4">Create your first subcategory to get started</p>
          <button
            onClick={() => {
              setEditingSubcategory(null);
              setShowForm(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Create Subcategory
          </button>
        </div>
      )}
    </div>
  );
}

function SubcategoryForm({ 
  subcategory, 
  categories, 
  onSave, 
  onCancel,
  currentLanguage,
  onLanguageChange
}: { 
  subcategory: Subcategory | null, 
  categories: Category[],
  onSave: (data: Partial<Subcategory>) => void, 
  onCancel: () => void,
  currentLanguage: 'en' | 'tr',
  onLanguageChange: (language: 'en' | 'tr') => void
}) {
  const [formData, setFormData] = useState<FormData>({
    category_id: subcategory?.category_id || '',
    slug: subcategory?.slug || '',
    title: typeof subcategory?.title === 'object' ? subcategory.title : { en: subcategory?.title || '', tr: '' },
    body_text: typeof subcategory?.body_text === 'object' ? subcategory.body_text : { en: subcategory?.body_text || '', tr: '' },
    image_id: subcategory?.image_id || null,
    sort_order: subcategory?.sort_order || 1,
    is_active: subcategory?.is_active ?? true,
    image_alt_text: subcategory?.image?.alt_text || '',
    image_caption: subcategory?.image?.caption || ''
  });

  // Helper function to get current language text
  const getCurrentText = (textObj: { en: string; tr: string }) => {
    return textObj[currentLanguage] || '';
  };

  // Helper function to update text for current language
  const updateCurrentText = (textObj: { en: string; tr: string }, newValue: string) => {
    return { ...textObj, [currentLanguage]: newValue };
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  // Update form data when language changes
  useEffect(() => {
    if (subcategory) {
      const titleData = typeof subcategory.title === 'object' ? subcategory.title : { en: subcategory.title || '', tr: '' };
      const bodyTextData = typeof subcategory.body_text === 'object' ? subcategory.body_text : { en: subcategory.body_text || '', tr: '' };
      
      setFormData(prev => ({
        ...prev,
        title: titleData,
        body_text: bodyTextData
      }));
    }
  }, [currentLanguage, subcategory]);

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
  const handleSelectExistingImage = (image: any) => {
    setFormData({...formData, image_id: image.id});
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
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Function to handle title change and auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    setFormData(prev => ({
      ...prev,
      title: updateCurrentText(prev.title, newTitle)
    }));
    
    // Auto-generate slug if creating new subcategory and slug is empty
    if (!subcategory && !formData.slug && newTitle) {
      const baseSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        slug: baseSlug
      }));
    }
  };

  // Function to upload image
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedImage);
      uploadFormData.append('category', 'subcategory');
      uploadFormData.append('alt_text', formData.image_alt_text || getCurrentText(formData.title) || 'Subcategory image');
      uploadFormData.append('caption', formData.image_caption || '');

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      setFormData(prev => ({
        ...prev,
        image_id: result.image.id,
        image_alt_text: result.image.alt_text || '',
        image_caption: result.image.caption || ''
      }));
      
      console.log('Image uploaded, setting image_id:', result.image.id);
      console.log('Updated form data:', { ...formData, image_id: result.image.id });

      setCurrentImage(result.image);
      setSelectedImage(null);
      setImagePreview(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  // Function to remove current image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image_id: null
    }));
    setCurrentImage(null);
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        {subcategory ? 'Edit Subcategory' : 'Create New Subcategory'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {safeRenderText(category.name)} ({category.locale.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as 'en' | 'tr')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="tr">Turkish</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., hiking-trekking"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Active
            </label>
            <select
              value={formData.is_active ? 'true' : 'false'}
              onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title ({currentLanguage.toUpperCase()}) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={getCurrentText(formData.title)}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={currentLanguage === 'en' ? "e.g., Hiking & Trekking" : "e.g., Doğa Yürüyüşü & Trekking"}
            required
          />
          <p className="text-xs text-gray-500 mt-1">This will be displayed in ALL CAPS</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body Text ({currentLanguage.toUpperCase()}) <span className="text-red-500">*</span>
          </label>
          <textarea
            value={getCurrentText(formData.body_text)}
            onChange={(e) => setFormData({...formData, body_text: updateCurrentText(formData.body_text, e.target.value)})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={currentLanguage === 'en' ? "Detailed description of the subcategory..." : "Alt kategori için detaylı açıklama..."}
            required
          />
        </div>

        {/* Image Upload Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subcategory Image</h3>
          
          {/* Current Image Display */}
          {currentImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
              <div className="relative inline-block">
                <img
                  src={currentImage.file_path}
                  alt={currentImage.alt_text || 'Subcategory image'}
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

          {/* Image Alt Text and Caption - Only show when image is uploaded */}
          {currentImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={formData.image_alt_text}
                  onChange={(e) => setFormData({...formData, image_alt_text: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the image for accessibility"
                />
                <p className="text-xs text-gray-500 mt-1">Used for screen readers and accessibility</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Caption
                </label>
                <input
                  type="text"
                  value={formData.image_caption}
                  onChange={(e) => setFormData({...formData, image_caption: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Optional caption text (leave empty for no caption)"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to hide caption on the website</p>
              </div>
            </div>
          )}

          {/* Image Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ Subcategory Image</label>
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
                        formData.image_id === image.id
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
                      {formData.image_id === image.id && (
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
            {subcategory ? 'Update Subcategory' : 'Create Subcategory'}
          </button>
        </div>
      </form>
    </div>
  );
}

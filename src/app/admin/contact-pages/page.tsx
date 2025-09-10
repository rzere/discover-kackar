'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  PencilSimple, 
  Check, 
  X,
  FloppyDisk,
  Image,
  Upload,
  Trash
} from '@phosphor-icons/react';

interface ContactPageData {
  id: number;
  locale: string;
  hero_title: any;
  hero_subtitle: any;
  form_title: any;
  form_description: any;
  info_title: any;
  info_description: any;
  email_title: any;
  email_value: string;
  phone_title: any;
  phone_value: string;
  response_title: any;
  response_value: any;
  hero_background_image_id?: string;
  hero_background_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ContactPages() {
  const [contactPages, setContactPages] = useState<ContactPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<ContactPageData | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactPageData>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchContactPages();
  }, []);

  const fetchContactPages = async () => {
    try {
      const response = await fetch('/api/admin/contact-pages');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch contact pages');
      }

      setContactPages(result.data || []);
    } catch (error) {
      console.error('Error fetching contact pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: ContactPageData) => {
    setEditingPage(page);
    setEditForm({
      ...page,
      hero_title: typeof page.hero_title === 'string' ? page.hero_title : JSON.stringify(page.hero_title),
      hero_subtitle: typeof page.hero_subtitle === 'string' ? page.hero_subtitle : JSON.stringify(page.hero_subtitle),
      form_title: typeof page.form_title === 'string' ? page.form_title : JSON.stringify(page.form_title),
      form_description: typeof page.form_description === 'string' ? page.form_description : JSON.stringify(page.form_description),
      info_title: typeof page.info_title === 'string' ? page.info_title : JSON.stringify(page.info_title),
      info_description: typeof page.info_description === 'string' ? page.info_description : JSON.stringify(page.info_description),
      email_title: typeof page.email_title === 'string' ? page.email_title : JSON.stringify(page.email_title),
      phone_title: typeof page.phone_title === 'string' ? page.phone_title : JSON.stringify(page.phone_title),
      response_title: typeof page.response_title === 'string' ? page.response_title : JSON.stringify(page.response_title),
      response_value: typeof page.response_value === 'string' ? page.response_value : JSON.stringify(page.response_value),
    });
  };

  const handleSave = async () => {
    if (!editingPage) return;

    try {
      // Parse JSONB fields
      const updateData = {
        ...editForm,
        hero_title: JSON.parse(editForm.hero_title as string),
        hero_subtitle: JSON.parse(editForm.hero_subtitle as string),
        form_title: JSON.parse(editForm.form_title as string),
        form_description: JSON.parse(editForm.form_description as string),
        info_title: JSON.parse(editForm.info_title as string),
        info_description: JSON.parse(editForm.info_description as string),
        email_title: JSON.parse(editForm.email_title as string),
        phone_title: JSON.parse(editForm.phone_title as string),
        response_title: JSON.parse(editForm.response_title as string),
        response_value: JSON.parse(editForm.response_value as string),
      };

      const response = await fetch('/api/admin/contact-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingPage.id,
          ...updateData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update contact page');
      }

      // Update local state
      setContactPages(prev => 
        prev.map(page => 
          page.id === editingPage.id ? result.data : page
        )
      );

      setEditingPage(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating contact page:', error);
      alert('Error updating contact page: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setEditForm({});
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingPage) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'contact_hero');
      formData.append('alt_text', 'Contact page hero background');
      formData.append('caption', '');

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Upload response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      // Update the form with the new image data
      setEditForm(prev => ({
        ...prev,
        hero_background_image_id: result.image.id,
        hero_background_image_url: result.image.file_path,
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setEditForm(prev => ({
      ...prev,
      hero_background_image_id: undefined,
      hero_background_image_url: undefined,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Pages</h1>
        <p className="text-gray-600 mt-2">Manage multilingual contact page content</p>
      </div>

      <div className="space-y-6">
        {contactPages.map((page) => (
          <div key={page.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {page.locale.toUpperCase()} Contact Page
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    page.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {page.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => handleEdit(page)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <PencilSimple size={16} className="mr-2" />
                  Edit
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {editingPage?.id === page.id ? (
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Hero Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title (JSON)</label>
                        <textarea
                          value={editForm.hero_title as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, hero_title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (JSON)</label>
                        <textarea
                          value={editForm.hero_subtitle as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    {/* Background Image Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
                      <div className="flex items-center space-x-4">
                        {editForm.hero_background_image_url ? (
                          <div className="relative">
                            <img
                              src={editForm.hero_background_image_url}
                              alt="Hero background"
                              className="w-32 h-20 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <Image size={24} className="text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                            id="hero-image-upload"
                          />
                          <label
                            htmlFor="hero-image-upload"
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Upload size={16} className="mr-2" />
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended: 1920x1080px or similar aspect ratio
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Form Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title (JSON)</label>
                        <textarea
                          value={editForm.form_title as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, form_title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (JSON)</label>
                        <textarea
                          value={editForm.form_description as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, form_description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Title (JSON)</label>
                        <textarea
                          value={editForm.email_title as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email_title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Value</label>
                        <input
                          type="email"
                          value={editForm.email_value as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email_value: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Title (JSON)</label>
                        <textarea
                          value={editForm.phone_title as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone_title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Value</label>
                        <input
                          type="tel"
                          value={editForm.phone_value as string}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone_value: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FloppyDisk size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Hero Section</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Title:</strong> {typeof page.hero_title === 'object' ? JSON.stringify(page.hero_title) : page.hero_title}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Subtitle:</strong> {typeof page.hero_subtitle === 'object' ? JSON.stringify(page.hero_subtitle) : page.hero_subtitle}
                    </p>
                    {page.hero_background_image_url && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 mb-1">Background Image:</p>
                        <img
                          src={page.hero_background_image_url}
                          alt="Hero background"
                          className="w-24 h-16 object-cover rounded border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Info</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Email:</strong> {page.email_value}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Phone:</strong> {page.phone_value}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Created: {formatDate(page.created_at)}</span>
                <span>Updated: {formatDate(page.updated_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

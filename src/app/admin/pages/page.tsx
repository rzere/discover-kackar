// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
// Using API routes instead of direct Supabase calls
import { Plus, PencilSimple, Trash, Eye } from '@phosphor-icons/react';

interface Page {
  id: string;
  slug: string;
  locale: string;
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  content: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch pages');
      }
      
      setPages(result.data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete page');
      }

      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page: ' + error.message);
    }
  };

  const handleSave = async (pageData: Partial<Page>) => {
    try {
      let response;
      if (editingPage) {
        // Check if we're changing the locale - if so, we need to create a new record
        if (editingPage.locale !== pageData.locale) {
          // Create new page for the new locale
          response = await fetch('/api/admin/pages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pageData),
          });
        } else {
          // Update existing page (same locale)
          response = await fetch(`/api/admin/pages/${editingPage.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pageData),
          });
        }
      } else {
        // Create new page
        response = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save page');
      }

      setShowForm(false);
      setEditingPage(null);
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page: ' + error.message);
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
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600 mt-2">Manage website pages and content</p>
        </div>
        <button
          onClick={() => {
            setEditingPage(null);
            setShowForm(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Page
        </button>
      </div>

      {showForm && (
        <PageForm
          page={editingPage}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPage(null);
          }}
          onEditingPageChange={setEditingPage}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">/{page.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-primary hover:text-primary/80"
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PageForm({ page, onSave, onCancel, onEditingPageChange }: { page: Page | null, onSave: (data: Partial<Page>) => void, onCancel: () => void, onEditingPageChange: (page: Page | null) => void }) {
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    locale: page?.locale || 'en',
    title: page?.title || '',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    h1: page?.h1 || '',
    content: page?.content || {},
    status: page?.status || 'draft'
  });

  // Update form data when page prop changes
  useEffect(() => {
    if (page) {
      setFormData({
        slug: page.slug || '',
        locale: page.locale || 'en',
        title: page.title || '',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        h1: page.h1 || '',
        content: page.content || {},
        status: page.status || 'draft'
      });
    }
  }, [page]);

  const [loadingLocale, setLoadingLocale] = useState(false);

  // Function to fetch page data for a specific locale
  const fetchPageByLocale = async (slug: string, locale: string) => {
    if (!slug) return null;
    
    try {
      setLoadingLocale(true);
      const response = await fetch(`/api/admin/pages/by-slug?slug=${encodeURIComponent(slug)}&locale=${encodeURIComponent(locale)}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch page');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching page by locale:', error);
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
      const existingPage = await fetchPageByLocale(currentSlug, newLocale);
      
      if (existingPage) {
        // Load existing data for this locale and update editingPage state
        const updatedPage = {
          ...existingPage,
          locale: newLocale
        };
        
        setFormData({
          ...formData,
          locale: newLocale,
          title: existingPage.title || '',
          meta_title: existingPage.meta_title || '',
          meta_description: existingPage.meta_description || '',
          h1: existingPage.h1 || '',
          content: existingPage.content || {},
          status: existingPage.status || 'draft'
        });
        
        // Update the editingPage state to reflect the current page being edited
        onEditingPageChange(updatedPage);
      } else {
        // No existing data for this locale, clear the content fields but keep slug
        setFormData({
          ...formData,
          locale: newLocale,
          title: '',
          meta_title: '',
          meta_description: '',
          h1: '',
          content: {},
          status: 'draft'
        });
        
        // Clear editingPage since we're creating a new record for this locale
        onEditingPageChange(null);
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

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{page ? 'Edit Page' : 'Create New Page'}</h2>
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
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">H1</label>
          <input
            type="text"
            value={formData.h1}
            onChange={(e) => setFormData({...formData, h1: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Hero Section Content */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 Main Hero Section Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={formData.content?.subtitle || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  content: {...formData.content, subtitle: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Turkey's Hidden Mountain Paradise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
              <textarea
                value={formData.content?.description || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  content: {...formData.content, description: e.target.value}
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Main description text in the hero section"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Button</label>
                <input
                  type="text"
                  value={formData.content?.cta_primary || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    content: {...formData.content, cta_primary: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Explore Nature"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA Button</label>
                <input
                  type="text"
                  value={formData.content?.cta_secondary || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    content: {...formData.content, cta_secondary: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Discover Culture"
                />
              </div>
            </div>
          </div>

          {/* Hero Stats Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📊 Hero Section Stats</h3>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-green-800 mb-3">
                    Stat {index + 1} {index === 0 ? '(Compass Icon)' : index === 1 ? '(Mountains Icon)' : '(Camera Icon)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="text"
                        value={formData.content?.stats?.[index]?.value || ''}
                        onChange={(e) => {
                          const newStats = [...(formData.content?.stats || [])];
                          if (!newStats[index]) newStats[index] = { value: '', label: '' };
                          newStats[index].value = e.target.value;
                          setFormData({
                            ...formData, 
                            content: {...formData.content, stats: newStats}
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={index === 0 ? "3,937m" : index === 1 ? "50+" : "100+"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={formData.content?.stats?.[index]?.label || ''}
                        onChange={(e) => {
                          const newStats = [...(formData.content?.stats || [])];
                          if (!newStats[index]) newStats[index] = { value: '', label: '' };
                          newStats[index].label = e.target.value;
                          setFormData({
                            ...formData, 
                            content: {...formData.content, stats: newStats}
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={index === 0 ? "Highest Peak" : index === 1 ? "Alpine Lakes" : "Photo Spots"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section Content */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">📂 Categories Section Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories Section Title</label>
              <input
                type="text"
                value={formData.content?.categories_title || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  content: {...formData.content, categories_title: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Explore Categories"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories Section Description</label>
              <textarea
                value={formData.content?.categories_description || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  content: {...formData.content, categories_description: e.target.value}
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Discover every aspect of Kaçkar Mountains through our carefully curated categories, each offering unique experiences and adventures."
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
          <input
            type="text"
            value={formData.meta_title}
            onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
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
            {page ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
}

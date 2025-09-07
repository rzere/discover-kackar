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
        // Update existing page
        response = await fetch(`/api/admin/pages/${editingPage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData),
        });
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

function PageForm({ page, onSave, onCancel }: { page: Page | null, onSave: (data: Partial<Page>) => void, onCancel: () => void }) {
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Locale</label>
            <select
              value={formData.locale}
              onChange={(e) => setFormData({...formData, locale: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="tr">Turkish</option>
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

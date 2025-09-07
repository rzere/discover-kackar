// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
// Using API routes instead of direct Supabase calls
import { Plus, PencilSimple, Trash, Eye } from '@phosphor-icons/react';

interface Category {
  id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
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
      setCategories(result.data || []);
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
      let response;
      if (editingCategory) {
        // Update existing category
        response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Create new category
        response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save category');
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
        />
      )}

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color_theme} flex items-center justify-center`}>
                  <span className="text-white text-xl">📁</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-primary hover:text-primary/80"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              
              <div className="flex justify-between items-center">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  category.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {category.sort_order}</span>
              </div>
            </div>
          ))}
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

function CategoryForm({ category, onSave, onCancel }: { category: Category | null, onSave: (data: Partial<Category>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    slug: category?.slug || '',
    locale: category?.locale || 'en',
    name: category?.name || '',
    description: category?.description || '',
    icon_name: category?.icon_name || 'Folder',
    color_theme: category?.color_theme || 'from-blue-500 to-blue-600',
    sort_order: category?.sort_order || 1,
    is_active: category?.is_active ?? true
  });

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
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

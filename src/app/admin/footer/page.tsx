// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { PencilSimple, FloppyDisk, X } from '@phosphor-icons/react';

interface FooterData {
  id: string;
  locale: string;
  company_name: string;
  company_description: string;
  address: string;
  phone: string;
  email: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  quick_links: Array<{
    title: string;
    url: string;
  }>;
  legal_links: Array<{
    title: string;
    url: string;
  }>;
  copyright_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminFooter() {
  const [footerData, setFooterData] = useState<FooterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLocale, setEditingLocale] = useState<string | null>(null);
  const [formData, setFormData] = useState<FooterData>({
    id: '',
    locale: 'en',
    company_name: '',
    company_description: '',
    address: '',
    phone: '',
    email: '',
    social_links: {},
    quick_links: [],
    legal_links: [],
    copyright_text: '',
    is_active: true,
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/admin/footer');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch footer data');
      }
      
      setFooterData(result.data || []);
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (footer: FooterData) => {
    setFormData(footer);
    setEditingLocale(footer.locale);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save footer data');
      }

      await fetchFooterData();
      setEditingLocale(null);
    } catch (error) {
      console.error('Error saving footer data:', error);
      alert('Error saving footer data: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingLocale(null);
    setFormData({
      id: '',
      locale: 'en',
      company_name: '',
      company_description: '',
      address: '',
      phone: '',
      email: '',
      social_links: {},
      quick_links: [],
      legal_links: [],
      copyright_text: '',
      is_active: true,
      created_at: '',
      updated_at: ''
    });
  };

  const addQuickLink = () => {
    const newLinks = [...formData.quick_links, { title: '', url: '' }];
    setFormData({ ...formData, quick_links: newLinks });
  };

  const removeQuickLink = (index: number) => {
    const newLinks = formData.quick_links.filter((_, i) => i !== index);
    setFormData({ ...formData, quick_links: newLinks });
  };

  const updateQuickLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...formData.quick_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, quick_links: newLinks });
  };

  const addLegalLink = () => {
    const newLinks = [...formData.legal_links, { title: '', url: '' }];
    setFormData({ ...formData, legal_links: newLinks });
  };

  const removeLegalLink = (index: number) => {
    const newLinks = formData.legal_links.filter((_, i) => i !== index);
    setFormData({ ...formData, legal_links: newLinks });
  };

  const updateLegalLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...formData.legal_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, legal_links: newLinks });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
        <p className="text-gray-600 mt-2">Customize footer content for each language</p>
      </div>

      <div className="space-y-6">
        {footerData.map((footer) => (
          <div key={footer.locale} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Footer - {footer.locale.toUpperCase()}
                </h2>
                <p className="text-gray-600">
                  Last updated: {new Date(footer.updated_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleEdit(footer)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <PencilSimple size={20} />
                Edit
              </button>
            </div>

            {editingLocale === footer.locale ? (
              <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🏢 Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                    <textarea
                      value={formData.company_description}
                      onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">📱 Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={formData.social_links.facebook || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, facebook: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={formData.social_links.instagram || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                      <input
                        type="url"
                        value={formData.social_links.twitter || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, twitter: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                      <input
                        type="url"
                        value={formData.social_links.youtube || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, youtube: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-purple-900">🔗 Quick Links</h3>
                    <button
                      onClick={addQuickLink}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      Add Link
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.quick_links.map((link, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Link Title"
                          value={link.title}
                          onChange={(e) => updateQuickLink(index, 'title', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => removeQuickLink(index)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Links */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-orange-900">⚖️ Legal Links</h3>
                    <button
                      onClick={addLegalLink}
                      className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                    >
                      Add Link
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.legal_links.map((link, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Link Title"
                          value={link.title}
                          onChange={(e) => updateLegalLink(index, 'title', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateLegalLink(index, 'url', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => removeLegalLink(index)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copyright */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">© Copyright Text</h3>
                  <input
                    type="text"
                    value={formData.copyright_text}
                    onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FloppyDisk size={20} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Company</h3>
                  <p className="text-gray-600">{footer.company_name}</p>
                  <p className="text-sm text-gray-500 mt-1">{footer.company_description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600">{footer.email}</p>
                  <p className="text-gray-600">{footer.phone}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

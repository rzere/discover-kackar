'use client';

import { useState, useEffect } from 'react';
import { 
  ChatCircle, 
  PencilSimple, 
  FloppyDisk, 
  X, 
  Eye, 
  EyeSlash,
  Plus,
  Globe
} from '@phosphor-icons/react';

interface CTACard {
  id: number;
  slug: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  button_text: Record<string, string>;
  button_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CTACards() {
  const [ctaCards, setCtaCards] = useState<CTACard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<CTACard | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCTACards();
  }, []);

  const fetchCTACards = async () => {
    try {
      const response = await fetch('/api/admin/cta-cards');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch CTA cards');
      }

      setCtaCards(result.data || []);
    } catch (error) {
      console.error('Error fetching CTA cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: CTACard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleSave = async (cardData: Partial<CTACard>) => {
    try {
      const response = await fetch('/api/admin/cta-cards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCard?.id,
          ...cardData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update CTA card');
      }

      // Update local state
      setCtaCards(prev => 
        prev.map(card => 
          card.id === editingCard?.id 
            ? { ...card, ...cardData, updated_at: new Date().toISOString() }
            : card
        )
      );

      setShowForm(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Error saving CTA card:', error);
      alert('Error saving CTA card: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CTA Cards</h1>
        <p className="text-gray-600 mt-2">Manage call-to-action cards and button text</p>
      </div>

      {showForm && editingCard && (
        <CTACardForm
          card={editingCard}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCard(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            CTA Cards ({ctaCards.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {ctaCards.map((card) => (
            <div key={card.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      {card.slug}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      card.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {card.is_active ? (
                        <>
                          <Eye size={12} className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeSlash size={12} className="mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">English</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">Title:</span>
                          <p className="text-sm text-gray-900">{card.title.en}</p>
                        </div>
                        {card.description?.en && (
                          <div>
                            <span className="text-xs text-gray-500">Description:</span>
                            <p className="text-sm text-gray-900">{card.description.en}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-gray-500">Button Text:</span>
                          <p className="text-sm text-gray-900">{card.button_text.en}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Turkish</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">Title:</span>
                          <p className="text-sm text-gray-900">{card.title.tr}</p>
                        </div>
                        {card.description?.tr && (
                          <div>
                            <span className="text-xs text-gray-500">Description:</span>
                            <p className="text-sm text-gray-900">{card.description.tr}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-gray-500">Button Text:</span>
                          <p className="text-sm text-gray-900">{card.button_text.tr}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Globe size={14} />
                      {card.button_url}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Updated: {formatDate(card.updated_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button
                    onClick={() => handleEdit(card)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <PencilSimple size={16} className="mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CTACardFormProps {
  card: CTACard;
  onSave: (data: Partial<CTACard>) => void;
  onCancel: () => void;
}

function CTACardForm({ card, onSave, onCancel }: CTACardFormProps) {
  const [formData, setFormData] = useState({
    title_en: card.title.en,
    title_tr: card.title.tr,
    description_en: card.description?.en || '',
    description_tr: card.description?.tr || '',
    button_text_en: card.button_text.en,
    button_text_tr: card.button_text.tr,
    button_url: card.button_url,
    is_active: card.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: {
        en: formData.title_en,
        tr: formData.title_tr,
      },
      description: {
        en: formData.description_en,
        tr: formData.description_tr,
      },
      button_text: {
        en: formData.button_text_en,
        tr: formData.button_text_tr,
      },
      button_url: formData.button_url,
      is_active: formData.is_active,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit CTA Card</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">English</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_text_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Turkish */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Turkish</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title_tr}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_tr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description_tr}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_tr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text_tr}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_text_tr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button URL
              </label>
              <input
                type="text"
                value={formData.button_url}
                onChange={(e) => setFormData(prev => ({ ...prev, button_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FloppyDisk size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

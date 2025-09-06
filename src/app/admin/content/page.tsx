'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Plus,
  Pencil,
  Trash,
  Eye,
  MagnifyingGlass,
  FunnelSimple
} from '@phosphor-icons/react';
import { content } from '@/lib/data/mockData';

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="İçerik Yönetimi" 
            subtitle="Tüm içerikleri görüntüle ve düzenle"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="İçerik ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <FunnelSimple size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                    >
                      <option value="all">Tüm Kategoriler</option>
                      <option value="1">Doğa & Macera</option>
                      <option value="2">Kültür & Yerel Hayat</option>
                      <option value="3">Gastronomi</option>
                    </select>
                  </div>
                </div>

                <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Plus size={20} className="mr-2" />
                  Yeni İçerik
                </button>
              </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Başlık
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Güncelleme
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContent.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.title.tr}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.title.en}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                            {item.category === '1' ? 'Doğa & Macera' :
                             item.category === '2' ? 'Kültür & Yerel Hayat' :
                             item.category === '3' ? 'Gastronomi' : 'Diğer'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.published ? 'Yayında' : 'Taslak'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.updatedAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-gray-400 hover:text-primary transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="text-gray-400 hover:text-primary transition-colors">
                              <Pencil size={16} />
                            </button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredContent.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Henüz içerik bulunmuyor.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
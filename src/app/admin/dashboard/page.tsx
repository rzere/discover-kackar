'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
// import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FileText, 
  Image, 
  Users, 
  Eye, 
  Plus,
  ChartLine,
  Clock,
  CheckCircle
} from '@phosphor-icons/react';

interface DashboardStats {
  totalPages: number;
  totalImages: number;
  totalUsers: number;
  publishedPages: number;
  recentPages: any[];
  recentImages: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    totalImages: 0,
    totalUsers: 0,
    publishedPages: 0,
    recentPages: [],
    recentImages: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch pages count
        const { count: totalPages } = await supabase
          .from('pages')
          .select('*', { count: 'exact', head: true });

        const { count: publishedPages } = await supabase
          .from('pages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        // Fetch images count
        const { count: totalImages } = await supabase
          .from('images')
          .select('*', { count: 'exact', head: true });

        // Fetch users count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch recent pages
        const { data: recentPages } = await supabase
          .from('pages')
          .select(`
            id,
            title,
            slug,
            status,
            created_at,
            updated_at,
            created_by_profile:profiles!pages_created_by_fkey(full_name, email)
          `)
          .order('updated_at', { ascending: false })
          .limit(5);

        // Fetch recent images
        const { data: recentImages } = await supabase
          .from('images')
          .select(`
            id,
            filename,
            original_filename,
            category,
            file_size,
            created_at,
            uploaded_by_profile:profiles!images_uploaded_by_fkey(full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalPages: totalPages || 0,
          totalImages: totalImages || 0,
          totalUsers: totalUsers || 0,
          publishedPages: publishedPages || 0,
          recentPages: recentPages || [],
          recentImages: recentImages || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the Discover Kaçkar admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedPages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Image size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users size={24} className="text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Pages */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Pages</h2>
                <a
                  href="/admin/pages"
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  View all
                </a>
              </div>
            </div>
            <div className="p-6">
              {stats.recentPages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pages found</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentPages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-500">
                          {page.created_by_profile?.full_name || page.created_by_profile?.email} • {formatDate(page.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : page.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.status}
                        </span>
                        <a
                          href={`/admin/pages/${page.id}`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Eye size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Images */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Images</h2>
                <a
                  href="/admin/images"
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  View all
                </a>
              </div>
            </div>
            <div className="p-6">
              {stats.recentImages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No images found</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentImages.map((image) => (
                    <div key={image.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{image.original_filename}</p>
                        <p className="text-xs text-gray-500">
                          {image.uploaded_by_profile?.full_name || image.uploaded_by_profile?.email} • {formatFileSize(image.file_size)} • {formatDate(image.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/pages/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Plus size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create New Page</p>
                <p className="text-sm text-gray-500">Add a new page to your site</p>
              </div>
            </a>

            <a
              href="/admin/images/upload"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Image size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload Image</p>
                <p className="text-sm text-gray-500">Add new images to your library</p>
              </div>
            </a>

            <a
              href="/admin/categories/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <ChartLine size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Category</p>
                <p className="text-sm text-gray-500">Add a new content category</p>
              </div>
            </a>
          </div>
        </div>
      </div>
  );
}
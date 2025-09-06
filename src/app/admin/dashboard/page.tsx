'use client';

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Article,
  FolderSimple,
  Users,
  Eye,
  TrendUp,
  Calendar
} from '@phosphor-icons/react';

const stats = [
  {
    title: 'Toplam İçerik',
    value: '24',
    change: '+3',
    changeType: 'increase',
    icon: Article,
  },
  {
    title: 'Kategoriler',
    value: '9',
    change: '0',
    changeType: 'neutral',
    icon: FolderSimple,
  },
  {
    title: 'Görüntülenme',
    value: '1,432',
    change: '+12%',
    changeType: 'increase',
    icon: Eye,
  },
  {
    title: 'Aktif Kullanıcı',
    value: '89',
    change: '+5%',
    changeType: 'increase',
    icon: Users,
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'Yeni içerik eklendi',
    item: 'Kaçkar\'da Yürüyüş Rotaları',
    user: 'Admin',
    time: '2 saat önce',
  },
  {
    id: 2,
    action: 'Kategori güncellendi',
    item: 'Doğa & Macera',
    user: 'Admin',
    time: '5 saat önce',
  },
  {
    id: 3,
    action: 'İçerik yayınlandı',
    item: 'Hemşin Kültürü',
    user: 'Admin',
    time: '1 gün önce',
  },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="Dashboard" 
            subtitle="Sistem durumu ve güncel aktiviteler"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent size={24} className="text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold text-navy">{stat.value}</p>
                          <span
                            className={`ml-2 text-sm font-medium ${
                              stat.changeType === 'increase'
                                ? 'text-green-600'
                                : stat.changeType === 'decrease'
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-navy">Son Aktiviteler</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-navy">Hızlı İşlemler</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors text-left">
                      <Article size={24} className="text-primary mb-2" />
                      <p className="text-sm font-medium text-navy">Yeni İçerik</p>
                    </button>
                    <button className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors text-left">
                      <FolderSimple size={24} className="text-teal mb-2" />
                      <p className="text-sm font-medium text-navy">Kategori Ekle</p>
                    </button>
                    <button className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors text-left">
                      <TrendUp size={24} className="text-primary mb-2" />
                      <p className="text-sm font-medium text-navy">Analytics</p>
                    </button>
                    <button className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors text-left">
                      <Calendar size={24} className="text-teal mb-2" />
                      <p className="text-sm font-medium text-navy">Etkinlik Ekle</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
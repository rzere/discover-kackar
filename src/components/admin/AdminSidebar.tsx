'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  House,
  Article,
  Folder,
  Users,
  Gear,
  SignOut,
  ChartBar,
} from '@phosphor-icons/react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: House },
  { name: 'İçerik Yönetimi', href: '/admin/content', icon: Article },
  { name: 'Kategoriler', href: '/admin/categories', icon: Folder },
  { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
  { name: 'Analitik', href: '/admin/analytics', icon: ChartBar },
  { name: 'Ayarlar', href: '/admin/settings', icon: Gear },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-navy text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="text-xl font-serif font-bold">
          Discover Kaçkar
        </Link>
        <p className="text-primary text-sm mt-1">Yönetim Paneli</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-navy'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent size={20} className="mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-navy font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs text-white/60">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <SignOut size={16} className="mr-2" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
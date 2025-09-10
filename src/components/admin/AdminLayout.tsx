'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Database } from '@/lib/types/database';
import { User } from '@supabase/supabase-js';
import { 
  House, 
  FileText, 
  Image, 
  Gear, 
  Users, 
  SignOut,
  List,
  X,
  Layout,
  ChatCircle,
  Envelope,
  Globe
} from '@phosphor-icons/react';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  // const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Skip authentication check if we're on the login page
    if (window.location.pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/admin/login');
        return;
      }

      setUser(user);

      // For now, allow any authenticated user to access admin
      // You can add role checking later if needed
      console.log('User authenticated:', user.email);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: House },
    { name: 'Pages', href: '/admin/pages', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Users },
    { name: 'Subcategories', href: '/admin/subcategories', icon: Users },
    { name: 'Images', href: '/admin/images', icon: Image },
    { name: 'Footer', href: '/admin/footer', icon: Layout },
    { name: 'Contact Submissions', href: '/admin/contact-submissions', icon: Envelope },
    { name: 'CTA Cards', href: '/admin/cta-cards', icon: ChatCircle },
    { name: 'Contact Pages', href: '/admin/contact-pages', icon: Globe },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Gear },
  ];

  // If we're on the login page, just render children without admin layout
  if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-navy">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-navy"
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">admin</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-3 flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              <SignOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-navy">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-navy"
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">admin</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-3 flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              <SignOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 hover:text-gray-600"
          >
            <List size={24} />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-lg font-semibold text-navy">Admin Panel</h1>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="admin-layout">
        {children}
      </div>
    </AuthProvider>
  );
}
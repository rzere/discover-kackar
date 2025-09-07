// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // For now, allow any authenticated user to access admin
        // You can add role checking later if needed
        console.log('User logged in:', data.user.email);
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a, #0ea5e9, #0d9488)',
      padding: '48px 16px'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Admin Login
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
            Sign in to manage Discover Kaçkar content
          </p>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: '16px', 
          padding: '32px', 
          border: '1px solid rgba(255,255,255,0.2)' 
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.2)', 
                border: '1px solid rgba(239, 68, 68, 0.5)', 
                borderRadius: '8px', 
                padding: '12px', 
                marginBottom: '24px' 
              }}>
                <p style={{ color: '#fecaca', fontSize: '14px' }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.2)', 
                  border: '1px solid rgba(255,255,255,0.3)', 
                  borderRadius: '8px', 
                  color: 'white', 
                  fontSize: '16px' 
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.2)', 
                  border: '1px solid rgba(255,255,255,0.3)', 
                  borderRadius: '8px', 
                  color: 'white', 
                  fontSize: '16px' 
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'white', 
                color: '#1e3a8a', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '16px', 
                fontWeight: '500', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                opacity: loading ? 0.5 : 1 
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
              Need access? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

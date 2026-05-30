import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Client-side only — used by admin panel (public site uses static content)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
    : (null as unknown as ReturnType<typeof createClient<Database>>);

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to check if user is admin
export const isAdmin = async (userId: string) => {
  const profile = await getUserProfile(userId);
  return profile?.role === 'admin';
};

// Helper function to check if user is editor or admin
export const isEditor = async (userId: string) => {
  const profile = await getUserProfile(userId);
  return profile?.role === 'admin' || profile?.role === 'editor';
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Check:');
console.log('  URL:', supabaseUrl || 'Not set');
console.log('  Key:', supabaseAnonKey ? 'Set (length: ' + supabaseAnonKey.length + ')' : 'Not set');

// Check if Supabase is properly configured
const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseUrl.includes('supabase.co')
);

console.log('🔍 Configuration status:', isConfigured ? 'CONFIGURED' : 'NOT CONFIGURED');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

export const isSupabaseConfigured = isConfigured;

if (supabase) {
  console.log('✅ Supabase client created successfully');
} else {
  console.log('❌ Supabase client not created - using mock auth');
}
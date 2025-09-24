          import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { UserRole } from '../types/auth';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUserProfile = async (userId: string) => {
      console.log('🔍 Loading user profile for:', userId);
      
      // Get auth user first as fallback
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser || !mounted) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Create fallback user immediately
      const fallbackUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
        role: authUser.email === 'ezequiel.canton@stravix.io' ? 'ADMIN' as const : 'SALES' as const,
        status: 'ACTIVE' as const,
        created_at: authUser.created_at,
        updated_at: new Date().toISOString()
      };

      // Try to load from database with short timeout
      try {
        const { data: userProfile, error } = await Promise.race([
          supabase.from('users').select('*').eq('id', userId).maybeSingle(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]) as any;

        if (!error && userProfile && mounted) {
          console.log('✅ Database profile loaded:', userProfile);
          setUser(userProfile);
          setLoading(false);
          return;
        }
      } catch (dbError) {
        console.warn('⚠️ Database profile load failed, using fallback:', dbError);
      }

      // Use fallback user
      console.log('✅ Using fallback user:', fallbackUser);
      if (mounted) {
        setUser(fallbackUser);
        setLoading(false);
      }

      try {
        const profilePromise = supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile load timeout')), 10000);
        });

        const { data: userProfile, error } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (error) {
          console.warn('⚠️ Error loading user profile, using fallback:', error);
          // Don't return here, continue to fallback
        }

        if (!userProfile) {
          console.log('⚠️ No user profile found, creating fallback...');
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser && mounted) {
            const fallbackUser = {
              id: authUser.id,
              email: authUser.email || '',
              name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
              role: authUser.email === 'ezequiel.canton@stravix.io' ? 'ADMIN' as const : 'SALES' as const,
              status: 'ACTIVE' as const,
              created_at: authUser.created_at,
              updated_at: new Date().toISOString()
            };
            console.log('✅ Using error fallback user:', fallbackUser);
            setUser(fallbackUser);
          } else {
            setUser(null);
          }
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('✅ User profile loaded:', userProfile);
        if (mounted) {
          setUser(userProfile || null);
          setLoading(false);
        }

        // Update last login (optional, don't fail if it doesn't work)
        if (mounted && userProfile) {
          try {
            await supabase
               .from('users')
               .update({ last_login_at: new Date().toISOString() })
               .eq('id', userId);
          } catch (loginUpdateError) {
            console.warn('⚠️ Could not update last login:', loginUpdateError);
          }
        }

      } catch (error) {
        console.warn('⚠️ Error in loadUserProfile, using auth fallback:', error);
        if (mounted) {
          // Try to get user profile with better error handling
          try {
            // Use auth user as fallback
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
              const fallbackUser = {
                id: authUser.id,
                email: authUser.email || '',
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
                role: authUser.email === 'ezequiel.canton@stravix.io' ? 'ADMIN' as const : 'SALES' as const,
                status: 'ACTIVE' as const,
                created_at: authUser.created_at,
                updated_at: new Date().toISOString()
              };
              console.log('✅ Using auth fallback user:', fallbackUser);
              setUser(fallbackUser);
            } else {
              setUser(null);
            }
          } catch (authError) {
            console.error('❌ Could not get auth user:', authError);
            setUser(null);
          }
          setLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      // If Supabase is not configured, stop loading immediately
      if (!isSupabaseConfigured || !supabase) {
        console.log('⚠️ Supabase not configured, stopping auth check');
        if (mounted) {
          setLoading(false);
          return;
        }
      }

      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('✅ Session found, loading user profile...');
          await loadUserProfile(session.user.id);
        } else {
          console.log('⚠️ No session found');
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error in initializeAuth:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    const checkIfFirstUser = async (): Promise<boolean> => {
      if (!supabase) return false;
      
      try {
        const { count, error } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });
        
        if (error) {
          console.warn('Could not check user count:', error);
          return false;
        }
        
        return (count || 0) === 0;
      } catch (error) {
        console.warn('Error checking if first user:', error);
        return false;
      }
    };

    initializeAuth();

    // Listen for auth changes only if Supabase is configured
    let subscription: any = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          console.log('🔄 Auth state changed:', event, session?.user?.id);
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ User signed in, loading profile...');
            await loadUserProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
            setLoading(false);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('🔄 Token refreshed, skipping profile reload');
            // Don't reload profile on token refresh to avoid loops
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      );
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    console.log('🔐 Attempting sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    return data;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    
    return data;
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const approveUser = async (userId: string) => {
    if (!supabase || !user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('users')
      .update({ status: 'ACTIVE' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (!supabase || !user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    console.log('🔄 Updating user role:', userId, role);

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    approveUser,
    updateUserRole,
  };
};
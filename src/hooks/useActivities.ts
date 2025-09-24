import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Activity, CreateActivityData } from '../types/activity';

export const useActivities = (leadId: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user:users(name, avatar)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: CreateActivityData) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('activities')
        .insert([{ ...activityData, user_id: user.id }])
        .select(`
          *,
          user:users(name, avatar)
        `)
        .single();

      if (error) throw error;
      
      setActivities(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating activity:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    }
  }, [leadId]);

  return {
    activities,
    loading,
    error,
    createActivity,
    refetch: fetchActivities,
  };
};
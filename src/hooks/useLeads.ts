import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Lead, CreateLeadData } from '../types/lead';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData: CreateLeadData) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...leadData, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setLeads(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating lead:', err);
      throw err;
    }
  };

  const updateLead = async (id: string, updates: Partial<CreateLeadData>) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setLeads(prev => prev.map(lead => lead.id === id ? data : lead));
      return data;
    } catch (err: any) {
      console.error('Error updating lead:', err);
      throw err;
    }
  };

  const getLeadById = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching lead:', err);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    getLeadById,
    deleteLead,
    refetch: fetchLeads,
  };
};
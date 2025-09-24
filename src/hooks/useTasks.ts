import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Task, CreateTaskData } from '../types/task';

export const useTasks = (leadId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('tasks')
        .select(`
          *,
          lead:leads(first_name, last_name, company),
          assigned_user:users!tasks_assigned_to_fkey(name, avatar),
          creator:users!tasks_created_by_fkey(name, avatar)
        `)
        .order('created_at', { ascending: false });

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, created_by: user.id }])
        .select(`
          *,
          lead:leads(first_name, last_name, company),
          assigned_user:users!tasks_assigned_to_fkey(name, avatar),
          creator:users!tasks_created_by_fkey(name, avatar)
        `)
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<CreateTaskData>) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const updateData = { ...updates };
      if (updates.status === 'COMPLETED' && !updateData.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          lead:leads(first_name, last_name, company),
          assigned_user:users!tasks_assigned_to_fkey(name, avatar),
          creator:users!tasks_created_by_fkey(name, avatar)
        `)
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (err: any) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [leadId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
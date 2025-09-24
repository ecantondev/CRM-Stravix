import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Edit, MessageSquare, Clock, User, Zap } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useActivities } from '../../hooks/useActivities';
import { isSupabaseConfigured } from '../../config/supabase';
import { ProspectingMessageModal } from './ProspectingMessageModal';
import { TaskList } from '../tasks/TaskList';
import { LEAD_STATUS_OPTIONS } from '../../types/lead';
import type { Lead, LeadStatus } from '../../types/lead';

// Conditional import based on Supabase configuration
const useAuth = isSupabaseConfigured
  ? () => {
      const { useAuth: useSupabaseAuth } = require('../../contexts/SupabaseAuthContext');
      return useSupabaseAuth();
    }
  : () => {
      const { useMockAuth } = require('../../contexts/MockAuthContext');
      return useMockAuth();
    };

export const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateLead, getLeadById } = useLeads();
  const { activities, loading: activitiesLoading, createActivity } = useActivities(id!);
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showProspectingModal, setShowProspectingModal] = useState(false);

  useEffect(() => {
    const loadLead = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const leadData = await getLeadById(id);
        setLead(leadData);
      } catch (err: any) {
        console.error('Error loading lead:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id, user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead || updatingStatus) return;

    try {
      setUpdatingStatus(true);
      await updateLead(lead.id, { status: newStatus });
      setLead(prev => prev ? { ...prev, status: newStatus } : null);
      
      // Create activity for status change
      await createActivity({
        lead_id: lead.id,
        type: 'STATUS_CHANGE',
        content: `Estado cambiado a: ${LEAD_STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !lead || addingNote) return;

    try {
      setAddingNote(true);
      await createActivity({
        lead_id: lead.id,
        type: 'NOTE',
        content: newNote.trim(),
      });
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleSaveProspectingMessage = async (message: string) => {
    if (!lead) return;
    
    try {
      await createActivity({
        lead_id: lead.id,
        type: 'NOTE',
        content: message,
      });
    } catch (error) {
      console.error('Error saving prospecting message:', error);
      throw error;
    }
  };

  const getStatusConfig = (status: string) => {
    return LEAD_STATUS_OPTIONS.find(option => option.value === status) || LEAD_STATUS_OPTIONS[0];
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead no encontrado</h1>
          <p className="text-gray-600 mb-6">El lead que buscas no existe o no tienes permisos para verlo.</p>
          <Link
            to="/app/leads"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Volver a Leads
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(lead.status);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/app/leads')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {lead.first_name} {lead.last_name}
          </h1>
          <p className="text-gray-600">{lead.title} en {lead.company}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button 
          onClick={() => setShowProspectingModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-stravix-500 to-stravix-600 text-white rounded-lg hover:from-stravix-600 hover:to-stravix-700 transition-all shadow-lg"
        >
          <Zap className="w-4 h-4" />
          Generar Mensaje
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Lead</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                <p className="text-gray-900 font-medium">{lead.first_name} {lead.last_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                <p className="text-gray-900">{lead.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <p className="text-gray-900">{lead.company}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <a
                  href={lead.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver perfil
                </a>
              </div>
            </div>

            {lead.note && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nota</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{lead.note}</p>
              </div>
            )}
          </div>

          {/* Activities */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Historial de Actividades</h2>
            
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Agregar una nota..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newNote.trim() || addingNote}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingNote ? 'Agregando...' : 'Agregar Nota'}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Activities List */}
            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No hay actividades registradas</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'NOTE' ? (
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {activity.user?.name || 'Usuario'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.type === 'NOTE' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {activity.type === 'NOTE' ? 'Nota' : 'Cambio de Estado'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{activity.content}</p>
                      <p className="text-sm text-gray-500">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <TaskList leadId={lead.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado actual:</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar estado:
                </label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                  disabled={updatingStatus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  {LEAD_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Creado:</span>
                <span className="text-gray-900">{formatDate(lead.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actualizado:</span>
                <span className="text-gray-900">{formatDate(lead.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prospecting Message Modal */}
      {lead && (
        <ProspectingMessageModal
          lead={lead}
          isOpen={showProspectingModal}
          onClose={() => setShowProspectingModal(false)}
          onSaveToHistory={handleSaveProspectingMessage}
        />
      )}
    </div>
  );
};
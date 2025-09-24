import React, { useState } from 'react';
import { X, Copy, Save, MessageSquare, CheckCircle } from 'lucide-react';
import type { Lead } from '../../types/lead';

interface ProspectingMessageModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSaveToHistory: (message: string) => Promise<void>;
}

export const ProspectingMessageModal: React.FC<ProspectingMessageModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateMessage = () => {
    const noteSection = lead.note ? `\n\nHe visto que ${lead.note.toLowerCase()}, lo cual me parece muy interesante para lo que tenemos preparado.` : '';
    
    return `Hola ${lead.first_name},

Espero que te encuentres muy bien. Mi nombre es [Tu nombre] y soy consultor especializado en IA para empresas en Stravix.

He estado investigando sobre ${lead.company} y me parece fascinante el trabajo que están realizando en el sector. Como ${lead.title}, seguramente estás buscando formas innovadoras de optimizar la captación de leads de calidad para tu equipo.${noteSection}

En Stravix hemos desarrollado un taller exclusivo sobre "IA Aplicada a la Generación de Leads de Alta Calidad" que ha ayudado a empresas similares a ${lead.company} a:

✅ Aumentar la calidad de leads en un 40-60%
✅ Reducir el tiempo de prospección en un 50%
✅ Automatizar procesos de calificación de prospectos
✅ Implementar chatbots inteligentes para captura 24/7

El taller es completamente práctico y adaptado a las necesidades específicas de cada empresa. ¿Te interesaría que conversemos 15 minutos sobre cómo esto podría aplicarse específicamente en ${lead.company}?

Tengo disponibilidad esta semana para una llamada rápida. ¿Qué día te viene mejor?

Saludos cordiales,
[Tu nombre]
Consultor en IA - Stravix

P.D: Si prefieres, puedo enviarte un caso de estudio de una empresa similar que implementó estas estrategias con resultados extraordinarios.`;
  };

  const message = generateMessage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSaveToHistory(`Mensaje de prospección generado:\n\n${message}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mensaje de Prospección</h2>
              <p className="text-sm text-gray-600">Para {lead.first_name} {lead.last_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Datos utilizados:</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Nombre:</strong> {lead.first_name}</p>
              <p><strong>Cargo:</strong> {lead.title}</p>
              <p><strong>Empresa:</strong> {lead.company}</p>
              {lead.note && <p><strong>Nota:</strong> {lead.note}</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {message}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Mensaje personalizado para {lead.company}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                copied 
                  ? 'border-green-300 bg-green-50 text-green-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ¡Guardado!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar en Historial
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
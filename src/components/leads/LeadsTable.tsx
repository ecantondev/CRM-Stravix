import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, User } from 'lucide-react';
import { LEAD_STATUS_OPTIONS } from '../../types/lead';
import type { Lead } from '../../types/lead';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, loading }) => {
  const getStatusConfig = (status: string) => {
    return LEAD_STATUS_OPTIONS.find(option => option.value === status) || LEAD_STATUS_OPTIONS[0];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay leads</h3>
        <p className="text-gray-600 mb-6">
          No se encontraron leads que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Cargo
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Empresa
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              LinkedIn
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => {
            const statusConfig = getStatusConfig(lead.status);
            return (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link 
                    to={`/app/leads/${lead.id}`}
                    className="font-medium text-stravix-600 hover:text-stravix-800 transition-colors"
                  >
                    {lead.first_name} {lead.last_name}
                  </Link>
                  {lead.note && (
                    <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                      {lead.note}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {lead.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {lead.company}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={lead.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-stravix-600 hover:text-stravix-800 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver perfil
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
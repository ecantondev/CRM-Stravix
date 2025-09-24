import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Filter, Download } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { LeadsTable } from '../leads/LeadsTable';
import { LeadsPagination } from '../leads/LeadsPagination';
import { LEAD_STATUS_OPTIONS } from '../../types/lead';
import type { LeadStatus } from '../../types/lead';

export const LeadsPage: React.FC = () => {
  const { leads, loading } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [leads, searchTerm, statusFilter]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ['Nombre', 'Apellido', 'Cargo', 'Empresa', 'Estado', 'LinkedIn', 'Nota', 'Fecha Creación'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.first_name,
        lead.last_name,
        lead.title,
        lead.company,
        LEAD_STATUS_OPTIONS.find(opt => opt.value === lead.status)?.label || lead.status,
        lead.linkedin_url,
        lead.note || '',
        new Date(lead.created_at).toLocaleDateString()
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
          <p className="text-gray-600">Gestiona tus contactos y oportunidades de venta</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
          <Link
            to="/app/leads/new"
            className="bg-gradient-to-r from-stravix-500 to-stravix-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-stravix-600 hover:to-stravix-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Nuevo Lead
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'ALL')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
              >
                <option value="ALL">Todos los estados</option>
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {filteredLeads.length} de {leads.length} leads
            {searchTerm && ` para "${searchTerm}"`}
            {statusFilter !== 'ALL' && ` con estado "${LEAD_STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label}"`}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <LeadsTable leads={paginatedLeads} loading={loading} />
        <LeadsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLeads.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Filter, Plus, Users, MapPin } from 'lucide-react';
import { COMPANY_SIZES } from '../../types/company';
import type { Company } from '../../types/company';

export const CompaniesPage: React.FC = () => {
  const [companies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');
  const [sizeFilter, setSizeFilter] = useState<string>('ALL');

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIndustry = industryFilter === 'ALL' || company.industry === industryFilter;
      const matchesSize = sizeFilter === 'ALL' || company.size === sizeFilter;
      
      return matchesSearch && matchesIndustry && matchesSize;
    });
  }, [companies, searchTerm, industryFilter, sizeFilter]);

  const getSizeConfig = (size: string) => {
    return COMPANY_SIZES.find(option => option.value === size) || COMPANY_SIZES[0];
  };

  const industries = [...new Set(companies.map(c => c.industry))];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Empresas</h1>
          <p className="text-gray-600">Gestiona tu cartera de empresas cliente</p>
        </div>
        <Link
          to="/app/companies/new"
          className="bg-gradient-to-r from-stravix-500 to-stravix-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-stravix-600 hover:to-stravix-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Empresa
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{companies.length}</p>
            <p className="text-sm font-medium text-gray-600">Total Empresas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {companies.filter(c => c.size === 'LARGE' || c.size === 'ENTERPRISE').length}
            </p>
            <p className="text-sm font-medium text-gray-600">Empresas Grandes</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {new Set(companies.map(c => c.country)).size}
            </p>
            <p className="text-sm font-medium text-gray-600">Países</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{industries.length}</p>
            <p className="text-sm font-medium text-gray-600">Industrias</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="ALL">Todas las industrias</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-48">
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="ALL">Todos los tamaños</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => {
          const sizeConfig = getSizeConfig(company.size);
          return (
            <Link
              key={company.id}
              to={`/app/companies/${company.id}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-stravix-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-stravix-500 to-stravix-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${sizeConfig.color}`}>
                  {sizeConfig.value}
                </span>
              </div>

              {company.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {company.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                {company.website && (
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <span className="truncate">{company.website}</span>
                  </div>
                )}
                {company.city && company.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{company.city}, {company.country}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron empresas</h3>
          <p className="text-gray-600 mb-6">
            No hay empresas que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Search, Filter, Plus, DollarSign, Calendar, Target } from 'lucide-react';
import { DEAL_STAGES, CURRENCIES } from '../../types/deal';
import type { Deal, DealStage } from '../../types/deal';

export const DealsPage: React.FC = () => {
  const [deals] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'ALL'>('ALL');

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch = searchTerm === '' || 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = stageFilter === 'ALL' || deal.stage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, stageFilter]);

  const getStageConfig = (stage: string) => {
    return DEAL_STAGES.find(option => option.value === stage) || DEAL_STAGES[0];
  };

  const getCurrencySymbol = (currency: string) => {
    return CURRENCIES.find(c => c.value === currency)?.symbol || '$';
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;
  const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON').length;
  const winRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oportunidades</h1>
          <p className="text-gray-600">Gestiona tu pipeline de ventas</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/app/deals/kanban"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Vista Kanban
          </Link>
          <Link
            to="/app/deals/new"
            className="bg-gradient-to-r from-stravix-500 to-stravix-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-stravix-600 hover:to-stravix-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva Oportunidad
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{deals.length}</p>
            <p className="text-sm font-medium text-gray-600">Total Oportunidades</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-600">Valor Total Pipeline</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${avgDealSize.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-600">Tamaño Promedio</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{winRate.toFixed(1)}%</p>
            <p className="text-sm font-medium text-gray-600">Tasa de Cierre</p>
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
                placeholder="Buscar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="sm:w-64">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as DealStage | 'ALL')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="ALL">Todas las etapas</option>
              {DEAL_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Oportunidad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Empresa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Etapa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Probabilidad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Cierre Esperado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => {
                const stageConfig = getStageConfig(deal.stage);
                return (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/app/deals/${deal.id}`}
                        className="font-medium text-stravix-600 hover:text-stravix-800 transition-colors"
                      >
                        {deal.title}
                      </Link>
                      {deal.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {deal.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {deal.company?.name || 'Sin empresa'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {getCurrencySymbol(deal.currency)}{deal.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageConfig.color}`}>
                        {stageConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {deal.expected_close_date ? 
                        new Date(deal.expected_close_date).toLocaleDateString('es-ES') : 
                        'Sin fecha'
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron oportunidades</h3>
          <p className="text-gray-600 mb-6">
            No hay oportunidades que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};
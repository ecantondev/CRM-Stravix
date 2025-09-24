import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, DollarSign, Calendar, Building2 } from 'lucide-react';
import { DEAL_STAGES, CURRENCIES } from '../../types/deal';
import type { Deal, DealStage } from '../../types/deal';

export const DealsKanban: React.FC = () => {
  const [deals] = useState<Deal[]>([]);

  const getCurrencySymbol = (currency: string) => {
    return CURRENCIES.find(c => c.value === currency)?.symbol || '$';
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage: DealStage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/app/deals"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pipeline de Ventas</h1>
            <p className="text-gray-600">Vista Kanban de oportunidades</p>
          </div>
        </div>
        <Link
          to="/app/deals/new"
          className="bg-gradient-to-r from-stravix-500 to-stravix-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-stravix-600 hover:to-stravix-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Oportunidad
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = getDealsByStage(stage.value as DealStage);
          const stageValue = getStageValue(stage.value as DealStage);
          
          return (
            <div key={stage.value} className="flex-shrink-0 w-80">
              {/* Stage Header */}
              <div className="bg-white rounded-t-2xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stage.color.includes('gray') ? 'bg-gray-400' : 
                      stage.color.includes('blue') ? 'bg-blue-500' :
                      stage.color.includes('yellow') ? 'bg-yellow-500' :
                      stage.color.includes('orange') ? 'bg-orange-500' :
                      stage.color.includes('green') ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  ${stageValue.toLocaleString()}
                </div>
              </div>

              {/* Stage Content */}
              <div className="bg-gray-50 border-l border-r border-gray-200 min-h-96 p-4 space-y-3">
                {stageDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/app/deals/${deal.id}`}
                    className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all hover:border-stravix-200"
                  >
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">{deal.title}</h4>
                      {deal.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                        <DollarSign className="w-4 h-4" />
                        {getCurrencySymbol(deal.currency)}{deal.value.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>{deal.probability}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      {deal.company && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span className="truncate">{deal.company.name}</span>
                        </div>
                      )}
                      
                      {deal.expected_close_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(deal.expected_close_date).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all" 
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No hay oportunidades</p>
                  </div>
                )}
              </div>

              {/* Stage Footer */}
              <div className="bg-white rounded-b-2xl border border-gray-200 border-t-0 p-3">
                <button className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Agregar oportunidad
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pipeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = getDealsByStage(stage.value as DealStage);
            const stageValue = getStageValue(stage.value as DealStage);
            
            return (
              <div key={stage.value} className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                  stage.color.includes('gray') ? 'bg-gray-400' : 
                  stage.color.includes('blue') ? 'bg-blue-500' :
                  stage.color.includes('yellow') ? 'bg-yellow-500' :
                  stage.color.includes('orange') ? 'bg-orange-500' :
                  stage.color.includes('green') ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <p className="text-sm font-medium text-gray-900">{stageDeals.length}</p>
                <p className="text-xs text-gray-600">${stageValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
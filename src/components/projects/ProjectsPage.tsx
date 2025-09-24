import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Search, Filter, Plus, Calendar, DollarSign, User, Building2 } from 'lucide-react';
import { PROJECT_STATUS_OPTIONS } from '../../types/project';
import { CURRENCIES } from '../../types/deal';
import type { Project, ProjectStatus } from '../../types/project';

export const ProjectsPage: React.FC = () => {
  const [projects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const getStatusConfig = (status: string) => {
    return PROJECT_STATUS_OPTIONS.find(option => option.value === status) || PROJECT_STATUS_OPTIONS[0];
  };

  const getCurrencySymbol = (currency: string) => {
    return CURRENCIES.find(c => c.value === currency)?.symbol || '$';
  };

  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  const completionRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Proyectos</h1>
          <p className="text-gray-600">Gestiona los proyectos de tus clientes</p>
        </div>
        <Link
          to="/app/projects/new"
          className="bg-gradient-to-r from-stravix-500 to-stravix-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-stravix-600 hover:to-stravix-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{projects.length}</p>
            <p className="text-sm font-medium text-gray-600">Total Proyectos</p>
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
              ${totalBudget.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{activeProjects}</p>
            <p className="text-sm font-medium text-gray-600">En Progreso</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{completionRate.toFixed(1)}%</p>
            <p className="text-sm font-medium text-gray-600">Tasa Completado</p>
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
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="sm:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="ALL">Todos los estados</option>
              {PROJECT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const statusConfig = getStatusConfig(project.status);
          const progress = project.status === 'COMPLETED' ? 100 : 
                          project.status === 'IN_PROGRESS' ? 65 :
                          project.status === 'PLANNING' ? 25 : 0;
          
          return (
            <Link
              key={project.id}
              to={`/app/projects/${project.id}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-stravix-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-stravix-500 to-stravix-600 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    {project.company && (
                      <p className="text-sm text-gray-600">{project.company.name}</p>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                {project.budget && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">
                      {getCurrencySymbol(project.currency)}{project.budget.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {project.manager && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{project.manager.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {(project.start_date || project.end_date) && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <div className="flex gap-2">
                      {project.start_date && (
                        <span>Inicio: {new Date(project.start_date).toLocaleDateString('es-ES')}</span>
                      )}
                      {project.start_date && project.end_date && <span>•</span>}
                      {project.end_date && (
                        <span>Fin: {new Date(project.end_date).toLocaleDateString('es-ES')}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progreso</span>
                    <span className="text-xs font-medium text-gray-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-stravix-500 to-stravix-600 h-2 rounded-full transition-all" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {project.deal && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Deal:</span>
                    <span className="font-medium">{project.deal.title}</span>
                    <span className="text-green-600 font-medium">
                      ${project.deal.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron proyectos</h3>
          <p className="text-gray-600 mb-6">
            No hay proyectos que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Search, Filter, Plus, Building2, Mail, Phone, Linkedin } from 'lucide-react';
import type { Contact } from '../../types/contact';

export const ContactsPage: React.FC = () => {
  const [contacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = companyFilter === 'ALL' || contact.company?.name === companyFilter;
      
      return matchesSearch && matchesCompany;
    });
  }, [contacts, searchTerm, companyFilter]);

  const companies = [...new Set(contacts.map(c => c.company?.name).filter(Boolean))];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contactos</h1>
          <p className="text-gray-600">Gestiona tu red de contactos profesionales</p>
        </div>
        <Link
          to="/app/contacts/new"
          className="bg-gradient-to-r from-stravix-500 to-stravix-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-stravix-600 hover:to-stravix-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nuevo Contacto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{contacts.length}</p>
            <p className="text-sm font-medium text-gray-600">Total Contactos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {contacts.filter(c => c.is_primary).length}
            </p>
            <p className="text-sm font-medium text-gray-600">Contactos Primarios</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {contacts.filter(c => c.email).length}
            </p>
            <p className="text-sm font-medium text-gray-600">Con Email</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {contacts.filter(c => c.linkedin_url).length}
            </p>
            <p className="text-sm font-medium text-gray-600">Con LinkedIn</p>
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
                placeholder="Buscar contactos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="sm:w-64">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="ALL">Todas las empresas</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Link
            key={contact.id}
            to={`/app/contacts/${contact.id}`}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-stravix-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {contact.first_name} {contact.last_name}
                  </h3>
                  {contact.position && (
                    <p className="text-sm text-gray-600">{contact.position}</p>
                  )}
                </div>
              </div>
              {contact.is_primary && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Primario
                </span>
              )}
            </div>

            {contact.company && (
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{contact.company.name}</span>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-500">
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.linkedin_url && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-blue-600">LinkedIn</span>
                </div>
              )}
            </div>

            {contact.department && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Departamento: {contact.department}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron contactos</h3>
          <p className="text-gray-600 mb-6">
            No hay contactos que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};
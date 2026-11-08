import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { Company } from '../../types';
import { Plus, Edit, Trash2, Globe, Building2, Search, ExternalLink, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(() => DataStore.getCompanies());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logoUrl: '',
    coverUrl: '',
    description: '',
    website: '',
    industry: '',
    companySize: '10-50',
    headquarters: '',
    country: 'United States',
    city: '',
  });

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      slug: '',
      logoUrl: '',
      coverUrl: '',
      description: '',
      website: '',
      industry: 'Design & Engineering Studio',
      companySize: '20-50',
      headquarters: 'New York, NY',
      country: 'United States',
      city: 'New York',
    });
    setIsCreating(true);
    setEditingCompany(null);
  };

  const handleOpenEdit = (comp: Company) => {
    setFormData({
      name: comp.name,
      slug: comp.slug,
      logoUrl: comp.logo_url || '',
      coverUrl: comp.cover_url || '',
      description: comp.description,
      website: comp.website,
      industry: comp.industry,
      companySize: comp.company_size,
      headquarters: comp.headquarters,
      country: comp.country,
      city: comp.city,
    });
    setEditingCompany(comp);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (isCreating) {
      const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      DataStore.createCompany({
        name: formData.name,
        slug,
        logo_url: formData.logoUrl || undefined,
        cover_url: formData.coverUrl || undefined,
        description: formData.description,
        website: formData.website,
        industry: formData.industry,
        company_size: formData.companySize,
        headquarters: formData.headquarters,
        country: formData.country,
        city: formData.city,
      });
      showNotice(`Studio "${formData.name}" added successfully.`);
    } else if (editingCompany) {
      DataStore.updateCompany(editingCompany.id, {
        name: formData.name,
        logo_url: formData.logoUrl || undefined,
        cover_url: formData.coverUrl || undefined,
        description: formData.description,
        website: formData.website,
        industry: formData.industry,
        company_size: formData.companySize,
        headquarters: formData.headquarters,
        country: formData.country,
        city: formData.city,
      });
      showNotice(`Studio "${formData.name}" updated.`);
    }

    setCompanies(DataStore.getCompanies());
    setIsCreating(false);
    setEditingCompany(null);
  };

  const handleDelete = (id: string, name: string) => {
    try {
      if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        DataStore.deleteCompany(id);
        setCompanies(DataStore.getCompanies());
        showNotice(`Studio "${name}" removed.`);
      }
    } catch (err: any) {
      alert(err.message || 'Cannot delete company with active job postings.');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.headquarters.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedCompanies = filtered.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(clamped);
  };

  const getPaginationNumbers = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Partner Studios Directory
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
            Studio Management ({companies.length})
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Studio</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by studio name or headquarters location..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-neutral-500 uppercase text-[10px]">
                <th className="py-3 px-4">Studio Name</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Headquarters</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Active Jobs</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedCompanies.map((comp) => (
                <tr key={comp.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {comp.logo_url ? (
                        <img
                          src={comp.logo_url}
                          alt={comp.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                          {comp.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-neutral-900 block">{comp.name}</span>
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-neutral-400 hover:text-neutral-900 underline flex items-center gap-1"
                        >
                          <span>{comp.website.replace('https://', '')}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-700">{comp.industry}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">{comp.headquarters}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">{comp.company_size}</td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {comp.active_jobs_count || 0}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(comp)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Edit Studio"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(comp.id, comp.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete Studio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="font-mono text-neutral-500">
            {filtered.length > 0 ? (
              <>
                Showing <strong className="text-neutral-900 font-semibold">{(activePage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-neutral-900 font-semibold">{Math.min(activePage * itemsPerPage, filtered.length)}</strong> of{' '}
                <strong className="text-neutral-900 font-semibold">{filtered.length}</strong> studios
                <span className="text-neutral-400 ml-1.5">(Page {activePage} of {totalPages})</span>
              </>
            ) : (
              <span>No matching studios</span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage <= 1}
                className="h-8 px-2.5 sm:px-3 border border-neutral-200 bg-white rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {getPaginationNumbers(activePage, totalPages).map((item, idx) => {
                if (item === '...') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-8 h-8 flex items-center justify-center text-xs font-mono text-neutral-400 select-none"
                    >
                      …
                    </span>
                  );
                }
                const p = item as number;
                const isActive = p === activePage;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isActive
                        ? 'bg-[#121212] text-white shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage >= totalPages}
                className="h-8 px-2.5 sm:px-3 border border-neutral-200 bg-white rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
                title="Next Page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Studio */}
      {(isCreating || editingCompany) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingCompany(null);
              }}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-display font-bold text-xl text-neutral-900">
                {isCreating ? 'Add Studio Profile' : `Edit ${editingCompany?.name}`}
              </h3>
              <p className="text-neutral-500 text-xs">Manage public branding and studio details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-neutral-900 block mb-1">Studio Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Studio 28K"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-900 block mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Digital Agency"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-900 block mb-1">Team Size</label>
                  <input
                    type="text"
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    placeholder="e.g. 20-50"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-900 block mb-1">Official Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://studio28k.com"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-900 block mb-1">Headquarters</label>
                <input
                  type="text"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  placeholder="e.g. Berlin, Germany"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-900 block mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-900 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Studio creative mission, culture, and achievements..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCompany(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Save Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

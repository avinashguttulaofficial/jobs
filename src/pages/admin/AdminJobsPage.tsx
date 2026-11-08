import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { Job, JobStatus } from '../../types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  CheckCircle,
  EyeOff,
  Filter,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const AdminJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobs, setJobs] = useState<Job[]>(() => DataStore.getJobs());
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTogglePublish = (job: Job) => {
    const newStatus: JobStatus = job.status === 'published' ? 'draft' : 'published';
    DataStore.updateJob(job.id, { status: newStatus });
    setJobs(DataStore.getJobs());
    showNotice(`Job "${job.title}" marked as ${newStatus}.`);
  };

  const handleToggleFeatured = (job: Job) => {
    const newFeatured = !job.is_featured;
    DataStore.updateJob(job.id, { is_featured: newFeatured });
    setJobs(DataStore.getJobs());
    showNotice(`Featured status ${newFeatured ? 'enabled' : 'disabled'}.`);
  };

  const handleDuplicate = (id: string) => {
    const copy = DataStore.duplicateJob(id);
    setJobs(DataStore.getJobs());
    showNotice(`Duplicate created: "${copy.title}"`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete the job listing "${title}"?`)) {
      DataStore.deleteJob(id);
      setJobs(DataStore.getJobs());
      showNotice(`Job "${title}" deleted.`);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(q);
        const matchesCompany = j.company?.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany) return false;
      }
      if (statusFilter !== 'all' && j.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [jobs, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedJobs = useMemo(() => {
    return filteredJobs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  }, [filteredJobs, activePage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(clamped);
  };

  const getPaginationNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Editorial Listings
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
            Job Management ({jobs.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/himalayas"
            className="px-3.5 py-2 bg-white border border-neutral-300 text-neutral-800 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Himalayas Live Sync</span>
          </Link>

          <Link
            to="/admin/jobs/new"
            className="px-4 py-2 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Job</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notification}
        </div>
      )}

  {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by job title or studio name..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="filled">Filled</option>
            <option value="expired">Expired</option>
          </select>

          <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-600">
            <span className="text-[11px] font-mono text-neutral-400 whitespace-nowrap">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-semibold text-neutral-900 border-none focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={35}>35</option>
              <option value={70}>70 (All)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Data Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-neutral-500 uppercase text-[10px]">
                <th className="py-3 px-4">Title & Studio</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type & Location</th>
                <th className="py-3 px-4">Compensation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/admin/jobs/${job.id}/edit`}
                      className="font-bold text-neutral-900 hover:underline block text-xs sm:text-sm"
                    >
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-mono text-neutral-400">
                        {job.company?.name || 'Studio'} · {job.slug}
                      </span>
                      {job.external_application_url && (
                        <a
                          href={job.external_application_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
                          title={`Direct Application Link: ${job.external_application_url}`}
                        >
                          <span>Direct Apply</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-700">
                    {job.category?.name || 'General'}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                    <span className="capitalize">{job.employment_type}</span>
                    <span className="block text-neutral-400">{job.location}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-800">
                    {job.salary_visible && job.salary_min
                      ? `$${job.salary_min.toLocaleString()} – $${(job.salary_max || job.salary_min).toLocaleString()}`
                      : 'Undisclosed'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(job)}
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        job.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {job.status}
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFeatured(job)}
                      className={`p-1 rounded transition-colors ${
                        job.is_featured
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-neutral-300 hover:text-neutral-600'
                      }`}
                      title={job.is_featured ? 'Featured on homepage' : 'Not featured'}
                    >
                      <Star className={`w-4 h-4 ${job.is_featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/jobs/${job.slug}`}
                        target="_blank"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="View Public Post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(job.id)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Duplicate Job"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to={`/admin/jobs/${job.id}/edit`}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(job.id, job.title)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete Job"
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
            {filteredJobs.length > 0 ? (
              <>
                Showing <strong className="text-neutral-900 font-semibold">{(activePage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-neutral-900 font-semibold">{Math.min(activePage * itemsPerPage, filteredJobs.length)}</strong> of{' '}
                <strong className="text-neutral-900 font-semibold">{filteredJobs.length}</strong> listings
                <span className="text-neutral-400 ml-1.5">(Page {activePage} of {totalPages})</span>
              </>
            ) : (
              <span>No matching listings</span>
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
    </div>
  );
};

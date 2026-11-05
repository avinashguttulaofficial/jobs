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

        <Link
          to="/admin/jobs/new"
          className="px-4 py-2 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Job</span>
        </Link>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or studio name..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="filled">Filled</option>
            <option value="expired">Expired</option>
          </select>
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
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/admin/jobs/${job.id}/edit`}
                      className="font-bold text-neutral-900 hover:underline block text-xs sm:text-sm"
                    >
                      {job.title}
                    </Link>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {job.company?.name || 'Studio'} · {job.slug}
                    </span>
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
      </div>
    </div>
  );
};

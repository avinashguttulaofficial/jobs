import React, { useState, useMemo } from 'react';
import { DataStore } from '../../services/store';
import { Application, ApplicationStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(() => DataStore.getApplications());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Status update modal state
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  const [adminNote, setAdminNote] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesUser = app.user?.full_name.toLowerCase().includes(q) || app.user?.email.toLowerCase().includes(q);
        const matchesJob = app.job?.title.toLowerCase().includes(q) || app.job?.company?.name.toLowerCase().includes(q);
        if (!matchesUser && !matchesJob) return false;
      }
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [applications, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedApps = useMemo(() => {
    return filtered.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  }, [filtered, activePage, itemsPerPage]);

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

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const updated = DataStore.updateApplicationStatus(
      selectedApp.id,
      newStatus,
      adminNote.trim() || undefined,
      user?.full_name ? `${user.full_name} (Admin)` : 'Administrator'
    );

    setApplications(DataStore.getApplications());
    setSelectedApp(updated);
    setAdminNote('');
    showNotice(`Candidate status updated to ${newStatus.replace('_', ' ')}.`);
  };

  // CSV Export feature (Section 5.3)
  const handleExportCSV = () => {
    const headers = ['Application ID', 'Candidate Name', 'Candidate Email', 'Job Title', 'Studio', 'Status', 'Applied Date'];
    const rows = filtered.map((app) => [
      app.id,
      `"${app.user?.full_name || ''}"`,
      `"${app.user?.email || ''}"`,
      `"${app.job?.title || ''}"`,
      `"${app.job?.company?.name || ''}"`,
      app.status,
      new Date(app.applied_at).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grail_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('CSV export generated successfully.');
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'interview':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Recruitment Queue
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
            Candidate Applications ({applications.length})
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2 bg-white"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      {/* Search and Filters */}
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
            placeholder="Search applicant name, email, or job title..."
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
            <option value="all">All Application Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-neutral-500 uppercase text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Position & Studio</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Resume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedApps.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 block">{app.user?.full_name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{app.user?.email}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-neutral-900 block">{app.job?.title}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{app.job?.company?.name}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4">
                    {app.resume ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-700 font-mono">
                        <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{app.resume.file_name}</span>
                      </span>
                    ) : (
                      <span className="text-neutral-400 font-mono text-[11px]">Direct Dossier</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setNewStatus(app.status);
                      }}
                      className="px-3 py-1 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      Review & Status
                    </button>
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
                <strong className="text-neutral-900 font-semibold">{filtered.length}</strong> applications
                <span className="text-neutral-400 ml-1.5">(Page {activePage} of {totalPages})</span>
              </>
            ) : (
              <span>No applications matching filters</span>
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

      {/* Review Modal / Dossier Slideover */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Candidate Dossier & Review
              </span>
              <h2 className="font-display font-bold text-2xl text-neutral-900 leading-tight">
                {selectedApp.user?.full_name}
              </h2>
              <p className="text-neutral-500 font-mono text-[11px] mt-0.5">
                Applied for: <strong className="text-neutral-900">{selectedApp.job?.title}</strong> at{' '}
                {selectedApp.job?.company?.name}
              </p>
            </div>

            {/* Candidate Details */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-neutral-400 block text-[10px]">Email</span>
                <span className="text-neutral-900">{selectedApp.user?.email}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Location</span>
                <span className="text-neutral-900">{selectedApp.user?.location || 'Unspecified'}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Experience Level</span>
                <span className="text-neutral-900 font-semibold">{selectedApp.user?.years_of_experience || selectedApp.job?.experience_level || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Portfolio</span>
                {selectedApp.user?.portfolio_url ? (
                  <a
                    href={selectedApp.user.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-900 underline flex items-center gap-1"
                  >
                    <span>{selectedApp.user.portfolio_url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-neutral-400">None provided</span>
                )}
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">LinkedIn</span>
                {selectedApp.user?.linkedin_url ? (
                  <a
                    href={selectedApp.user.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-900 underline flex items-center gap-1"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-neutral-400">None provided</span>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-neutral-900">Cover Note</h4>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-neutral-700 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                {selectedApp.cover_letter || 'No cover letter attached.'}
              </div>
            </div>

            {/* Resume File */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-neutral-900">Attached Resume File</h4>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span className="font-medium text-neutral-900">
                    {selectedApp.resume?.file_name || 'Standard Candidate Profile'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  {selectedApp.resume ? `${(selectedApp.resume.file_size / 1024).toFixed(1)} KB` : 'Verified'}
                </span>
              </div>
            </div>

            {/* Status History */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Status History</h4>
              <div className="space-y-2 pl-3 border-l-2 border-neutral-200">
                {selectedApp.status_history?.map((h) => (
                  <div key={h.id} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase font-mono text-[10px] text-neutral-900">
                        {h.new_status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(h.created_at).toLocaleString()}
                      </span>
                    </div>
                    {h.admin_note && (
                      <p className="text-[11px] text-neutral-600 italic">"{h.admin_note}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleStatusUpdate} className="space-y-3 pt-4 border-t border-neutral-200">
              <h4 className="font-semibold text-neutral-900">Update Application Status</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none cursor-pointer"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview Scheduled</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    Internal Admin Note / Feedback
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. Passed initial screen; portfolio forwarded to CD"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Save Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

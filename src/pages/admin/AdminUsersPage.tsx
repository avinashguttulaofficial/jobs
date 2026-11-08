import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { UserProfile, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Search, Shield, User, Ban, CheckCircle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(() => DataStore.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [notice, setNotice] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleToggleStatus = (u: UserProfile) => {
    const newStatus = u.account_status === 'active' ? 'suspended' : 'active';
    if (u.id === currentAdmin?.id) {
      alert('You cannot suspend your own administrative session.');
      return;
    }
    DataStore.updateUserStatus(u.id, newStatus);
    setUsers(DataStore.getUsers());
    showNotice(`Account for ${u.full_name} is now ${newStatus}.`);
  };

  const filtered = users.filter((u) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!u.full_name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (roleFilter !== 'all' && u.role !== roleFilter) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedUsers = filtered.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

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
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
          Identity & Governance
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
          Registered Users ({users.length})
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Candidate profiles, verified administrators, and account governance.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      {/* Filter and Search */}
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
            placeholder="Search candidate name or email..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="user">Candidates (Job Seekers)</option>
          <option value="admin">Administrators</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-neutral-500 uppercase text-[10px]">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 block">{u.full_name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{u.email}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        u.role === 'super_admin'
                          ? 'bg-neutral-900 text-white'
                          : u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                    {u.location || 'Global'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        u.account_status === 'active'
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-red-700 bg-red-50'
                      }`}
                    >
                      {u.account_status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {u.id !== currentAdmin?.id && u.role !== 'super_admin' && (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          u.account_status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.account_status === 'active' ? 'Suspend Account' : 'Reactivate'}
                      </button>
                    )}
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
                <strong className="text-neutral-900 font-semibold">{filtered.length}</strong> users
                <span className="text-neutral-400 ml-1.5">(Page {activePage} of {totalPages})</span>
              </>
            ) : (
              <span>No matching users</span>
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

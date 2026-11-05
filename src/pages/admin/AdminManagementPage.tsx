import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, UserRole } from '../../types';
import { ShieldCheck, UserPlus, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

export const AdminManagementPage: React.FC = () => {
  const { user: currentSuperAdmin, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(() => DataStore.getUsers());
  const [targetEmail, setTargetEmail] = useState('');
  const [targetRole, setTargetRole] = useState<UserRole>('admin');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 bg-neutral-900 text-white rounded-xl text-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="font-display font-bold text-xl uppercase">Super Admin Privilege Required</h3>
        <p className="text-xs text-neutral-400">
          Only Super Administrators can delegate administrative privileges or promote staff.
        </p>
      </div>
    );
  }

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = targetEmail.trim().toLowerCase();
    const candidate = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!candidate) {
      setError(`No user found with email "${targetEmail}". The user must register first.`);
      return;
    }

    if (candidate.id === currentSuperAdmin?.id) {
      setError('You cannot modify your own root Super Administrator privileges.');
      return;
    }

    DataStore.updateUserRole(candidate.id, targetRole);
    setUsers(DataStore.getUsers());
    setTargetEmail('');
    showNotice(`Privileges for ${candidate.full_name} updated to ${targetRole}.`);
  };

  const handleRevoke = (u: UserProfile) => {
    if (u.id === currentSuperAdmin?.id) {
      alert('You cannot revoke your own privileges.');
      return;
    }
    if (confirm(`Revoke administrative access for ${u.full_name}? Role will revert to standard candidate user.`)) {
      DataStore.updateUserRole(u.id, 'user');
      setUsers(DataStore.getUsers());
      showNotice(`Revoked admin access for ${u.full_name}.`);
    }
  };

  const adminsList = users.filter((u) => u.role === 'admin' || u.role === 'super_admin');

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
          Root Authority
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
          Super Administrator Governance
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Manage administrator delegation, role promotions, and security access policies.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Delegation Form */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-semibold text-neutral-900 text-sm">
          Provision / Elevate Administrator Access
        </h3>
        <p className="text-neutral-500 text-xs">
          Enter the registered email of a verified team member to grant administrative moderation powers.
        </p>

        <form onSubmit={handleAssignRole} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="email"
            required
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            placeholder="colleague@domain.com"
            className="flex-1 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
          />

          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as UserRole)}
            className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer text-xs"
          >
            <option value="admin">Administrator</option>
            <option value="super_admin">Super Administrator</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#121212] text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors shrink-0"
          >
            Assign Role
          </button>
        </form>
      </div>

      {/* Active Administrative Roster */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-semibold text-neutral-900 text-xs">
            Active Administrative Staff ({adminsList.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 font-mono text-neutral-500 uppercase text-[10px]">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">Granted Date</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {adminsList.map((admin) => (
                <tr key={admin.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 block">{admin.full_name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{admin.email}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        admin.role === 'super_admin'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {admin.id !== currentSuperAdmin?.id && admin.role !== 'super_admin' && (
                      <button
                        onClick={() => handleRevoke(admin)}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs"
                      >
                        Revoke Admin
                      </button>
                    )}
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

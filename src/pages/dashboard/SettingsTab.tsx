import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, AlertCircle, Shield, Trash2 } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    editorialNewsletter: false,
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordState.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setPasswordSuccess(true);
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleDeleteRequest = () => {
    if (confirm('Are you sure you want to request permanent account deletion? This action will archive your candidate profile and active applications.')) {
      alert('Your deletion request has been submitted to the platform administrators. An email confirmation has been sent.');
      setDeleteConfirmation(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="font-display font-bold text-xl text-neutral-900">
          Account & Security Settings
        </h2>
        <p className="text-xs text-neutral-500">
          Manage your login credentials, notifications, and privacy preferences.
        </p>
      </div>

      {/* Password Management */}
      <section className="bg-neutral-50/50 p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neutral-900" />
          <h3 className="font-semibold text-neutral-900 text-sm">Update Password</h3>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Password successfully updated.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md">
          <div>
            <label className="font-medium text-neutral-700 block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2 bg-white border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2 bg-white border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2 bg-white border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Change Password
          </button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="bg-neutral-50/50 p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
        <h3 className="font-semibold text-neutral-900 text-sm">Email Notifications</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.applicationUpdates}
              onChange={(e) => setNotifications({ ...notifications, applicationUpdates: e.target.checked })}
              className="rounded text-neutral-900 focus:ring-0"
            />
            <div>
              <strong className="text-neutral-900 block">Application Status Alerts</strong>
              <span className="text-neutral-500 text-[11px]">Receive emails when a hiring lead updates your application status.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.jobAlerts}
              onChange={(e) => setNotifications({ ...notifications, jobAlerts: e.target.checked })}
              className="rounded text-neutral-900 focus:ring-0"
            />
            <div>
              <strong className="text-neutral-900 block">Curated Matching Alerts</strong>
              <span className="text-neutral-500 text-[11px]">Notify me when verified roles matching my primary discipline are posted.</span>
            </div>
          </label>
        </div>
      </section>

      {/* Account Deletion Request Workflow */}
      <section className="p-6 rounded-xl border border-red-200 bg-red-50/30 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
          <Trash2 className="w-4 h-4" />
          <span>Request Account Deletion</span>
        </div>
        <p className="text-neutral-600 leading-relaxed text-xs">
          Request permanent erasure of your personal data, profile documents, and past application histories in compliance with GDPR and global privacy standards.
        </p>
        <button
          onClick={handleDeleteRequest}
          disabled={deleteConfirmation}
          className="px-4 py-2 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleteConfirmation ? 'Deletion Request Pending' : 'Submit Account Deletion Request'}
        </button>
      </section>
    </div>
  );
};

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';

export const FloatingDock: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const savedCount = user ? DataStore.getSavedJobs(user.id).length : 0;

  // Don't show the dock in admin portal to keep admin workspace clean
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Jobs', path: '/jobs' },
    { label: 'Companies', path: '/companies' },
    { label: 'Resources', path: '/resources' },
    { label: `Saved (${savedCount})`, path: '/dashboard/saved-jobs' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1.5 p-1.5 bg-[#121212]/95 text-white backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl text-xs font-medium">
        {/* Brand pill */}
        <Link
          to="/"
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-[#121212] font-display font-black text-sm hover:scale-105 transition-transform"
          title="Grail Home"
        >
          W.
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 px-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Quick action: Post Job (Admin) or Apply/Explore */}
        {isAdmin ? (
          <Link
            to="/admin/jobs/new"
            className="ml-1 px-3.5 py-1.5 rounded-xl bg-white text-[#121212] font-semibold text-xs hover:bg-neutral-200 transition-colors whitespace-nowrap"
          >
            Post Job
          </Link>
        ) : (
          <Link
            to="/jobs"
            className="ml-1 px-3.5 py-1.5 rounded-xl bg-white text-[#121212] font-semibold text-xs hover:bg-neutral-200 transition-colors whitespace-nowrap"
          >
            Explore
          </Link>
        )}
      </div>
    </div>
  );
};

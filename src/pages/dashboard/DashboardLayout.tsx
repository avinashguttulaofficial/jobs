import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, User, FileText, Bookmark, Settings, ArrowLeft, Send } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white border border-neutral-300 rounded-xl text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-neutral-900">Sign In Required</h2>
        <p className="text-xs text-neutral-500">
          Please sign in to access your Candidate Dashboard.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/dashboard', end: true, icon: LayoutDashboard },
    { label: 'Candidate Profile', path: '/dashboard/profile', icon: User },
    { label: 'My Applications', path: '/dashboard/applications', icon: Send },
    { label: 'Saved Jobs', path: '/dashboard/saved-jobs', icon: Bookmark },
    { label: 'Resumes & Files', path: '/dashboard/resumes', icon: FileText },
    { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Candidate Hub
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 uppercase tracking-tight">
            Welcome, {user.full_name}
          </h1>
        </div>

        <Link
          to="/jobs"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 text-neutral-800 rounded text-xs font-semibold hover:bg-neutral-100 transition-colors"
        >
          <span>Find Opportunities</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-3 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#121212] text-white font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* Dashboard Workspace */}
        <main className="md:col-span-9 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm min-h-[500px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

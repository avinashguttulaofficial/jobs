import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  FileCheck2,
  FolderTree,
  Mail,
  Send,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Globe,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // STRICT ACCESS CONTROL: If not logged in or not admin, show access denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight uppercase">
            Restricted Admin Area
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            This administrative portal is strictly protected by Row-Level Security. Regular candidates do not have publishing or moderation privileges.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="px-4 py-2.5 bg-white text-[#121212] rounded text-xs font-semibold hover:bg-neutral-200 transition-colors"
            >
              Log in with Admin Account
            </Link>
            <Link
              to="/"
              className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded text-xs font-semibold hover:bg-neutral-700 transition-colors"
            >
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { label: 'Job Listings', path: '/admin/jobs', icon: Briefcase },
    { label: 'Himalayas Sync', path: '/admin/himalayas', icon: Globe },
    { label: 'Candidate Applications', path: '/admin/applications', icon: FileCheck2 },
    { label: 'Studios & Companies', path: '/admin/companies', icon: Building2 },
    { label: 'Registered Users', path: '/admin/users', icon: Users },
    { label: 'Categories & Skills', path: '/admin/categories', icon: FolderTree },
    { label: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { label: 'Subscribers', path: '/admin/subscribers', icon: Send },
    { label: 'Site Settings', path: '/admin/settings', icon: Sliders },
    { label: 'Admin Access', path: '/admin/admins', icon: ShieldCheck, superAdminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-neutral-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-neutral-900 text-white p-4 flex items-center justify-between border-b border-neutral-800">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white text-neutral-900 rounded flex items-center justify-center font-display font-black text-sm">
            W.
          </div>
          <span className="font-display font-bold text-base tracking-tight">GRAIL ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-neutral-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#121212] text-neutral-300 p-5 flex flex-col justify-between shrink-0 min-h-screen`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="hidden md:flex items-center justify-between border-b border-neutral-800 pb-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-white text-neutral-900 rounded flex items-center justify-center font-display font-black text-base group-hover:scale-105 transition-transform">
                W.
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight text-white block leading-none">
                  GRAIL
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              if (item.superAdminOnly && !isSuperAdmin) return null;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Account / Footer */}
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="min-w-0">
              <p className="font-semibold text-white truncate text-xs">{user.full_name}</p>
              <span className="text-[10px] font-mono text-neutral-400 capitalize">
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <Link
              to="/"
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="View Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Mini Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-neutral-200">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <span>Admin</span>
            <span>/</span>
            <span className="text-neutral-900 font-semibold uppercase">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/"
              className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium"
            >
              <span>View Live Marketplace</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <div className="h-4 w-[1px] bg-neutral-200" />
            <Link
              to="/admin/jobs/new"
              className="px-3 py-1.5 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              + Create Job
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

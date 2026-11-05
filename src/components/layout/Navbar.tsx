import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bookmark, Shield, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { DataStore } from '../../services/store';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const savedCount = user ? DataStore.getSavedJobs(user.id).length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Find Jobs', path: '/jobs' },
    { name: 'Companies', path: '/companies' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-md border-b border-neutral-200">
      {/* Editorial Top Marquee / Trust Bar (matching screenshot 5) */}
      <div className="bg-[#121212] text-white text-[11px] font-mono py-1.5 px-4 overflow-hidden flex items-center justify-between border-b border-neutral-900">
        <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="text-neutral-400">Curated opportunities for world-class creators & engineers</span>
          <span className="text-neutral-600">·</span>
          <span>Site of the Day Winner: <strong className="font-semibold text-white">GRAIL</strong></span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">Direct-to-consumer & high-growth design studios</span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Quick Demo Role Switcher to easily review both Seeker and Admin views */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
            >
              <span>Demo Role:</span>
              <span className="text-white font-medium capitalize">{user ? user.role.replace('_', ' ') : 'Guest'}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
            {roleSwitcherOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-neutral-900 text-white border border-neutral-800 rounded shadow-xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    switchDemoRole('seeker');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>Job Seeker (Sarah)</span>
                  {user?.role === 'user' && <span className="text-[10px] text-emerald-400">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('admin');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>Administrator (Alex)</span>
                  {user?.role === 'admin' && <span className="text-[10px] text-emerald-400">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('superadmin');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>Super Admin (Elena)</span>
                  {user?.role === 'super_admin' && <span className="text-[10px] text-emerald-400">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (matching screenshot 1 & 5) */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 bg-[#121212] text-white flex items-center justify-center font-display font-black text-xl tracking-tighter rounded">
            W.
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-[#121212] group-hover:opacity-80 transition-opacity">
            GRAIL
          </span>
        </Link>

        {/* Zone 2: Navigation Links (single line, no wrapping) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-[#121212] font-semibold border-b-2 border-[#121212]'
                    : 'hover:text-[#121212]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Search Input in Top Bar (matching screenshot 5) */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Jobs or Skills..."
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs pl-9 pr-3 py-2 rounded-full border border-transparent focus:border-neutral-300 focus:outline-none transition-all placeholder:text-neutral-400"
          />
        </form>

        {/* Zone 3: Actions & User Account */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/saved-jobs"
                className="p-2 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors relative"
                title="Saved Jobs"
              >
                <Bookmark className="w-4 h-4" />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#121212] rounded-full ring-2 ring-white" />
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#121212] text-white rounded hover:bg-neutral-800 transition-colors tracking-tight"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-100 rounded-full border border-neutral-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.full_name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] truncate hidden sm:inline">{user.full_name}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-xl py-1 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-900 truncate">{user.full_name}</p>
                      <p className="text-neutral-500 truncate text-[11px]">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard Overview</span>
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Candidate Profile</span>
                    </Link>

                    <Link
                      to="/dashboard/applications"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
                    >
                      <span>My Applications</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-neutral-900 font-semibold hover:bg-neutral-100 border-t border-neutral-100"
                      >
                        <Shield className="w-3.5 h-3.5 text-neutral-900" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-neutral-100 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:text-black transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#121212] rounded hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

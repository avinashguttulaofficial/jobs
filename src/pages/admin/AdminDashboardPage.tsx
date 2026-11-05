import React from 'react';
import { Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import {
  Briefcase,
  Users,
  FileCheck2,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const jobs = DataStore.getJobs();
  const applications = DataStore.getApplications();
  const users = DataStore.getUsers();
  const companies = DataStore.getCompanies();

  // Computed metrics (Section 5.1)
  const publishedJobs = jobs.filter((j) => j.status === 'published');
  const draftJobs = jobs.filter((j) => j.status === 'draft');
  const expiredJobs = jobs.filter((j) => j.status === 'expired');

  const pendingApps = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under_review'
  );
  const shortlistedApps = applications.filter((a) => a.status === 'shortlisted');

  const recentApplications = applications.slice(0, 5);
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Control Center
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
            Administrative Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs/new"
            className="px-4 py-2 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Job</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Published Roles</span>
            <Briefcase className="w-4 h-4 text-neutral-700" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {publishedJobs.length}
          </span>
          <div className="text-[11px] text-neutral-500 font-mono mt-1 flex items-center gap-2">
            <span>{draftJobs.length} drafts</span>
            <span>·</span>
            <span>{expiredJobs.length} expired</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Applications</span>
            <FileCheck2 className="w-4 h-4 text-neutral-700" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {applications.length}
          </span>
          <div className="text-[11px] text-neutral-500 font-mono mt-1 flex items-center gap-2">
            <span className="text-amber-600 font-semibold">{pendingApps.length} under review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Studios</span>
            <Building2 className="w-4 h-4 text-neutral-700" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {companies.length}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
            Verified partners
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Candidates Registered</span>
            <Users className="w-4 h-4 text-neutral-700" />
          </div>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {users.length}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
            Global talent pool
          </span>
        </div>
      </div>

      {/* Two Column Section: Recent Applications & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Applications Queue */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900">
                Incoming Candidate Applications
              </h3>
              <p className="text-xs text-neutral-500">Requires editorial triage and status updates</p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="divide-y divide-neutral-100 text-xs">
              {recentApplications.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-neutral-900">{app.user?.full_name}</p>
                    <p className="text-neutral-500 font-mono text-[11px]">
                      {app.job?.title} · {app.job?.company?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-neutral-700">
                      {app.status.replace('_', ' ')}
                    </span>
                    <Link
                      to="/admin/applications"
                      className="text-xs font-semibold text-neutral-900 hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 py-6 text-center">No applications logged yet.</p>
          )}
        </div>

        {/* Right: Recently Created Jobs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900">
                Recent Listings
              </h3>
              <p className="text-xs text-neutral-500">Published and drafted positions</p>
            </div>
            <Link
              to="/admin/jobs"
              className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>All Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {recentJobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">{job.title}</p>
                  <p className="text-neutral-400 font-mono text-[11px] truncate">
                    {job.company?.name} · {job.country}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      job.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {job.status}
                  </span>
                  <Link
                    to={`/admin/jobs/${job.id}/edit`}
                    className="text-neutral-600 hover:text-black font-semibold text-xs"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

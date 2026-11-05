import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { Send, Bookmark, FileText, CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const applications = DataStore.getUserApplications(user.id);
  const savedJobs = DataStore.getSavedJobs(user.id);
  const resumes = DataStore.getUserResumes(user.id);

  // Compute profile completeness
  const checks = [
    Boolean(user.full_name),
    Boolean(user.headline),
    Boolean(user.location),
    Boolean(user.phone),
    Boolean(user.professional_summary),
    Boolean(user.portfolio_url || user.linkedin_url),
    resumes.length > 0,
  ];
  const completedCount = checks.filter(Boolean).length;
  const completenessPercent = Math.round((completedCount / checks.length) * 100);

  // Status breakdowns
  const pendingCount = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview').length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  const recentApplications = applications.slice(0, 3);
  const recommendedJobs = DataStore.getJobs().filter((j) => j.status === 'published').slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Profile Completion Card */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 text-sm">
              Candidate Dossier Completeness
            </span>
            <span className="font-mono text-xs font-bold text-neutral-900">
              {completenessPercent}%
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            {completenessPercent < 100
              ? 'Complete your contact details, portfolio link, and upload a verified resume to stand out.'
              : 'Your profile is fully optimized for studio reviews.'}
          </p>
          <div className="w-48 sm:w-64 h-2 bg-neutral-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-500"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
        </div>

        <Link
          to="/dashboard/profile"
          className="px-3.5 py-1.5 bg-white border border-neutral-300 rounded text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors shrink-0"
        >
          Update Profile
        </Link>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Total Applied
          </span>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {applications.length}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Lifetime submissions</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Under Review
          </span>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {pendingCount}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Awaiting decision</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Shortlisted / Talks
          </span>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {shortlistedCount}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Active conversations</span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Bookmarked
          </span>
          <span className="font-display font-black text-3xl text-neutral-900 block">
            {savedJobs.length}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Saved positions</span>
        </div>
      </div>

      {/* Recent Applications Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-display font-bold text-lg text-neutral-900">
            Recent Application Activity
          </h3>
          <Link
            to="/dashboard/applications"
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="bg-neutral-50/50 border border-neutral-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold text-neutral-900 text-xs sm:text-sm">
                    {app.job?.title || 'Applied Position'}
                  </h4>
                  <p className="text-neutral-500 text-xs font-mono mt-0.5">
                    {app.job?.company?.name || 'Studio'} · Applied{' '}
                    {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-300 text-neutral-700 font-semibold bg-white">
                    {app.status.replace('_', ' ')}
                  </span>
                  <Link
                    to="/dashboard/applications"
                    className="text-xs text-neutral-900 font-semibold hover:underline"
                  >
                    View Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-neutral-200 rounded-lg text-xs text-neutral-500">
            You haven't submitted any job applications yet. Browse the board to discover matching roles.
          </div>
        )}
      </div>

      {/* Curated Recommendations */}
      <div className="space-y-4 pt-4">
        <h3 className="font-display font-bold text-lg text-neutral-900">
          Recommended Openings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                  {job.company?.name} · {job.country}
                </span>
                <Link
                  to={`/jobs/${job.slug}`}
                  className="font-bold text-sm text-neutral-900 hover:underline line-clamp-1"
                >
                  {job.title}
                </Link>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-mono text-neutral-600">
                <span>{job.workplace_type}</span>
                <Link to={`/jobs/${job.slug}`} className="font-semibold text-neutral-900 hover:underline">
                  Apply Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { Bookmark, Trash2, ArrowRight, Building2, MapPin } from 'lucide-react';

export const SavedJobsTab: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const savedJobs = DataStore.getSavedJobs(user.id);

  const handleRemove = (jobId: string) => {
    DataStore.toggleSaveJob(jobId, user.id);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-neutral-900">
            Bookmarked Opportunities
          </h2>
          <p className="text-xs text-neutral-500">
            Saved positions to revisit, compare, and apply for.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {savedJobs.length} Saved
        </span>
      </div>

      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedJobs.map((item) => {
            const job = item.job;
            if (!job) return null;

            return (
              <div
                key={item.id}
                className="p-5 border border-neutral-200 hover:border-neutral-900 rounded-xl transition-all flex flex-col justify-between bg-white group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {job.company?.name}
                    </span>
                    <button
                      onClick={() => handleRemove(job.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    to={`/jobs/${job.slug}`}
                    className="font-display font-bold text-base text-neutral-900 hover:underline block mb-2 leading-snug"
                  >
                    {job.title}
                  </Link>

                  <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-3">
                    <span>{job.location}</span>
                    <span>·</span>
                    <span className="uppercase">{job.employment_type}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900">
                    {job.salary_visible && job.salary_min
                      ? `$${job.salary_min.toLocaleString()}`
                      : 'Verified'}
                  </span>

                  <Link
                    to={`/jobs/${job.slug}`}
                    className="px-3 py-1.5 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-neutral-200 rounded-xl space-y-3">
          <p className="text-neutral-500 text-xs">
            You haven't bookmarked any jobs yet. Click the bookmark icon on any job card to save it here.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-4 py-2 bg-[#121212] text-white text-xs font-semibold rounded hover:bg-neutral-800"
          >
            Explore Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

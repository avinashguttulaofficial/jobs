import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { Bookmark, Clock, ArrowRight, ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, compact = false }) => {
  const { user } = useAuth();
  const isSaved = user ? DataStore.isJobSaved(job.id, user.id) : false;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark jobs to your personal dashboard.');
      return;
    }
    DataStore.toggleSaveJob(job.id, user.id);
  };

  const formatSalary = () => {
    if (!job.salary_visible || !job.salary_min) return null;
    const currency = job.salary_currency === 'EUR' ? '€' : job.salary_currency === 'GBP' ? '£' : '$';
    if (job.salary_max && job.salary_max !== job.salary_min) {
      return `${currency}${job.salary_min.toLocaleString()} – ${currency}${job.salary_max.toLocaleString()}/${job.salary_period === 'yearly' ? 'yr' : job.salary_period === 'hourly' ? 'hr' : 'mo'}`;
    }
    return `${currency}${job.salary_min.toLocaleString()}/${job.salary_period === 'yearly' ? 'yr' : job.salary_period === 'hourly' ? 'hr' : 'mo'}`;
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  };

  return (
    <div className="group relative bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-200 rounded-lg p-6 flex flex-col justify-between hover:shadow-sm">
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {job.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {job.company?.name.charAt(0) || 'G'}
              </div>
            )}
            <div className="min-w-0">
              <Link
                to={`/companies/${job.company?.slug || 'company'}`}
                className="text-sm font-semibold text-neutral-900 hover:underline truncate block"
              >
                {job.company?.name || 'Company'}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.experience_level && (
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 border border-neutral-200 text-neutral-500 rounded font-medium">
                {job.experience_level}
              </span>
            )}
            {job.workplace_type === 'remote' && (
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 border border-neutral-300 text-neutral-600 rounded">
                Remote
              </span>
            )}
            <button
              onClick={handleSaveToggle}
              className={`p-1.5 rounded transition-colors ${
                isSaved
                  ? 'text-[#121212] bg-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.slug}`} className="block group-hover:text-neutral-600 transition-colors">
          <h3 className="font-display font-bold text-lg text-neutral-900 leading-snug mb-3">
            {job.title}
          </h3>
        </Link>

        {/* Description Snippet */}
        {!compact && (
          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3 mb-6">
            {job.description}
          </p>
        )}
      </div>

      {/* Meta Specs & Footer (matching screenshot 4) */}
      <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-600">
        <div className="grid grid-cols-2 gap-y-2 mb-4 font-mono text-[11px]">
          <div>
            <span className="text-neutral-400 block text-[10px]">Location</span>
            <span className="text-neutral-900 truncate block">{job.country || job.location}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">Compensation</span>
            <span className="text-neutral-900 truncate block">{formatSalary() || 'Undisclosed'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo(job.published_at || job.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {job.external_application_url ? (
              <a
                href={job.external_application_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1 bg-[#121212] hover:bg-neutral-800 text-white text-[11px] font-mono font-semibold rounded flex items-center gap-1 transition-colors shadow-xs"
                title="Directly redirect to application link"
              >
                <span>Apply</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <Link
                to={`/jobs/${job.slug}`}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[11px] font-mono font-medium rounded flex items-center gap-1 transition-colors"
              >
                <span>Apply</span>
              </Link>
            )}

            <Link
              to={`/jobs/${job.slug}`}
              className="flex items-center justify-center w-7 h-7 rounded-full border border-neutral-200 text-neutral-700 group-hover:bg-[#121212] group-hover:text-white group-hover:border-[#121212] transition-colors"
              title="View full listing"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

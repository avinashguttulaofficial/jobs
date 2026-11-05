import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { JobCard } from '../../components/jobs/JobCard';
import { ArrowLeft, Share2, ExternalLink, Bookmark, CheckCircle2, Globe, Building2, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const job = DataStore.getJobBySlug(slug || '');

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-3xl text-neutral-900">Job Not Found</h2>
        <p className="text-neutral-500 text-sm">
          The requested position may have expired or been removed by an administrator.
        </p>
        <Link
          to="/jobs"
          className="inline-block px-5 py-2.5 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800"
        >
          Return to All Jobs
        </Link>
      </div>
    );
  }

  const isSaved = user ? DataStore.isJobSaved(job.id, user.id) : false;
  const hasApplied = user ? DataStore.hasUserApplied(job.id, user.id) : false;

  const handleSaveToggle = () => {
    if (!user) {
      alert('Please log in to bookmark jobs to your personal dashboard.');
      return;
    }
    DataStore.toggleSaveJob(job.id, user.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const similarJobs = DataStore.getJobs()
    .filter((j) => j.id !== job.id && (j.category_id === job.category_id || j.workplace_type === job.workplace_type))
    .slice(0, 3);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Active Listing';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSalary = () => {
    if (!job.salary_visible || !job.salary_min) return 'Competitive compensation based on craft';
    const currency = job.salary_currency === 'EUR' ? '€' : job.salary_currency === 'GBP' ? '£' : '$';
    if (job.salary_max && job.salary_max !== job.salary_min) {
      return `${currency}${job.salary_min.toLocaleString()} – ${currency}${job.salary_max.toLocaleString()} per ${job.salary_period}`;
    }
    return `${currency}${job.salary_min.toLocaleString()} per ${job.salary_period}`;
  };

  return (
    <div className="pb-24">
      {/* Top Navigation Row (matching screenshot 6) */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs">
          <Link
            to="/jobs"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Jobs</span>
          </Link>

          <div className="flex items-center gap-3">
            {job.external_application_url && (
              <a
                href={job.external_application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 font-mono shadow-xs"
                title="Directly redirect to external application link"
              >
                <span>Apply on Himalayas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={handleShare}
              className="p-2 text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
              title="Share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied URL!' : 'Share'}</span>
            </button>
            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded hover:bg-neutral-50 transition-colors"
                title="Visit website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Editorial Hero (matching screenshot 6) */}
      <div className="bg-white border-b border-neutral-200 py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">
            Job Opportunity
          </span>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#121212] uppercase leading-[1.05]">
            {job.title}
          </h1>

          <div className="pt-2 flex items-center justify-center gap-2 text-sm text-neutral-700">
            <span>by</span>
            <Link
              to={`/companies/${job.company?.slug || ''}`}
              className="font-semibold text-neutral-900 hover:underline flex items-center gap-2"
            >
              {job.company?.logo_url && (
                <img
                  src={job.company.logo_url}
                  alt={job.company.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <span>{job.company?.name || 'Studio'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Structured Metadata Table (exact layout matching screenshot 7) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10 mb-12">
        <div className="bg-white border border-neutral-300 rounded-lg shadow-sm overflow-hidden grid grid-cols-2 sm:grid-cols-5 text-left text-xs divide-x divide-y sm:divide-y-0 divide-neutral-200">
          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Date Posted
            </span>
            <span className="font-semibold text-neutral-900 text-sm block">
              {formatDate(job.published_at || job.created_at)}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Category
            </span>
            <span className="font-semibold text-neutral-900 text-sm block">
              {job.category?.name || 'Design'}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Country
            </span>
            <span className="font-semibold text-neutral-900 text-sm block">
              {job.country || 'Global'}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Type
            </span>
            <span className="font-semibold text-neutral-900 uppercase text-sm block">
              {job.employment_type}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Location
            </span>
            <span className="font-semibold text-neutral-900 uppercase text-sm block">
              {job.workplace_type}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body Content & Sidebar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Job Description & Specifications (matching screenshot 7) */}
        <div className="lg:col-span-8 space-y-10">
          {/* About Company */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-neutral-900">
              About {job.company?.name || 'the Studio'}
            </h2>
            <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
              {job.company?.description}
            </p>
          </section>

          {/* Role Overview */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-neutral-900">
              Position Overview
            </h2>
            <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-neutral-900">
                Key Responsibilities
              </h2>
              <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside leading-relaxed">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements & Skills */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-neutral-900">
                Requirements & Experience
              </h2>
              <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside leading-relaxed">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills Required Tags */}
          {job.skills && job.skills.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-neutral-900">
                Relevant Technologies & Disciplines
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-neutral-300 rounded text-xs font-mono text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-neutral-900">
                Compensation & Benefits
              </h2>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-3 text-xs font-mono text-neutral-800">
                <strong>Package:</strong> {formatSalary()}
              </div>
              <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside leading-relaxed">
                {job.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column: Sticky Action Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-white border border-neutral-300 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Verified Opportunity
              </span>
              <h3 className="font-display font-bold text-lg text-neutral-900 leading-snug">
                {job.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">{job.location} · {job.employment_type}</p>
            </div>

            {applicationSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Application Submitted!</span>
                </div>
                <p className="text-emerald-700">
                  Your profile and resume have been delivered to {job.company?.name}. Track your status in your dashboard.
                </p>
                <Link
                  to="/dashboard/applications"
                  className="inline-block mt-1 font-semibold underline text-emerald-900"
                >
                  Go to My Applications
                </Link>
              </div>
            ) : hasApplied ? (
              <div className="p-4 bg-neutral-100 rounded-lg text-xs space-y-2 text-neutral-700">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Already Applied</span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  You submitted an application for this position.
                </p>
                <Link
                  to="/dashboard/applications"
                  className="inline-block font-semibold underline text-neutral-900"
                >
                  View Application Status
                </Link>
              </div>
            ) : job.external_application_url || job.application_mode === 'external' ? (
              <div className="space-y-3">
                <a
                  href={job.external_application_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-mono shadow-sm flex items-center justify-center gap-2 group text-center"
                >
                  <span>Apply on Company Site / Himalayas</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <Globe className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Direct Application Link</span>
                  </div>
                  <p className="text-neutral-500 truncate font-mono text-[10px]">
                    {job.external_application_url}
                  </p>
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    Clicking redirects directly to the official remote application link hosted on Himalayas.
                  </p>
                </div>

                <button
                  onClick={handleSaveToggle}
                  className={`w-full py-2.5 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isSaved
                      ? 'bg-neutral-100 border-neutral-300 text-neutral-900'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved to Dashboard' : 'Save Job'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-3 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-mono shadow-sm"
                >
                  Apply For This Position
                </button>

                <button
                  onClick={handleSaveToggle}
                  className={`w-full py-2.5 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isSaved
                      ? 'bg-neutral-100 border-neutral-300 text-neutral-900'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved to Dashboard' : 'Save Job'}</span>
                </button>
              </div>
            )}

            {/* Quick Studio Snapshot */}
            <div className="border-t border-neutral-100 pt-4 space-y-3 text-xs">
              <h4 className="font-semibold text-neutral-900">Studio Snapshot</h4>
              <div className="space-y-2 text-neutral-600 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Headquarters</span>
                  <span className="font-medium text-neutral-800">{job.company?.headquarters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Team Size</span>
                  <span className="font-medium text-neutral-800">{job.company?.company_size} people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Industry</span>
                  <span className="font-medium text-neutral-800">{job.company?.industry}</span>
                </div>
                {job.company?.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Website</span>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-neutral-900 underline truncate max-w-[150px]"
                    >
                      {job.company.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Opportunities Section */}
      {similarJobs.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-neutral-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-2xl text-neutral-900 uppercase">
              Similar Opportunities
            </h3>
            <Link to="/jobs" className="text-xs font-semibold text-neutral-800 hover:underline">
              View all listings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarJobs.map((sim) => (
              <JobCard key={sim.id} job={sim} compact />
            ))}
          </div>
        </section>
      )}

      {/* Application Modal */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => {
          setApplyModalOpen(false);
          setApplicationSuccess(true);
        }}
      />
    </div>
  );
};

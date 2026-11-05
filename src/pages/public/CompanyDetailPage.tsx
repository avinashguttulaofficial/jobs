import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { JobCard } from '../../components/jobs/JobCard';
import { ArrowLeft, ExternalLink, Globe, MapPin, Users, Building } from 'lucide-react';

export const CompanyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const company = DataStore.getCompanyBySlug(slug || '');

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-3xl text-neutral-900">Studio Not Found</h2>
        <p className="text-neutral-500 text-sm">
          The requested company profile is not found or has been modified.
        </p>
        <Link
          to="/companies"
          className="inline-block px-5 py-2.5 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800"
        >
          Return to Studios Directory
        </Link>
      </div>
    );
  }

  const jobs = DataStore.getJobs().filter(
    (j) => j.company_id === company.id && j.status === 'published'
  );

  return (
    <div className="pb-24 space-y-12">
      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-neutral-900 overflow-hidden">
        {company.cover_url ? (
          <img
            src={company.cover_url}
            alt={company.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}

        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/companies"
            className="px-3 py-1.5 bg-black/60 text-white rounded backdrop-blur-md text-xs font-medium flex items-center gap-2 hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Studios</span>
          </Link>
        </div>
      </div>

      {/* Studio Header Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white border border-neutral-300 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 text-white font-display font-black text-2xl flex items-center justify-center">
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Verified Studio
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                {company.name}
              </h1>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                {company.industry} · {company.headquarters}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Details & Active Jobs Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: About & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Company Overview
            </h3>
            <p className="text-neutral-600 leading-relaxed text-xs">
              {company.description}
            </p>

            <div className="pt-4 border-t border-neutral-100 space-y-2.5 font-mono text-[11px] text-neutral-600">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Headquarters</span>
                <span className="font-semibold text-neutral-900">{company.headquarters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Company Size</span>
                <span className="font-semibold text-neutral-900">{company.company_size} members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Industry</span>
                <span className="font-semibold text-neutral-900">{company.industry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Active Listings</span>
                <span className="font-semibold text-neutral-900">{jobs.length} open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Open Positions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl text-neutral-900 uppercase">
              Open Positions ({jobs.length})
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center text-xs text-neutral-500">
              There are currently no active open positions published for {company.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

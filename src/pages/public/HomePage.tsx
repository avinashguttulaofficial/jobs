import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { JobCard } from '../../components/jobs/JobCard';
import { Search, MapPin, ArrowRight, Sparkles, Building2, Globe2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);

  const jobs = DataStore.getJobs().filter((j) => j.status === 'published');
  const featuredJobs = jobs.filter((j) => j.is_featured).slice(0, 6);
  const latestJobs = jobs.slice(0, 6);
  const categories = DataStore.getCategories();
  const companies = DataStore.getCompanies();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.set('q', searchTitle.trim());
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    if (isRemoteOnly) params.set('workplace', 'remote');
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section (Awwwards Editorial Style) */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 border border-neutral-300 rounded-full px-3 py-1 bg-white">
            <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
            <span>Awwwards Curated Recruitment · 2026 Edition</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#121212] uppercase leading-[0.95]">
            Find work that moves you forward.
          </h1>

          <p className="text-neutral-600 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Discover opportunities from companies building the future. Curated roles in design systems, creative web engineering, art direction, and digital products.
          </p>

          {/* Search Form */}
          <div className="pt-6 max-w-3xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white p-3 rounded-2xl border border-neutral-300 shadow-xl shadow-neutral-200/50 flex flex-col md:flex-row items-center gap-3"
            >
              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full border-b md:border-b-0 md:border-r border-neutral-200">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Job title, role, or skill (e.g. Figma, React)..."
                  className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full border-b md:border-b-0 md:border-r border-neutral-200">
                <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Location, country, or city..."
                  className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-4 px-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-600 select-none whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isRemoteOnly}
                    onChange={(e) => setIsRemoteOnly(e.target.checked)}
                    className="rounded text-neutral-900 focus:ring-0"
                  />
                  <span>Remote Only</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#121212] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors shrink-0 flex items-center gap-2"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-neutral-500">
              <span className="font-mono text-[11px] text-neutral-400">Popular:</span>
              <button
                type="button"
                onClick={() => navigate('/jobs?q=UI%2FUX')}
                className="hover:text-neutral-900 underline underline-offset-4"
              >
                UI/UX Design
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigate('/jobs?q=Design%20Systems')}
                className="hover:text-neutral-900 underline underline-offset-4"
              >
                Design Systems
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigate('/jobs?q=Motion')}
                className="hover:text-neutral-900 underline underline-offset-4"
              >
                Lottie & Motion
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigate('/jobs?workplace=remote')}
                className="hover:text-neutral-900 underline underline-offset-4"
              >
                Worldwide Remote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted Companies Banner */}
      <section className="border-y border-neutral-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-6">
            Opportunities from premier creative agencies & consumer flagships
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80 grayscale hover:grayscale-0 transition-all">
            {companies.slice(0, 6).map((comp) => (
              <Link
                key={comp.id}
                to={`/companies/${comp.slug}`}
                className="flex items-center gap-2 font-display font-bold text-lg text-neutral-800 hover:text-black tracking-tight"
              >
                {comp.logo_url && (
                  <img
                    src={comp.logo_url}
                    alt={comp.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{comp.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Job Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              Curated Openings
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#121212] tracking-tight uppercase">
              Featured Positions
            </h2>
          </div>
          <Link
            to="/jobs?featured=true"
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1.5"
          >
            <span>View all featured roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 4. Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Specialized Disciplines
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#121212] tracking-tight uppercase">
            Browse by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/jobs?category=${cat.slug}`}
              className="bg-white p-6 rounded-lg border border-neutral-200 hover:border-neutral-900 transition-all hover:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-black mb-1">
                  {cat.name}
                </h3>
                <p className="text-neutral-500 text-xs line-clamp-2">
                  {cat.description}
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-neutral-900">
                <span>{cat.job_count || 0} Openings</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Latest Job Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              Fresh Dispatch
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#121212] tracking-tight uppercase">
              Latest Additions
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1.5"
          >
            <span>Explore all {jobs.length} jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 6. Why Use Grail Jobs (Editorial Proposition) */}
      <section className="bg-white border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              Editorial Standards
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[#121212] tracking-tight uppercase leading-tight">
              A recruitment platform built without noise or AI spam.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-700">
            <div className="space-y-3 p-6 rounded-lg border border-neutral-200 bg-neutral-50/50">
              <ShieldCheck className="w-6 h-6 text-neutral-900" />
              <h3 className="font-display font-bold text-lg text-neutral-900">
                100% Administrator Curated
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Only authorized platform administrators may create and publish roles. No unverified third-party recruiters or automated resume scrapers.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg border border-neutral-200 bg-neutral-50/50">
              <CheckCircle2 className="w-6 h-6 text-neutral-900" />
              <h3 className="font-display font-bold text-lg text-neutral-900">
                Transparent Compensation
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Every listing features verified compensation ranges, hourly rates, or clear equity structures upfront. No guessing games.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg border border-neutral-200 bg-neutral-50/50">
              <Globe2 className="w-6 h-6 text-neutral-900" />
              <h3 className="font-display font-bold text-lg text-neutral-900">
                Global Remote Alignment
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Structured for international talent. Direct contracts, freelance retainers, and full-time positions across the US, Europe, and Asia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] text-white rounded-2xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Take the next step
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight uppercase leading-tight">
              Ready to elevate your career with visionary studios?
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Create your candidate profile, upload your resume, and apply to top design and engineering positions in seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/jobs"
              className="px-6 py-3 bg-white text-[#121212] rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap"
            >
              Explore Openings
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 border border-neutral-700 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-900 transition-colors whitespace-nowrap"
            >
              Create Free Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

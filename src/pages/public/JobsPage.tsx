import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { Job, WorkplaceType, EmploymentType, ExperienceLevel } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { Search, RotateCcw, LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const typeParam = searchParams.get('type') || 'all';
  const countryParam = searchParams.get('country') || 'all';
  const workplaceParam = searchParams.get('workplace') || 'all';
  const experienceParam = searchParams.get('experience') || 'all';
  const featuredOnly = searchParams.get('featured') === 'true';
  const sortParam = searchParams.get('sort') || 'latest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state for debounced search and active filter values
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  // Keep URL parameters in sync
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('q', searchTerm);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  };

  // Get data from store
  const allJobs = DataStore.getJobs().filter((j) => j.status === 'published');
  const categories = DataStore.getCategories();

  // Extract distinct countries from current jobs
  const distinctCountries = useMemo(() => {
    const list = Array.from(new Set(allJobs.map((j) => j.country))).filter(Boolean);
    return list.sort();
  }, [allJobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Search keyword
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company?.name.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesSkill = job.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkill) return false;
      }

      // Category
      if (categoryParam !== 'all') {
        if (job.category?.slug !== categoryParam && job.category_id !== categoryParam) {
          return false;
        }
      }

      // Employment Type
      if (typeParam !== 'all' && job.employment_type !== typeParam) {
        return false;
      }

      // Country
      if (countryParam !== 'all' && job.country.toLowerCase() !== countryParam.toLowerCase()) {
        return false;
      }

      // Workplace Type (Remote, Hybrid, On-site)
      if (workplaceParam !== 'all' && job.workplace_type !== workplaceParam) {
        return false;
      }

      // Experience Level
      if (experienceParam !== 'all' && job.experience_level !== experienceParam) {
        return false;
      }

      // Featured filter
      if (featuredOnly && !job.is_featured) {
        return false;
      }

      return true;
    });
  }, [allJobs, queryParam, categoryParam, typeParam, countryParam, workplaceParam, experienceParam, featuredOnly]);

  // Sorting
  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (sortParam === 'salary') {
      return list.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    }
    // Default: latest
    return list.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }, [filteredJobs, sortParam]);

  // Pagination (6 jobs per page)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage) || 1;
  const currentPage = Math.min(Math.max(pageParam, 1), totalPages);
  const paginatedJobs = sortedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Count active non-default filters
  const activeFiltersCount = [
    categoryParam !== 'all',
    typeParam !== 'all',
    countryParam !== 'all',
    workplaceParam !== 'all',
    experienceParam !== 'all',
    featuredOnly,
    Boolean(queryParam),
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Editorial Hero Banner Matching Screenshot 5 */}
      <div className="text-center pt-6 pb-2 max-w-4xl mx-auto space-y-4">
        <div className="relative inline-block">
          <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-9xl tracking-tight text-[#121212] leading-[0.9] uppercase select-none">
            THE JOBS<br />BOARD
          </h1>
          {/* HIRING sticker badge from screenshot 5 */}
          <span className="absolute -top-1 -right-6 sm:-top-2 sm:-right-8 bg-[#2563EB] text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md transform rotate-12">
            Hiring
          </span>
        </div>

        <p className="text-neutral-600 text-sm sm:text-lg font-medium max-w-xl mx-auto pt-2">
          Latest Vacancies in Web Design, UX/UI Design, and Creative Engineering
        </p>

        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-neutral-500 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synchronized with Himalayas Remote Network (112,000+ roles)</span>
        </div>
      </div>

      {/* Control Filter Bar (matching screenshot 5) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Primary Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, studio, or skill..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors"
            />
          </form>

          {/* Quick Filter Selects */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={categoryParam}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">Category: All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Employment Type Dropdown */}
            <select
              value={typeParam}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="full-time">Full-Time</option>
              <option value="freelance">Freelance</option>
              <option value="contract">Contract</option>
              <option value="part-time">Part-Time</option>
            </select>

            {/* Country Dropdown */}
            <select
              value={countryParam}
              onChange={(e) => updateFilter('country', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">Country: All</option>
              {distinctCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Workplace Dropdown */}
            <select
              value={workplaceParam}
              onChange={(e) => updateFilter('workplace', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">Workplace: All</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>

            {/* Experience Level Dropdown */}
            <select
              value={experienceParam}
              onChange={(e) => updateFilter('experience', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">Experience: All</option>
              <option value="freshers">Freshers / Graduate (0-1 yr)</option>
              <option value="entry">Entry (1-2 yrs)</option>
              <option value="mid">Mid-Level (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
              <option value="lead">Lead / Principal</option>
              <option value="executive">Director / VP</option>
            </select>

            {/* Reset Filters */}
            <button
              onClick={resetAllFilters}
              disabled={activeFiltersCount === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeFiltersCount > 0
                  ? 'text-neutral-900 bg-neutral-100 hover:bg-neutral-200'
                  : 'text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-neutral-900 text-white font-mono text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
              <span>Reset</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex sm:hidden items-center justify-between">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-neutral-200 rounded-lg"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
            {activeFiltersCount > 0 && (
              <button onClick={resetAllFilters} className="text-xs text-neutral-600 underline">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {mobileFiltersOpen && (
          <div className="sm:hidden pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
            <select
              value={categoryParam}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 p-2 rounded"
            >
              <option value="all">Category: All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <select
              value={typeParam}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 p-2 rounded"
            >
              <option value="all">Type: All</option>
              <option value="full-time">Full-Time</option>
              <option value="freelance">Freelance</option>
              <option value="contract">Contract</option>
            </select>
            <select
              value={countryParam}
              onChange={(e) => updateFilter('country', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 p-2 rounded"
            >
              <option value="all">Country: All</option>
              {distinctCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={workplaceParam}
              onChange={(e) => updateFilter('workplace', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 p-2 rounded"
            >
              <option value="all">Workplace: All</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select
              value={experienceParam}
              onChange={(e) => updateFilter('experience', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 p-2 rounded"
            >
              <option value="all">Experience: All</option>
              <option value="freshers">Freshers / Graduate (0-1 yr)</option>
              <option value="entry">Entry (1-2 yrs)</option>
              <option value="mid">Mid-Level (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
              <option value="lead">Lead / Principal</option>
              <option value="executive">Director / VP</option>
            </select>
          </div>
        )}
      </div>

      {/* Results Header: Opportunities counter and view switch */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 text-xs">
        <div className="font-mono text-neutral-600">
          <strong className="text-neutral-900 font-bold">{sortedJobs.length}</strong> job {sortedJobs.length === 1 ? 'opportunity' : 'opportunities'} waiting.
        </div>

        <div className="flex items-center gap-4">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent text-xs font-medium text-neutral-800 border-none focus:outline-none cursor-pointer"
            >
              <option value="latest">Latest Added</option>
              <option value="salary">Highest Compensation</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-neutral-200 rounded p-0.5 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-black'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-black'}`}
              title="Compact View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Job Cards Grid / List */}
      {paginatedJobs.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'grid grid-cols-1 gap-4'
          }
        >
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} compact={viewMode === 'list'} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-4">
          <h3 className="font-display font-bold text-xl text-neutral-900">
            No Opportunities Match Your Current Criteria
          </h3>
          <p className="text-neutral-500 text-xs max-w-md mx-auto leading-relaxed">
            Try adjusting your search terms, broadening country requirements, or clearing selected filters to view all openings.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-[#121212] text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
          <p className="text-xs text-neutral-500 font-mono">
            Showing Page <span className="font-semibold text-neutral-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-neutral-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateFilter('page', String(currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-2 border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => updateFilter('page', String(p))}
                  className={`w-8 h-8 rounded text-xs font-mono font-medium transition-colors ${
                    p === currentPage
                      ? 'bg-[#121212] text-white'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => updateFilter('page', String(currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 border border-neutral-200 rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

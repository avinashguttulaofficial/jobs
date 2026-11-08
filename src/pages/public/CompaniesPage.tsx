import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { Search, RotateCcw, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const industryParam = searchParams.get('industry') || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    if (key !== 'page') {
      newParams.delete('page'); // Reset to page 1 on filter change
    }
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

  const companies = DataStore.getCompanies();

  const industries = useMemo(() => {
    return Array.from(new Set(companies.map((c) => c.industry))).filter(Boolean);
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        const matchesCountry = c.country.toLowerCase().includes(q);
        const matchesDesc = c.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesCountry && !matchesDesc) return false;
      }
      if (industryParam !== 'all' && c.industry !== industryParam) {
        return false;
      }
      return true;
    });
  }, [companies, queryParam, industryParam]);

  // Pagination (9 companies per page for balanced 3-column grid)
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const currentPage = Math.min(Math.max(pageParam, 1), totalPages);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(newPage, 1), totalPages);
    const newParams = new URLSearchParams(searchParams);
    if (clamped <= 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', String(clamped));
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const activeFiltersCount = [
    Boolean(queryParam),
    industryParam !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header matching Screenshot 3 */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
          Directory
        </span>
        <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#121212] uppercase leading-[0.95]">
          W.STUDIOS
        </h1>
        <p className="text-neutral-600 text-base sm:text-lg max-w-xl mx-auto">
          Active studios, creative agencies, and digital product leaders hiring top talent.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by studio name or location (e.g. Paris, New York)..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs sm:text-sm border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={industryParam}
            onChange={(e) => updateFilter('industry', e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors shrink-0"
              title="Reset Filters"
            >
              <span>Reset</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Directory Count Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 text-xs">
        <div className="font-mono text-neutral-600">
          <strong className="text-neutral-900 font-bold">{filteredCompanies.length}</strong> {filteredCompanies.length === 1 ? 'studio' : 'studios'} featured in directory.
        </div>
      </div>

      {/* Companies Grid (matching screenshot 3 style) */}
      {paginatedCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl p-6 transition-all hover:shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:text-black">
                        {company.name}
                      </h3>
                      <span className="text-xs font-mono text-neutral-400 block">{company.industry}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded font-semibold shrink-0">
                    {company.active_jobs_count || 0} Openings
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-6">
                  {company.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{company.headquarters}</span>
                </div>

                <Link
                  to={`/companies/${company.slug}`}
                  className="font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-4">
          <h3 className="font-display font-bold text-xl text-neutral-900">
            No Studios Found
          </h3>
          <p className="text-neutral-500 text-xs max-w-md mx-auto leading-relaxed">
            No companies match your current search criteria. Try modifying your keywords or resetting the industry filter.
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 pt-6">
          <p className="text-xs text-neutral-500 font-mono text-center sm:text-left">
            Showing Page <span className="font-semibold text-neutral-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-neutral-900">{totalPages}</span>{' '}
            <span className="text-neutral-400">({filteredCompanies.length} total studios)</span>
          </p>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 px-2.5 sm:px-3 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {getPaginationNumbers(currentPage, totalPages).map((item, idx) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs font-mono text-neutral-400 select-none"
                  >
                    …
                  </span>
                );
              }
              const p = item as number;
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                    isActive
                      ? 'bg-[#121212] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 px-2.5 sm:px-3 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition-colors"
              title="Next Page"
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

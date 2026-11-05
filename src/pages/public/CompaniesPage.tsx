import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { Company } from '../../types';
import { Search, Globe, ArrowRight, Building2, MapPin } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const companies = DataStore.getCompanies();

  const industries = useMemo(() => {
    return Array.from(new Set(companies.map((c) => c.industry))).filter(Boolean);
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        const matchesCountry = c.country.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesCountry) return false;
      }
      if (selectedIndustry !== 'all' && c.industry !== selectedIndustry) {
        return false;
      }
      return true;
    });
  }, [companies, searchTerm, selectedIndustry]);

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
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by studio name or location (e.g. Paris, New York)..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs sm:text-sm border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid (matching screenshot 3 style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
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
    </div>
  );
};

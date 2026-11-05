import React, { useState, useEffect } from 'react';
import { HimalayasService, HimalayasRawJob } from '../../services/himalayas';
import {
  Globe,
  Download,
  CheckCircle2,
  ExternalLink,
  Search,
  RefreshCw,
  Sparkles,
  Briefcase,
  Building2,
  DollarSign,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHimalayasPage: React.FC = () => {
  const [jobs, setJobs] = useState<HimalayasRawJob[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedSlugs, setImportedSlugs] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadHimalayasFeed = async () => {
    setLoading(true);
    try {
      const res = await HimalayasService.fetchJobs({ limit: 12 });
      setJobs(res.jobs);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHimalayasFeed();
  }, []);

  const handleImportSingle = async (job: HimalayasRawJob) => {
    setImportingId(job.guid || job.title);
    try {
      HimalayasService.importJob(job);
      setImportedSlugs((prev) => new Set(prev).add(job.companySlug + job.title));
      setNotice(`Successfully imported "${job.title}" by ${job.companyName} into Grail Jobs.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setImportingId(null);
    }
  };

  const handleBatchSync = async () => {
    setLoading(true);
    let count = 0;
    try {
      const candidates = jobs.slice(0, 5);
      for (const item of candidates) {
        HimalayasService.importJob(item);
        setImportedSlugs((prev) => new Set(prev).add(item.companySlug + item.title));
        count++;
      }
      setNotice(`Batch synced ${count} remote positions from Himalayas into platform listings.`);
      setTimeout(() => setNotice(null), 5000);
    } catch (err: any) {
      alert(`Batch sync failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      j.categories?.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Extension Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold">
              Himalayas Plugin Extension · Connected
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
            Himalayas Remote Jobs Sync
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Synchronize live remote opportunities directly from{' '}
            <a
              href="https://github.com/Himalayas-App/himalayas-plugin"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-900 underline font-mono"
            >
              Himalayas-App/himalayas-plugin
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHimalayasFeed}
            disabled={loading}
            className="px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>

          <button
            onClick={handleBatchSync}
            disabled={loading || jobs.length === 0}
            className="px-4 py-2 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Batch Sync 5 Roles</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Network Stats Card */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Himalayas Network Pool
          </span>
          <span className="font-display font-black text-3xl">
            {totalCount ? totalCount.toLocaleString() : '112,000+'}
          </span>
          <span className="text-[11px] text-neutral-400 block mt-1">Verified remote vacancies</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Plugin Protocol
          </span>
          <span className="font-display font-bold text-xl block">MCP & JSON REST</span>
          <span className="text-[11px] text-neutral-400 block mt-1">Cursor pagination v2</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Target Destination
          </span>
          <span className="font-display font-bold text-xl block">Grail Jobs Database</span>
          <Link
            to="/admin/jobs"
            className="text-[11px] text-emerald-400 underline block mt-1 hover:text-emerald-300"
          >
            Review all imported listings →
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter live Himalayas stream by title, company, or category..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 text-xs">
            Live Stream Feed ({filteredJobs.length} loaded)
          </h3>
          <span className="text-[11px] font-mono text-neutral-500">Source: himalayas.app/jobs/api</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-neutral-400 space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-neutral-600" />
            <p>Streaming remote vacancies from Himalayas...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 font-mono text-neutral-500 uppercase text-[10px]">
                  <th className="py-3 px-4">Role & Studio</th>
                  <th className="py-3 px-4">Seniority</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Location Scope</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredJobs.map((job, idx) => {
                  const key = job.companySlug + job.title;
                  const isImported = importedSlugs.has(key);
                  const isBusy = importingId === (job.guid || job.title);

                  return (
                    <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                              {job.companyName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-neutral-900 block">{job.title}</span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              {job.companyName} · {job.employmentType || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                        {job.seniority?.join(', ') || 'Mid-level'}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-800">
                        {job.minSalary
                          ? `${job.currency || '$'}${job.minSalary.toLocaleString()} ${job.maxSalary && job.maxSalary !== job.minSalary ? `– ${job.maxSalary.toLocaleString()}` : ''}`
                          : 'Undisclosed'}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                        {job.locationRestrictions?.length
                          ? job.locationRestrictions.slice(0, 2).join(', ') + (job.locationRestrictions.length > 2 ? '...' : '')
                          : 'Worldwide'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.applicationLink && (
                            <a
                              href={job.applicationLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-neutral-400 hover:text-neutral-900"
                              title="Inspect on Himalayas"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => handleImportSingle(job)}
                            disabled={isImported || isBusy}
                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isImported
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                                : 'bg-[#121212] text-white hover:bg-neutral-800'
                            }`}
                          >
                            {isImported ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Imported</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3" />
                                <span>{isBusy ? 'Importing...' : 'Import to Board'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-neutral-500">
            No remote positions returned from the live stream. Click "Refresh Feed" to pull updates.
          </div>
        )}
      </div>
    </div>
  );
};

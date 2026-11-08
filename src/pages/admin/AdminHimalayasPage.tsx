import React, { useState, useEffect, useMemo } from 'react';
import { HimalayasService, HimalayasRawJob } from '../../services/himalayas';
import { DataStore } from '../../services/store';
import { Job } from '../../types';
import {
  Globe,
  Download,
  CheckCircle2,
  ExternalLink,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Clock,
  RotateCcw,
  MapPin,
  Tag,
  DollarSign,
  ArrowUpDown,
  Check,
  Edit3,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminHimalayasPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<HimalayasRawJob[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedSlugs, setImportedSlugs] = useState<Set<string>>(new Set());
  const [existingDbJobs, setExistingDbJobs] = useState<Job[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [streamingMore, setStreamingMore] = useState(false);

  // Status Filter for Table: all, sync (ready to sync / unimported), imported
  const [syncStatusFilter, setSyncStatusFilter] = useState<'all' | 'sync' | 'imported'>('all');

  // Filter state for batch sync
  const [searchTerm, setSearchTerm] = useState('');
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [timezoneFilter, setTimezoneFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState<'all' | 'recent' | 'oldest' | 'salary' | 'salary_asc' | 'relevant' | 'company' | 'title'>('all');
  const [batchSyncLimit, setBatchSyncLimit] = useState<number>(5);

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState<HimalayasRawJob | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    companyName: '',
    seniority: 'Mid-level',
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    location: '',
    employmentType: 'Full Time',
    applicationLink: '',
    excerpt: '',
  });

  const refreshExistingDbJobs = () => {
    try {
      const dbList = DataStore.getJobs();
      setExistingDbJobs(dbList);
    } catch (e) {
      console.warn('Failed to read DataStore jobs:', e);
    }
  };

  const isJobImported = (job: HimalayasRawJob): boolean => {
    const key = job.companySlug + job.title;
    if (importedSlugs.has(key)) return true;
    return existingDbJobs.some(
      (dbJob) =>
        dbJob.title.toLowerCase().trim() === job.title.toLowerCase().trim() ||
        (job.guid && dbJob.external_application_url === job.guid) ||
        (job.applicationLink && dbJob.external_application_url === job.applicationLink)
    );
  };

  const getImportedDbJob = (job: HimalayasRawJob): Job | undefined => {
    return existingDbJobs.find(
      (dbJob) =>
        dbJob.title.toLowerCase().trim() === job.title.toLowerCase().trim() ||
        (job.guid && dbJob.external_application_url === job.guid) ||
        (job.applicationLink && dbJob.external_application_url === job.applicationLink)
    );
  };

  const loadHimalayasFeed = async () => {
    setLoading(true);
    try {
      // Fetch multi-page live stream feed (~100 jobs across 5 pages) for rich filtering & batch sync
      const res = await HimalayasService.fetchJobs({ limit: 20, pages: 5 });
      setJobs(res.jobs);
      setTotalCount(res.totalCount);
      setCursor(res.nextCursor);
    } catch (err) {
      console.error('Failed to load Himalayas live feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamMore = async () => {
    if (!cursor || streamingMore) return;
    setStreamingMore(true);
    try {
      const res = await HimalayasService.fetchJobs({ cursor, pages: 3 });
      setJobs((prev) => [...prev, ...res.jobs]);
      setCursor(res.nextCursor);
      setNotice(`Streamed ${res.jobs.length} additional live vacancies into feed.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.error('Failed to stream more vacancies:', err);
    } finally {
      setStreamingMore(false);
    }
  };

  useEffect(() => {
    loadHimalayasFeed();
    refreshExistingDbJobs();
  }, []);

  const handleImportSingle = async (job: HimalayasRawJob) => {
    setImportingId(job.guid || job.title);
    try {
      HimalayasService.importJob(job);
      setImportedSlugs((prev) => new Set(prev).add(job.companySlug + job.title));
      refreshExistingDbJobs();
      setNotice(`Imported "${job.title}" by ${job.companyName} directly into Grail Jobs board.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setImportingId(null);
    }
  };

  // Resilient, deep filter and sort logic across live stream
  const filteredJobs = useMemo(() => {
    const list = jobs.filter((j) => {
      const titleLower = (j.title || '').toLowerCase();
      const companyLower = (j.companyName || '').toLowerCase();
      const catList = (j.categories || []).map((c) => c.replace(/-/g, ' ').toLowerCase());
      const parentList = (j.parentCategories || []).map((p) => p.toLowerCase());
      const allCategoryText = [...catList, ...parentList, titleLower].join(' ');

      // 1. Text Search (title, company, category, or location)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = titleLower.includes(q);
        const matchesCompany = companyLower.includes(q);
        const matchesCategory = allCategoryText.includes(q);
        const matchesLocation = (j.locationRestrictions || []).some((l) => l.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesCategory && !matchesLocation) return false;
      }

      // 2. Seniority (Experience Level) - matches both seniority tags and title markers
      if (seniorityFilter !== 'all') {
        const senList = (j.seniority || []).map((s) => s.toLowerCase());
        if (seniorityFilter === 'senior') {
          const matchSen = senList.some((s) => s.includes('senior') || s.includes('lead') || s.includes('principal') || s.includes('director') || s.includes('staff'));
          const matchTitle = titleLower.includes('senior') || titleLower.includes('sr.') || titleLower.includes('principal') || titleLower.includes('staff');
          if (!matchSen && !matchTitle) return false;
        } else if (seniorityFilter === 'mid') {
          const matchSen = senList.some((s) => s.includes('mid') || s.includes('intermediate'));
          const matchTitle = !titleLower.includes('junior') && !titleLower.includes('senior') && !titleLower.includes('lead') && !titleLower.includes('intern') && !titleLower.includes('director') && !titleLower.includes('vp');
          if (!matchSen && !(senList.length === 0 && matchTitle)) return false;
        } else if (seniorityFilter === 'junior' || seniorityFilter === 'entry') {
          const matchSen = senList.some((s) => s.includes('junior') || s.includes('entry') || s.includes('associate'));
          const matchTitle = titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('associate') || titleLower.includes('jr.');
          if (!matchSen && !matchTitle) return false;
        } else if (seniorityFilter === 'freshers') {
          const matchSen = senList.some((s) => s.includes('intern') || s.includes('fresher') || s.includes('graduate') || s.includes('entry'));
          const matchTitle = titleLower.includes('intern') || titleLower.includes('fresher') || titleLower.includes('graduate') || titleLower.includes('trainee') || titleLower.includes('entry');
          if (!matchSen && !matchTitle) return false;
        } else if (seniorityFilter === 'lead') {
          const matchSen = senList.some((s) => s.includes('lead') || s.includes('director') || s.includes('head') || s.includes('executive') || s.includes('vp') || s.includes('chief'));
          const matchTitle = titleLower.includes('lead') || titleLower.includes('head') || titleLower.includes('director') || titleLower.includes('vp ') || titleLower.includes('vp,') || titleLower.includes('vice president') || titleLower.includes('chief');
          if (!matchSen && !matchTitle) return false;
        }
      }

      // 3. Location Restrictions (Array of countries; empty array or worldwide = worldwide)
      if (locationFilter !== 'all') {
        if (locationFilter === 'worldwide') {
          const hasSpecific = j.locationRestrictions && j.locationRestrictions.length > 0;
          const mentionsWorldwide = (j.locationRestrictions || []).some((l) => l.toLowerCase().includes('worldwide') || l.toLowerCase().includes('anywhere'));
          if (hasSpecific && !mentionsWorldwide) return false;
        } else {
          const locs = (j.locationRestrictions || []).map((l) => l.toLowerCase());
          const target = locationFilter.toLowerCase();
          const matchesCountry = locs.some((l) => l.includes(target) || (target === 'united states' && (l === 'us' || l === 'usa')));
          if (!matchesCountry) return false;
        }
      }

      // 4. Timezone Restrictions (Array of accepted timezone offsets; empty array = all timezones)
      if (timezoneFilter !== 'all') {
        const tzList = j.timezoneRestrictions || [];
        if (tzList.length > 0) {
          if (timezoneFilter === 'americas') {
            if (!tzList.some((tz) => tz >= -10 && tz <= -4)) return false;
          } else if (timezoneFilter === 'europe_africa') {
            if (!tzList.some((tz) => tz >= -1 && tz <= 4)) return false;
          } else if (timezoneFilter === 'asia_pacific') {
            if (!tzList.some((tz) => tz >= 5 && tz <= 14)) return false;
          } else {
            const numTz = parseFloat(timezoneFilter);
            if (!isNaN(numTz) && !tzList.includes(numTz)) return false;
          }
        }
      }

      // 5. Categories (De-hyphenated categories, parent categories, or role title keywords)
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'design') {
          if (!allCategoryText.match(/(design|creative|ui|ux|graphic|visual|art|product designer|animat|figma|brand)/)) return false;
        } else if (categoryFilter === 'engineering') {
          if (!allCategoryText.match(/(engineer|developer|software|frontend|backend|full-stack|full stack|architect|devops|data|qa|tech|cloud|sysadmin|security|code)/)) return false;
        } else if (categoryFilter === 'product') {
          if (!allCategoryText.match(/(product manager|product lead|product owner|scrum|product analyst|program manager)/)) return false;
        } else if (categoryFilter === 'marketing') {
          if (!allCategoryText.match(/(market|content|growth|seo|brand|copywrit|social media|community|pr|acquisition)/)) return false;
        } else if (categoryFilter === 'sales') {
          if (!allCategoryText.match(/(sale|account executive|account manager|bdr|sdr|business develop|revenue|partnership)/)) return false;
        } else if (categoryFilter === 'operations') {
          if (!allCategoryText.match(/(operat|support|success|customer|people|hr|talent|recruit|admin|legal|finance|accountant|compliance)/)) return false;
        }
      }

      // 6. Employment Type
      if (employmentTypeFilter !== 'all') {
        const rawType = (j.employmentType || '').toLowerCase();
        if (employmentTypeFilter === 'full-time' && !rawType.includes('full')) return false;
        if (employmentTypeFilter === 'contract' && !rawType.includes('contract')) return false;
        if (employmentTypeFilter === 'part-time' && !rawType.includes('part')) return false;
        if (employmentTypeFilter === 'freelance' && !rawType.includes('freelance')) return false;
        if (employmentTypeFilter === 'internship' && !rawType.includes('intern')) return false;
      }

      return true;
    });

    // 7. Listing Order & Ranking: all listing order (default feed), most recent, salary, oldest, alphabetical
    if (sortFilter === 'all') {
      // Natural stream order as fetched from Himalayas feed
    } else if (sortFilter === 'recent') {
      list.sort((a, b) => (b.pubDate || 0) - (a.pubDate || 0));
    } else if (sortFilter === 'oldest') {
      list.sort((a, b) => (a.pubDate || 0) - (b.pubDate || 0));
    } else if (sortFilter === 'salary') {
      list.sort((a, b) => (b.maxSalary || b.minSalary || 0) - (a.maxSalary || a.minSalary || 0));
    } else if (sortFilter === 'salary_asc') {
      list.sort((a, b) => (a.minSalary || a.maxSalary || 0) - (b.minSalary || b.maxSalary || 0));
    } else if (sortFilter === 'company') {
      list.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else if (sortFilter === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortFilter === 'relevant' && searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 2 : 0;
        const bTitle = b.title.toLowerCase().includes(q) ? 2 : 0;
        return bTitle - aTitle;
      });
    }

    return list;
  }, [jobs, searchTerm, seniorityFilter, locationFilter, timezoneFilter, categoryFilter, employmentTypeFilter, sortFilter]);

  // Execute batch sync with filtered items
  const handleBatchSync = async (countOverride?: number) => {
    const limit = countOverride ?? batchSyncLimit;
    const candidates = filteredJobs.slice(0, limit);
    if (candidates.length === 0) {
      alert('No jobs match the current filter selection to sync.');
      return;
    }

    setLoading(true);
    let count = 0;
    try {
      for (const item of candidates) {
        HimalayasService.importJob(item);
        setImportedSlugs((prev) => new Set(prev).add(item.companySlug + item.title));
        count++;
      }
      refreshExistingDbJobs();
      setNotice(`Batch synced ${count} remote positions matching your active filters into Grail Jobs.`);
      setTimeout(() => setNotice(null), 6000);
    } catch (err: any) {
      alert(`Batch sync failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs by sync status (all, ready to sync, imported)
  const displayedJobs = useMemo(() => {
    return filteredJobs.filter((job) => {
      const imported = isJobImported(job);
      if (syncStatusFilter === 'imported') return imported;
      if (syncStatusFilter === 'sync') return !imported;
      return true; // 'all'
    });
  }, [filteredJobs, syncStatusFilter, importedSlugs, existingDbJobs]);

  // Table pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, seniorityFilter, locationFilter, timezoneFilter, categoryFilter, employmentTypeFilter, sortFilter, syncStatusFilter]);

  const totalPages = Math.ceil(displayedJobs.length / itemsPerPage) || 1;
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedHimalayasJobs = useMemo(() => {
    return displayedJobs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  }, [displayedJobs, activePage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(clamped);
  };

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

  const statusCounts = useMemo(() => {
    let imported = 0;
    let readyToSync = 0;
    filteredJobs.forEach((j) => {
      if (isJobImported(j)) imported++;
      else readyToSync++;
    });
    return {
      all: filteredJobs.length,
      readyToSync,
      imported,
    };
  }, [filteredJobs, importedSlugs, existingDbJobs]);

  const handleOpenEditJobListing = (job: HimalayasRawJob) => {
    let dbJob = getImportedDbJob(job);
    if (!dbJob) {
      // Auto-import vacancy to assign a unique ID, then open Edit Job Listing
      const { job: importedJob } = HimalayasService.importJob(job);
      setImportedSlugs((prev) => new Set(prev).add(job.companySlug + job.title));
      refreshExistingDbJobs();
      navigate(`/admin/jobs/${importedJob.id}/edit`);
    } else {
      navigate(`/admin/jobs/${dbJob.id}/edit`);
    }
  };

  const handleOpenEditModal = (job: HimalayasRawJob) => {
    setEditingJob(job);
    setEditForm({
      title: job.title || '',
      companyName: job.companyName || '',
      seniority: job.seniority?.[0] || 'Mid-level',
      minSalary: job.minSalary ? String(job.minSalary) : '',
      maxSalary: job.maxSalary ? String(job.maxSalary) : '',
      currency: job.currency || 'USD',
      location: (job.locationRestrictions || []).join(', ') || 'Worldwide',
      employmentType: job.employmentType || 'Full Time',
      applicationLink: job.applicationLink || job.guid || '',
      excerpt: job.excerpt || job.description || '',
    });
  };

  const handleSaveEdit = (syncToBoard: boolean = false) => {
    if (!editingJob) return;

    const locRestrictions = editForm.location.trim()
      ? editForm.location.split(',').map((s) => s.trim()).filter((s) => s.toLowerCase() !== 'worldwide')
      : [];

    const updatedJob: HimalayasRawJob = {
      ...editingJob,
      title: editForm.title.trim() || editingJob.title,
      companyName: editForm.companyName.trim() || editingJob.companyName,
      seniority: editForm.seniority ? [editForm.seniority] : editingJob.seniority,
      minSalary: editForm.minSalary ? Number(editForm.minSalary) : null,
      maxSalary: editForm.maxSalary ? Number(editForm.maxSalary) : null,
      currency: editForm.currency,
      locationRestrictions: locRestrictions,
      employmentType: editForm.employmentType,
      applicationLink: editForm.applicationLink.trim() || editingJob.applicationLink,
      excerpt: editForm.excerpt.trim() || editingJob.excerpt,
    };

    // Update in memory jobs stream
    setJobs((prev) =>
      prev.map((j) => {
        const matchesGuid = j.guid && editingJob.guid && j.guid === editingJob.guid;
        const matchesName = j.companySlug === editingJob.companySlug && j.title === editingJob.title;
        return matchesGuid || matchesName ? updatedJob : j;
      })
    );

    const existingDbJob = getImportedDbJob(editingJob);

    if (existingDbJob) {
      DataStore.updateJob(existingDbJob.id, {
        title: updatedJob.title,
        salary_min: updatedJob.minSalary || undefined,
        salary_max: updatedJob.maxSalary || undefined,
        salary_currency: updatedJob.currency || 'USD',
        location: updatedJob.locationRestrictions?.length
          ? `Remote (${updatedJob.locationRestrictions.join(', ')})`
          : 'Remote Worldwide',
        external_application_url: updatedJob.applicationLink,
        experience_level: updatedJob.seniority?.[0]?.toLowerCase().includes('senior')
          ? 'senior'
          : updatedJob.seniority?.[0]?.toLowerCase().includes('lead')
          ? 'lead'
          : updatedJob.seniority?.[0]?.toLowerCase().includes('fresher')
          ? 'freshers'
          : updatedJob.seniority?.[0]?.toLowerCase().includes('junior')
          ? 'entry'
          : 'mid',
      });
      refreshExistingDbJobs();
      setNotice(`Updated "${updatedJob.title}" in Grail Jobs database.`);
    } else if (syncToBoard) {
      HimalayasService.importJob(updatedJob);
      setImportedSlugs((prev) => new Set(prev).add(updatedJob.companySlug + updatedJob.title));
      refreshExistingDbJobs();
      setNotice(`Saved & synced "${updatedJob.title}" directly to Grail Jobs board.`);
    } else {
      setNotice(`Updated details for "${updatedJob.title}" in live stream feed.`);
    }

    setEditingJob(null);
    setTimeout(() => setNotice(null), 4000);
  };

  const activeFiltersCount = [
    Boolean(searchTerm.trim()),
    seniorityFilter !== 'all',
    locationFilter !== 'all',
    timezoneFilter !== 'all',
    categoryFilter !== 'all',
    employmentTypeFilter !== 'all',
    sortFilter !== 'all',
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSeniorityFilter('all');
    setLocationFilter('all');
    setTimezoneFilter('all');
    setCategoryFilter('all');
    setEmploymentTypeFilter('all');
    setSortFilter('all');
    setSyncStatusFilter('all');
  };

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

        {/* Action button toolbar - resized to match UI with unified h-9 height */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadHimalayasFeed}
            disabled={loading}
            className="h-9 px-3.5 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            title="Refresh feed from Himalayas live stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>

          <div className="h-9 flex items-center rounded-lg border border-neutral-900 bg-[#121212] text-white shadow-xs overflow-hidden shrink-0">
            <select
              value={batchSyncLimit}
              onChange={(e) => setBatchSyncLimit(Number(e.target.value))}
              className="h-full bg-neutral-900 text-white text-xs px-2.5 border-r border-neutral-800 focus:outline-none font-mono cursor-pointer"
              title="Number of filtered roles to sync"
            >
              <option value={5}>Sync 5</option>
              <option value={10}>Sync 10</option>
              <option value={20}>Sync 20</option>
              <option value={filteredJobs.length || 50}>All ({filteredJobs.length})</option>
            </select>

            <button
              onClick={() => handleBatchSync()}
              disabled={loading || filteredJobs.length === 0}
              className="h-full px-3.5 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Batch Sync Filtered ({Math.min(batchSyncLimit, filteredJobs.length)})</span>
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
          <Link to="/admin/jobs" className="underline text-emerald-400 text-[11px] hover:text-white">
            View on Jobs Board →
          </Link>
        </div>
      )}

      {/* Network Stats Card */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Himalayas Network Pool
          </span>
          <span className="font-display font-black text-3xl">
            {totalCount ? totalCount.toLocaleString() : '114,000+'}
          </span>
          <span className="text-[11px] text-neutral-400 block mt-1">Verified remote vacancies</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Batch Sync Filters
          </span>
          <span className="font-display font-bold text-xl block">
            {activeFiltersCount === 0 ? 'No Filters (All)' : `${activeFiltersCount} Active Filters`}
          </span>
          <span className="text-[11px] text-neutral-400 block mt-1">
            {filteredJobs.length} roles matching current criteria
          </span>
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

      {/* Batch Sync Filter Control Panel */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
        {/* Top search & stream continuation header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search live stream by keyword, role, studio, or skill..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
            <span className="text-[11px] font-mono text-neutral-500">
              <strong className="text-neutral-900">{filteredJobs.length}</strong> matching of {jobs.length} loaded
            </span>

            {cursor && (
              <button
                onClick={handleStreamMore}
                disabled={streamingMore}
                className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                title="Stream next batch of live vacancies from Himalayas cursor"
              >
                <RefreshCw className={`w-3 h-3 ${streamingMore ? 'animate-spin' : ''}`} />
                <span>{streamingMore ? 'Streaming...' : 'Stream +60'}</span>
              </button>
            )}

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                title="Reset all filters to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 6 Specialized Filter Dropdowns matching exact user requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* 1. Seniority (Experience Level) */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Seniority (Experience Level)
            </label>
            <select
              value={seniorityFilter}
              onChange={(e) => setSeniorityFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 p-2 rounded-lg text-neutral-800 text-xs focus:border-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Seniorities</option>
              <option value="senior">Senior Level</option>
              <option value="mid">Mid-Level</option>
              <option value="junior">Junior / Entry Level</option>
              <option value="freshers">Freshers / Graduate (0-1 yr)</option>
              <option value="lead">Lead / Principal / Executive</option>
            </select>
          </div>

          {/* 2. Location Restrictions */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Location Restrictions
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 p-2 rounded-lg text-neutral-800 text-xs focus:border-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Locations (Any)</option>
              <option value="worldwide">Worldwide (No Restrictions / Empty Array)</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
              <option value="Spain">Spain</option>
              <option value="Brazil">Brazil</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>

          {/* 3. Timezone Restrictions */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Timezone Restrictions
            </label>
            <select
              value={timezoneFilter}
              onChange={(e) => setTimezoneFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 p-2 rounded-lg text-neutral-800 text-xs focus:border-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Timezones (Worldwide)</option>
              <option value="americas">Americas (UTC-10 to UTC-4)</option>
              <option value="europe_africa">Europe & Africa (UTC-1 to UTC+4)</option>
              <option value="asia_pacific">Asia & Pacific (UTC+5 to UTC+14)</option>
              <option value="-8">UTC-8 (US Pacific / PST)</option>
              <option value="-5">UTC-5 (US Eastern / EST)</option>
              <option value="0">UTC+0 (London / GMT)</option>
              <option value="1">UTC+1 / UTC+2 (CET / Europe)</option>
              <option value="5.5">UTC+5:30 (India / IST)</option>
            </select>
          </div>

          {/* 4. Categories */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Job Categories
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 p-2 rounded-lg text-neutral-800 text-xs focus:border-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="design">Design / UX / UI / Motion</option>
              <option value="engineering">Engineering / Software / Web</option>
              <option value="product">Product Management</option>
              <option value="marketing">Marketing & Growth</option>
              <option value="sales">Sales & Business Development</option>
              <option value="operations">Operations & Customer Support</option>
            </select>
          </div>

          {/* 5. Employment Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Employment Type
            </label>
            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 p-2 rounded-lg text-neutral-800 text-xs focus:border-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Employment Types</option>
              <option value="full-time">Full-Time</option>
              <option value="contract">Contractor / Contract</option>
              <option value="part-time">Part-Time</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship / Freshers</option>
            </select>
          </div>

          {/* 6. Latest Listing Sorting */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Listing Order & Ranking
            </label>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 p-2 rounded-lg text-neutral-800 text-xs focus:border-neutral-900 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Listings (Original Listing Order)</option>
              <option value="recent">Most Recent (Newest First)</option>
              <option value="oldest">Oldest Listings First</option>
              <option value="salary">Highest Compensation (High to Low)</option>
              <option value="salary_asc">Lowest Compensation (Low to High)</option>
              <option value="relevant">Most Relevant</option>
              <option value="company">Company Name (A–Z)</option>
              <option value="title">Role Title (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Quick batch sync status action bar - filters feed from Himalayas into batch */}
        <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                <strong>{filteredJobs.length}</strong> roles filtered into batch
              </span>
            </div>
            <span className="hidden sm:inline text-neutral-300">·</span>
            <span className="text-[11px] text-neutral-500 font-mono">
              Order: {sortFilter === 'all' ? 'All Listings (Feed Order)' : sortFilter === 'recent' ? 'Most Recent' : sortFilter === 'oldest' ? 'Oldest First' : sortFilter === 'salary' ? 'Highest Salary' : sortFilter === 'salary_asc' ? 'Lowest Salary' : sortFilter === 'company' ? 'Company A-Z' : sortFilter === 'title' ? 'Title A-Z' : 'Most Relevant'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Batch:</span>
              <select
                value={batchSyncLimit}
                onChange={(e) => setBatchSyncLimit(Number(e.target.value))}
                className="bg-transparent text-neutral-800 text-xs font-mono font-medium focus:outline-none cursor-pointer"
                title="Select batch size"
              >
                <option value={5}>5 roles</option>
                <option value={10}>10 roles</option>
                <option value={20}>20 roles</option>
                <option value={50}>50 roles</option>
                <option value={filteredJobs.length || 100}>All Filtered ({filteredJobs.length})</option>
              </select>
            </div>

            {filteredJobs.length > 0 && (
              <button
                onClick={() => handleBatchSync(filteredJobs.length)}
                disabled={loading}
                className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-50 rounded-lg text-xs font-semibold text-neutral-800 transition-colors"
                title="Sync all jobs currently filtered"
              >
                Sync All Filtered ({filteredJobs.length})
              </button>
            )}

            <button
              onClick={() => handleBatchSync()}
              disabled={loading || filteredJobs.length === 0}
              className="px-4 py-1.5 bg-[#121212] hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              title="Batch sync top positions according to selected listing order"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Batch Sync Filtered ({Math.min(batchSyncLimit, filteredJobs.length)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Stream Table - Clean 5 columns */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        {/* Table header with filter for imported, sync (ready to sync), and all */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-neutral-900 text-xs">
              Live Stream Feed ({displayedJobs.length} of {jobs.length} loaded)
            </h3>
            {sortFilter === 'all' && (
              <span className="text-[10px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                All Listings (Feed Order)
              </span>
            )}
            {sortFilter === 'recent' && (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Sorted by Latest
              </span>
            )}
            {sortFilter === 'oldest' && (
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Sorted by Oldest
              </span>
            )}
            {sortFilter === 'salary' && (
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Sorted by Salary (High-Low)
              </span>
            )}
            {sortFilter === 'salary_asc' && (
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Sorted by Salary (Low-High)
              </span>
            )}
            {sortFilter === 'company' && (
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Sorted by Company (A-Z)
              </span>
            )}
            {sortFilter === 'title' && (
              <span className="text-[10px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                Sorted by Title (A-Z)
              </span>
            )}
            {sortFilter === 'relevant' && (
              <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                Sorted by Relevance
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter for imported, sync (ready to sync), and all */}
            <div className="inline-flex p-0.5 bg-neutral-200/80 rounded-lg text-xs font-medium">
              <button
                onClick={() => setSyncStatusFilter('all')}
                className={`px-3 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 ${
                  syncStatusFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Show all vacancies matching current criteria"
              >
                <span>All</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${syncStatusFilter === 'all' ? 'bg-neutral-100 text-neutral-900 font-mono font-bold' : 'text-neutral-500'}`}>
                  {statusCounts.all}
                </span>
              </button>

              <button
                onClick={() => setSyncStatusFilter('sync')}
                className={`px-3 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 ${
                  syncStatusFilter === 'sync'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Show vacancies ready to be synced into Grail Jobs"
              >
                <span>Ready to Sync</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${syncStatusFilter === 'sync' ? 'bg-neutral-100 text-neutral-900 font-mono font-bold' : 'text-neutral-500'}`}>
                  {statusCounts.readyToSync}
                </span>
              </button>

              <button
                onClick={() => setSyncStatusFilter('imported')}
                className={`px-3 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 ${
                  syncStatusFilter === 'imported'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Show vacancies already imported into Grail Jobs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Imported</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${syncStatusFilter === 'imported' ? 'bg-emerald-50 text-emerald-700 font-mono font-bold' : 'text-neutral-500'}`}>
                  {statusCounts.imported}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-600">
              <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-neutral-900 border-none focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={70}>70</option>
              </select>
            </div>

            <span className="text-[11px] font-mono text-neutral-400 hidden xl:inline">Source: himalayas.app</span>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-neutral-400 space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-neutral-600" />
            <p>Fetching and filtering remote vacancies from Himalayas...</p>
          </div>
        ) : displayedJobs.length > 0 ? (
          <>
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
                {paginatedHimalayasJobs.map((job, idx) => {
                  const isImported = isJobImported(job);
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
                              className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {job.companyName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-900 block truncate max-w-xs">{job.title}</span>
                            <span className="text-[11px] font-mono text-neutral-400 block truncate">
                              {job.companyName} · {job.employmentType || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                        <span className="px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                          {job.seniority?.join(', ') || 'Mid-level'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-800">
                        {job.minSalary
                          ? `${job.currency || '$'}${job.minSalary.toLocaleString()} ${job.maxSalary && job.maxSalary !== job.minSalary ? `– ${job.maxSalary.toLocaleString()}` : ''}`
                          : 'Undisclosed'}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                        {job.locationRestrictions && job.locationRestrictions.length > 0 ? (
                          <span className="text-neutral-800">
                            {job.locationRestrictions.slice(0, 2).join(', ')}
                            {job.locationRestrictions.length > 2 ? ` (+${job.locationRestrictions.length - 2})` : ''}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Worldwide</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {job.applicationLink && (
                            <a
                              href={job.applicationLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors rounded hover:bg-neutral-100"
                              title="Direct Application Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Edit Job Listing option */}
                          <button
                            onClick={() => handleOpenEditJobListing(job)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                            title="Edit Job Listing"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

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
                                <span>{isBusy ? 'Importing...' : 'Sync'}</span>
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

          {/* Pagination Controls */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="font-mono text-neutral-500">
              {displayedJobs.length > 0 ? (
                <>
                  Showing <strong className="text-neutral-900 font-semibold">{(activePage - 1) * itemsPerPage + 1}</strong> to{' '}
                  <strong className="text-neutral-900 font-semibold">{Math.min(activePage * itemsPerPage, displayedJobs.length)}</strong> of{' '}
                  <strong className="text-neutral-900 font-semibold">{displayedJobs.length}</strong> listings
                  <span className="text-neutral-400 ml-1.5">(Page {activePage} of {totalPages})</span>
                </>
              ) : (
                <span>No listings</span>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage <= 1}
                  className="h-8 px-2.5 sm:px-3 border border-neutral-200 bg-white rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {getPaginationNumbers(activePage, totalPages).map((item, idx) => {
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
                  const isActive = p === activePage;
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
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage >= totalPages}
                  className="h-8 px-2.5 sm:px-3 border border-neutral-200 bg-white rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  title="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-12 text-center text-xs text-neutral-500 space-y-3">
            <p className="text-neutral-700 font-medium">
              {syncStatusFilter === 'imported'
                ? 'No imported positions match the current criteria.'
                : syncStatusFilter === 'sync'
                ? 'No unimported positions ready to sync match the current criteria.'
                : `No remote vacancies in current ${jobs.length} streamed jobs match your active filters.`}
            </p>
            <p className="text-[11px] text-neutral-400">
              The live stream has over {totalCount.toLocaleString()} total vacancies. You can pull more live positions or reset filters.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              {cursor && (
                <button
                  onClick={handleStreamMore}
                  disabled={streamingMore}
                  className="px-3.5 py-1.5 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${streamingMore ? 'animate-spin' : ''}`} />
                  <span>Stream More Vacancies (+60)</span>
                </button>
              )}
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-neutral-700" />
                <h3 className="font-display font-black text-base text-neutral-900 uppercase tracking-tight">
                  {isJobImported(editingJob) ? 'Edit Imported Job' : 'Edit Live Vacancy'}
                </h3>
              </div>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Company / Studio
                  </label>
                  <input
                    type="text"
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Seniority Level
                  </label>
                  <select
                    value={editForm.seniority}
                    onChange={(e) => setEditForm({ ...editForm, seniority: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Junior">Junior / Entry</option>
                    <option value="Freshers">Freshers / Graduate</option>
                    <option value="Lead">Lead / Principal</option>
                    <option value="Executive">Director / Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 90000"
                    value={editForm.minSalary}
                    onChange={(e) => setEditForm({ ...editForm, minSalary: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 140000"
                    value={editForm.maxSalary}
                    onChange={(e) => setEditForm({ ...editForm, maxSalary: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Currency
                  </label>
                  <select
                    value={editForm.currency}
                    onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Employment Type
                  </label>
                  <select
                    value={editForm.employmentType}
                    onChange={(e) => setEditForm({ ...editForm, employmentType: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Full Time">Full-Time</option>
                    <option value="Contractor">Contract</option>
                    <option value="Part Time">Part-Time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Location Scope
                  </label>
                  <input
                    type="text"
                    placeholder="Worldwide, or United States, Canada"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Application Link / External URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editForm.applicationLink}
                  onChange={(e) => setEditForm({ ...editForm, applicationLink: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="px-3 py-2 text-neutral-600 hover:text-neutral-900 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {!isJobImported(editingJob) && (
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(false)}
                    className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    Update in Stream
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveEdit(!isJobImported(editingJob))}
                  className="px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isJobImported(editingJob) ? 'Save Changes' : 'Save & Sync to Board'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


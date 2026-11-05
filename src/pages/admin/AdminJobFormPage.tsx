import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { Job, WorkplaceType, EmploymentType, ExperienceLevel, SalaryPeriod, JobStatus } from '../../types';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';

export const AdminJobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const companies = DataStore.getCompanies();
  const categories = DataStore.getCategories();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    companyId: companies[0]?.id || '',
    categoryId: categories[0]?.id || '',
    description: '',
    responsibilities: '',
    requirements: '',
    qualifications: '',
    benefits: '',
    location: 'Remote',
    city: '',
    country: 'United States',
    workplaceType: 'remote' as WorkplaceType,
    employmentType: 'full-time' as EmploymentType,
    experienceLevel: 'senior' as ExperienceLevel,
    salaryMin: 80000,
    salaryMax: 120000,
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly' as SalaryPeriod,
    salaryVisible: true,
    skills: 'Figma, Design Systems',
    status: 'published' as JobStatus,
    isFeatured: false,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const existing = DataStore.getJobs().find((j) => j.id === id);
      if (existing) {
        setFormData({
          title: existing.title,
          slug: existing.slug,
          companyId: existing.company_id,
          categoryId: existing.category_id || categories[0]?.id || '',
          description: existing.description,
          responsibilities: (existing.responsibilities || []).join('\n'),
          requirements: (existing.requirements || []).join('\n'),
          qualifications: (existing.qualifications || []).join('\n'),
          benefits: (existing.benefits || []).join('\n'),
          location: existing.location,
          city: existing.city || '',
          country: existing.country,
          workplaceType: existing.workplace_type,
          employmentType: existing.employment_type,
          experienceLevel: existing.experience_level,
          salaryMin: existing.salary_min || 0,
          salaryMax: existing.salary_max || 0,
          salaryCurrency: existing.salary_currency || 'USD',
          salaryPeriod: existing.salary_period || 'yearly',
          salaryVisible: existing.salary_visible,
          skills: (existing.skills || []).join(', '),
          status: existing.status,
          isFeatured: existing.is_featured,
        });
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a job description.');
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        company_id: formData.companyId,
        category_id: formData.categoryId,
        description: formData.description.trim(),
        responsibilities: formData.responsibilities
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: formData.requirements
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        qualifications: formData.qualifications
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: formData.benefits
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        location: formData.location.trim(),
        city: formData.city.trim() || undefined,
        country: formData.country.trim(),
        workplace_type: formData.workplaceType,
        employment_type: formData.employmentType,
        experience_level: formData.experienceLevel,
        salary_min: Number(formData.salaryMin),
        salary_max: Number(formData.salaryMax),
        salary_currency: formData.salaryCurrency,
        salary_period: formData.salaryPeriod,
        salary_visible: formData.salaryVisible,
        application_mode: 'internal' as const,
        status: formData.status,
        is_featured: formData.isFeatured,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (isEditing && id) {
        DataStore.updateJob(id, payload);
      } else {
        DataStore.createJob(payload);
      }

      navigate('/admin/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to save job listing.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <Link
          to="/admin/jobs"
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>
        <span className="text-xs font-mono text-neutral-400">
          {isEditing ? 'Edit Mode' : 'New Creation'}
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase">
          {isEditing ? 'Edit Job Listing' : 'Create Job Listing'}
        </h1>
        <p className="text-xs text-neutral-500">
          Curate role specifications, verify compensation transparency, and manage publishing states.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 shadow-xs text-xs">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            1. Basic Information
          </h3>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Creative Technologist (Three.js & React)"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Company / Studio *</label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.headquarters})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Role Description & Mission *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a comprehensive introduction to this position and the studio mission..."
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Location & Employment */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            2. Workplace & Employment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Workplace Arrangement</label>
              <select
                value={formData.workplaceType}
                onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value as WorkplaceType })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="full-time">Full-Time</option>
                <option value="freelance">Freelance</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part-Time</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="entry">Entry (1-2 yrs)</option>
                <option value="mid">Mid-Level (3-5 yrs)</option>
                <option value="senior">Senior (5+ yrs)</option>
                <option value="lead">Lead / Principal</option>
                <option value="executive">Director / VP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Location Label</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Remote (US & Europe timezones) or Paris Studio"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. United States, France, Germany"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            3. Compensation Transparency
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Minimum</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Maximum</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Currency</label>
              <select
                value={formData.salaryCurrency}
                onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF (Fr.)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Period</label>
              <select
                value={formData.salaryPeriod}
                onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value as SalaryPeriod })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="yearly">Per Year</option>
                <option value="hourly">Per Hour</option>
                <option value="monthly">Per Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Lists */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            4. Requirements, Responsibilities & Skills
          </h3>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. Figma, React, Design Systems, Typography"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">
                Responsibilities (one per line)
              </label>
              <textarea
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Architect modular design tokens&#10;Lead client creative reviews&#10;Optimize mobile conversion"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-900 block mb-1">
                Requirements (one per line)
              </label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="5+ years in product design&#10;Demonstrated eCommerce case studies&#10;Fluent Figma auto-layout mastery"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Benefits & Perks (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Flexible remote hours&#10;Generous hardware stipend&#10;Full health insurance"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Status & Featured */}
        <div className="space-y-4 pt-2 border-t border-neutral-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">Listing Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="published">Published (Live on Marketplace)</option>
                <option value="draft">Draft (Hidden from Public)</option>
                <option value="filled">Marked as Filled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-neutral-900 focus:ring-0"
                />
                <span>Feature on Homepage Marquee</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100">
          <Link
            to="/admin/jobs"
            className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Changes' : 'Publish Job Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

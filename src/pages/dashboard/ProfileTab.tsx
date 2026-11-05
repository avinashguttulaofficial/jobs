import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { Check, AlertCircle, Save } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { user, updateProfile } = useAuth();
  if (!user) return null;

  const [formData, setFormData] = useState({
    fullName: user.full_name || '',
    headline: user.headline || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    country: user.country || 'United States',
    professionalSummary: user.professional_summary || '',
    yearsOfExperience: user.years_of_experience || '',
    workExperience: user.work_experience || '',
    portfolioUrl: user.portfolio_url || '',
    linkedinUrl: user.linkedin_url || '',
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      updateProfile({
        full_name: formData.fullName,
        headline: formData.headline,
        phone: formData.phone,
        location: formData.location,
        country: formData.country,
        professional_summary: formData.professionalSummary,
        years_of_experience: formData.yearsOfExperience,
        work_experience: formData.workExperience,
        portfolio_url: formData.portfolioUrl,
        linkedin_url: formData.linkedinUrl,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="font-display font-bold text-xl text-neutral-900">
          Professional Candidate Dossier
        </h2>
        <p className="text-xs text-neutral-500">
          This information is shared with hiring managers when you submit job applications.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile changes successfully saved to database.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Account Email</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full p-2.5 bg-neutral-100 text-neutral-500 border border-neutral-200 rounded-lg cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-900 block mb-1">
            Professional Headline *
          </label>
          <input
            type="text"
            required
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="e.g. Senior Product Designer | Design Systems & eCommerce"
            className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Current City</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-neutral-900 block mb-1">
            Professional Summary / Bio
          </label>
          <textarea
            rows={4}
            value={formData.professionalSummary}
            onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
            placeholder="Outline your background, focus areas, key accomplishments, and design philosophy..."
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none leading-relaxed"
          />
        </div>

        <div className="space-y-4 pt-2 border-t border-neutral-100">
          <h3 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider font-mono">
            Experience & Work History
          </h3>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Years of Experience</label>
            <input
              type="text"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              placeholder="e.g. 6+ years or Senior Level (5-8 yrs)"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Work Experience & Career Milestones
            </label>
            <textarea
              rows={4}
              value={formData.workExperience}
              onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
              placeholder="Senior Product Designer at Acme (2022 - Present)&#10;Lead Interaction Designer at Studio X (2019 - 2022)"
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none font-mono text-[11px] leading-relaxed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Portfolio Website URL</label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://yourportfolio.design"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Dossier</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { SiteSettings } from '../../types';
import { Save, Check, Sliders } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => DataStore.getSiteSettings());
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.updateSiteSettings(settings);
    setNotice('Site settings updated successfully.');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
          Platform Configuration
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
          Site Settings & SEO
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Configure site titles, homepage editorial text, and public contact coordinates.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 shadow-xs text-xs">
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            Brand & Metadata
          </h3>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Platform Brand Name</label>
            <input
              type="text"
              required
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Homepage Hero Headline</label>
            <input
              type="text"
              required
              value={settings.hero_headline}
              onChange={(e) => setSettings({ ...settings, hero_headline: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Homepage Hero Subtitle</label>
            <textarea
              rows={2}
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            SEO & Social Tags
          </h3>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Global Meta Title</label>
            <input
              type="text"
              value={settings.seo_title}
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Global Meta Description</label>
            <textarea
              rows={2}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
            Contact & Footer
          </h3>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Primary Editorial Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">Footer Copyright Notice</label>
            <input
              type="text"
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#121212] text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

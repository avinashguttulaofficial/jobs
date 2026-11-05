import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { Check, Mail, MessageSquare, Building2, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      DataStore.submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
      });
      setSubmitted(true);
      setError(null);
    } catch (err: any) {
      setError('Failed to deliver message. Please retry.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
          Direct Inquiries
        </span>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-[#121212] tracking-tight uppercase">
          Connect With Editorial
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
          Questions regarding studio curation, partnership inquiries, or platform feedback? Our editorial team reviews every message directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Editorial Offices
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Curated globally with administrative hubs in New York, Paris, and Zurich.
            </p>
            <div className="pt-2 space-y-3 font-mono text-[11px] text-neutral-700">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>editorial@grailjobs.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Partner Studios Guild</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 text-white p-6 rounded-xl text-xs space-y-2">
            <h4 className="font-semibold text-white">Studio Listing Partnerships</h4>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Looking to list multiple roles or partner on a dedicated design hiring spotlight? Submit an inquiry with your studio URL.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-neutral-300 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-900">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-neutral-900">
                Message Received
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                Thank you, {formData.name}. Our editorial team has logged your message and will respond to {formData.email} within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-900 block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marc Jacobs"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-900 block">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@studio.com"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-900 block">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Studio Listing Inquiry / Editorial Submission"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-900 block">Message *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your studio, role inquiries, or feedback..."
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Check, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
          Editorial Manifesto
        </span>
        <h1 className="font-display font-black text-5xl sm:text-7xl text-[#121212] tracking-tight uppercase leading-[0.95]">
          Curated Craft. Zero Noise.
        </h1>
        <p className="text-neutral-600 text-sm sm:text-lg leading-relaxed pt-2">
          Grail Jobs was founded on a simple principle: extraordinary digital talent deserves an extraordinary discovery experience.
        </p>
      </div>

      <div className="space-y-10 text-neutral-700 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
        <section className="space-y-4 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="font-display font-bold text-2xl text-neutral-900">
            Why Only Administrators Publish Listings
          </h2>
          <p>
            Traditional job boards are flooded with AI-generated reposts, expired ghost jobs, and vague salary ranges designed to capture candidate data.
          </p>
          <p>
            On Grail Jobs, <strong>only authorized platform administrators have publishing privileges</strong>. Every single opportunity is directly vetted with studio founders, hiring directors, or authorized partners before it enters our editorial index.
          </p>
        </section>

        <section className="space-y-4 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="font-display font-bold text-2xl text-neutral-900">
            The Three Invariants
          </h2>
          <div className="space-y-3 pt-2 text-sm text-neutral-600">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-neutral-900 block font-semibold">Verified Compensation</strong>
                <span>No job goes live without explicit, verified hourly rates or salary ranges.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-neutral-900 block font-semibold">Strict Aesthetic & Quality Standards</strong>
                <span>We only showcase studios and brands that demonstrate genuine dedication to design systems, typography, and web performance.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-neutral-900 block font-semibold">Candidate Privacy & Fast Feedback</strong>
                <span>Resumes and candidate portfolios are securely stored in private storage vaults. No public disclosure.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center pt-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            <span>Explore Current Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataStore } from '../../services/store';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ submitted: boolean; message: string }>({
    submitted: false,
    message: '',
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    const res = DataStore.subscribeNewsletter(email);
    setSubStatus({ submitted: true, message: res.message });
    setEmail('');
  };

  return (
    <footer className="bg-[#121212] text-neutral-400 text-sm border-t border-neutral-900 pt-16 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-[#121212] flex items-center justify-center font-display font-black text-xl rounded">
                W.
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                GRAIL JOBS
              </span>
            </div>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              An editorial recruitment ecosystem inspired by Awwwards-winning digital craft. Connecting premier global agencies, consumer brands, and design studios with exceptional creative and engineering talent.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 block mb-2">
                Curated Weekly Openings & Design Dispatch
              </span>
              {subStatus.submitted ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium py-2">
                  <Check className="w-4 h-4" />
                  <span>{subStatus.message}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-[#121212] rounded text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200">Opportunities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs?category=ui-ux-design" className="hover:text-white transition-colors">UI/UX Design</Link></li>
              <li><Link to="/jobs?category=web-frontend" className="hover:text-white transition-colors">Web & Frontend</Link></li>
              <li><Link to="/jobs?category=motion-3d" className="hover:text-white transition-colors">Motion & 3D</Link></li>
              <li><Link to="/jobs?category=art-direction" className="hover:text-white transition-colors">Art Direction</Link></li>
              <li><Link to="/jobs?workplace=remote" className="hover:text-white transition-colors">Remote Roles</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/companies" className="hover:text-white transition-colors">Featured Studios</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Salary Benchmarks</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Editorial Philosophy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Editorial</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Administrator Access</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200">Legal & Governance</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Only authorized platform administrators may publish or curate listings. All job opportunities are directly vetted for authenticity, compensation transparency, and creative standards.
            </p>
            <div className="pt-2 text-[11px] text-neutral-500 font-mono">
              <span>Standard 2026.11 · Powered by Supabase & PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 GRAIL JOBS. Built with precision and typographic rigor.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

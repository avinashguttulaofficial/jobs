import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    headline: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    // Strict business rule: always role: 'user'
    const res = register({
      email: formData.email,
      full_name: formData.fullName,
      headline: formData.headline,
      location: formData.location,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white border border-neutral-300 rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#121212] text-white flex items-center justify-center font-display font-black text-xl rounded">
              W.
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-[#121212]">
              GRAIL
            </span>
          </Link>
          <h2 className="font-display font-black text-3xl text-neutral-900 tracking-tight uppercase">
            Create Profile
          </h2>
          <p className="text-xs text-neutral-500">
            Join the global directory of vetted creative and engineering talent.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Marc Jacobs"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="marc@studio.com"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Senior UI/UX Designer & Design Systems"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Paris, France or San Francisco, CA"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">
                Confirm
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 leading-tight">
            By continuing, you agree to the Grail Jobs Candidate Privacy Standards. Only authorized administrators manage listings.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-mono flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Candidate Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-600">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-neutral-900 underline hover:text-black">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

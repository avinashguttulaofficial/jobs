import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle, Shield, User, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Return to intended page if redirected
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin' || res.user?.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleQuickDemo = (role: 'seeker' | 'admin' | 'superadmin') => {
    switchDemoRole(role);
    if (role === 'admin' || role === 'superadmin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            Sign In
          </h2>
          <p className="text-xs text-neutral-500">
            Access your applications, saved opportunities, or administrator dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Logins Box */}
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
            Instant Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('seeker')}
              className="p-2.5 bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg text-left transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4 text-neutral-600 shrink-0" />
              <div>
                <p className="font-semibold text-neutral-900 leading-none">Job Seeker</p>
                <span className="text-[10px] text-neutral-400">Sarah Chen</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg text-left transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-neutral-900 shrink-0" />
              <div>
                <p className="font-semibold text-neutral-900 leading-none">Administrator</p>
                <span className="text-[10px] text-neutral-400">Alex Wright</span>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-900 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-neutral-900">Password</label>
              <Link
                to="/forgot-password"
                className="text-neutral-500 hover:text-neutral-900 text-[11px] underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-mono flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-600">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-semibold text-neutral-900 underline hover:text-black">
            Create Free Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

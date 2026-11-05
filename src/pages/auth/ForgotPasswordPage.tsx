import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Mail } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white border border-neutral-300 rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="text-center space-y-2">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <h2 className="font-display font-black text-3xl text-neutral-900 tracking-tight uppercase">
            Reset Password
          </h2>
          <p className="text-xs text-neutral-500">
            Enter the email associated with your account and we'll send recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 text-center space-y-3">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-neutral-900 text-sm">Recovery Link Sent</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If an account exists for <strong>{email}</strong>, a secure reset token has been dispatched.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 px-4 py-2 bg-[#121212] text-white text-xs font-semibold rounded hover:bg-neutral-800"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-900 block mb-1">
                Account Email
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

            <button
              type="submit"
              className="w-full py-3 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-mono"
            >
              Send Password Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

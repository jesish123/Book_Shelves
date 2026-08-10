import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../layouts/AuthLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', code: '', password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Prefill email from query param if present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) setFormData((prev) => ({ ...prev, email: emailParam }));
    } catch (err) {
      // ignore
    }
  }, []);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setVerificationError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/verify-reset-code`, {
        email: formData.email,
        code: formData.code,
      });
      setMessage('Verification code accepted. Enter your new password.');
      setStep(2);
    } catch (err) {
      setVerificationError(err.response?.data?.message || 'Failed to verify code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/reset-password`, formData);
      setFormData({ email: '', code: '', password: '', confirm_password: '' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-blue-100 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Reset password</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {step === 1 ? 'Verify your reset code' : 'Enter your new password'}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={step === 1 ? handleVerifyCode : handleSubmit}>
          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
              {message}
            </div>
          )}
          {(error || verificationError) && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700">
              {error || verificationError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={step === 2}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {step === 1 && (
            <div>
              <label htmlFor="code" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Verification code</label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="123456"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="password" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">New password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm password</label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (step === 1 ? 'Verifying...' : 'Resetting...') : (step === 1 ? 'Verify Code' : 'Reset Password')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Back to{' '}
          <Link to="/login" className="font-semibold text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
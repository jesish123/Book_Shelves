import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../layouts/AuthLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message || 'Check your email for the reset code.');
      // Redirect to reset page with email prefilled
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-blue-100 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Forgot password</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">Reset your password</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Registered email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
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

export default ForgotPassword;

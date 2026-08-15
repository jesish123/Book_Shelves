import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../layouts/AuthLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Parse token and user parameters from URL if redirected from Google OAuth
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userStr);
        window.history.replaceState({}, document.title, window.location.pathname);
        const userObj = JSON.parse(userStr);
        if (userObj.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/user/dashboard');
        }
        return;
      } catch (err) {
        console.error('Error handling Google Auth parameters:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    const cachedToken = localStorage.getItem('token');
    const cachedUserString = localStorage.getItem('user');
    if (cachedToken && cachedUserString) {
      try {
        const cachedUser = JSON.parse(cachedUserString);
        if (cachedUser.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } catch (err) {
        console.error('Stored user data is corrupted:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const login = async (formData) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(formData);
    setFormData({ email: '', password: '' });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-blue-100 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">Login to your shelf</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-90">
            Login
          </button>
        </form>

        <div className="my-5 flex items-center justify-center gap-2">
          <span className="h-px w-full bg-slate-200 dark:bg-slate-700"></span>
          <span className="text-xs uppercase text-slate-400 font-semibold">OR</span>
          <span className="h-px w-full bg-slate-200 dark:bg-slate-700"></span>
        </div>

        <a
          href={`${API_URL}/auth/google`}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
            />
          </svg>
          Continue with Google Account
        </a>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 underline">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}


export default Login;
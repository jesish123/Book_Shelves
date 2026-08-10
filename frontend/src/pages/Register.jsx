import { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    accept_terms: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <main className="flex flex-col items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-blue-100 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 md:p-8">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Create account</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">Start your reading journey</h1>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">First name</label>
                <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label htmlFor="last_name" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Last name</label>
                <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@readymadeui.com" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label htmlFor="confirm_password" className="mb-2 inline-block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm password</label>
              <input type="password" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
            </div>

            <div className="flex flex-wrap items-start gap-2">
              <label className="group flex items-center has-[input:checked]:text-slate-900">
                <input id="accept_terms" name="accept_terms" type="checkbox" checked={formData.accept_terms} onChange={handleChange} required className="sr-only" />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white outline-1 outline-slate-300 group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:outline-blue-600 group-focus-within:outline-2 group-focus-within:outline-blue-600 dark:bg-neutral-700 dark:outline-neutral-600" aria-hidden="true">
                  <svg className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 5l3 3 7-7" />
                  </svg>
                </span>
                <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">I accept the</span>
              </label>

              <a href="#" className="ml-1 rounded text-sm font-medium text-blue-700 hover:underline">Terms and Conditions</a>
            </div>

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-2.75 font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-90">
              Create an account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?
            <Link to="/login" className="ml-1 font-semibold text-blue-600 underline">Login here</Link>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
};

export default Register;
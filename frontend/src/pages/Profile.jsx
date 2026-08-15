import { useEffect, useState } from "react";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/Button";
import UserInfo from "../components/UserInfo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, getAuthHeaders());
      setUser(response.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Unable to load profile. Please try again later.");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.patch(
        `${API_URL}/users/me/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        getAuthHeaders()
      );

      setMessage(response.data.message || "Password updated successfully.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.response?.data?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Your Profile</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your account details and update your password securely.
          </p>
        </div>

        {profileLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Account details</h2>
              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-950/10">
                  {error}
                </div>
              )}
              {message && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-950/10">
                  {message}
                </div>
              )}

              <UserInfo user={user} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Change password</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Update your password. If your account was created with Google, you can choose a new password here.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Current password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    New password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Choose a new password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" fullWidth loading={loading}>
                  Update password
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Profile;



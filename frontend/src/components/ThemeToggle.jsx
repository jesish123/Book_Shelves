import { useEffect, useLayoutEffect, useState } from "react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const saved = window.localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
    } else if (saved === "light") {
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof isDark !== "boolean") return;
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((current) => !current)}
      className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="theme-toggle-icon">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}

export default ThemeToggle;
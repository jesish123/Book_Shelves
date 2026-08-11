import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode((prev) => !prev)}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
      aria-label="Toggle dark mode theme"
    >
      {isDarkMode ? (
        <>
          <span>☀️</span>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <span>🌙</span>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
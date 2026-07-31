import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Book Shelf</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Your personal reading dashboard</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="w-full h-16 px-8 flex items-center justify-between bg-blue-600 text-white shadow-md dark:bg-slate-950">
      <h1 className="text-3xl font-bold">
        Book Shelf
      </h1>

      <ThemeToggle />
    </header>
  );
}

export default Header;
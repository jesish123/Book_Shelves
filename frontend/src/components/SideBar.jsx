import { Link, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen border-r border-slate-200 bg-white/90 px-4 py-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 p-4 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-90">Shelf</p>
        <p className="mt-1 text-lg font-semibold">Keep your reading alive</p>
      </div>

      <nav aria-label="Primary sidebar navigation" className="space-y-6">
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                to="/user/dashboard"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                🏠 Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="px-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">My Library</h2>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/books" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800">
                📖 All Books
              </Link>
            </li>
            <li>
              <Link to="/add-book" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800">
                ➕ Add Book
              </Link>
            </li>
          </ul>
        </div>



        <div>
          <h2 className="px-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Account</h2>
          <ul className="mt-2 space-y-1">
            <li>
              <button onClick={handleLogout} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-slate-800">
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;
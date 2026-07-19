import { Link } from "react-router-dom";

function SideBar() {
  return (
    <aside className="bg-white border-r border-slate-300 w-64 min-h-screen py-6 px-4 overflow-auto shadow-md text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">

      <nav aria-label="Primary sidebar navigation">

        {/* Dashboard */}
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-100 hover:text-blue-700"
            >
              🏠 Dashboard
            </Link>
          </li>
        </ul>

        {/* My Library */}
        <div className="mt-6">
          <h2 className="text-blue-700 text-sm font-semibold px-3">
            My Library
          </h2>

          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/books"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                📖 All Books
              </Link>
            </li>

            <li>
              <Link
                to="/BookForm"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                ➕ Add Book
              </Link>
            </li>
          </ul>
        </div>

        {/* Reading Status */}
        <div className="mt-6">
          <h2 className="text-blue-700 text-sm font-semibold px-3">
            Reading Status
          </h2>

          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/want-to-read"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                📚 Want to Read
              </Link>
            </li>

            <li>
              <Link
                to="/reading"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                📖 Currently Reading
              </Link>
            </li>

            <li>
              <Link
                to="/finished"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                ✅ Finished Reading
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div className="mt-6">
          <h2 className="text-blue-700 text-sm font-semibold px-3">
            Account
          </h2>

          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/profile"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                👤 Profile
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700"
              >
                ⚙️ Settings
              </Link>
            </li>

            <li>
              <Link
                to="/logout"
                className="block rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                🚪 Logout
              </Link>
            </li>
          </ul>
        </div>

      </nav>
    </aside>
  );
}

export default SideBar;
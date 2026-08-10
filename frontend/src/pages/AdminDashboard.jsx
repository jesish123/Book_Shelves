import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import BookCard from "../components/BookCard";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const AdminDashboard = () => {
  const [usersOverview, setUsersOverview] = useState({ totalUsers: 0, totalBooksInSystem: 0, users: [] });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, booksRes] = await Promise.all([
          axios.get(`${API_URL}/api/books/admin/users-overview`, getAuthHeaders()),
          axios.get(`${API_URL}/api/books?all=true`, getAuthHeaders())
        ]);
        setUsersOverview(usersRes.data || { totalUsers: 0, totalBooksInSystem: 0, users: [] });
        const rawBooks = Array.isArray(booksRes.data) ? booksRes.data : [];
        const uniqueBooks = [];
        const seenTitles = new Set();
        for (const b of rawBooks) {
          const t = (b.title || "").toLowerCase().trim();
          if (!seenTitles.has(t)) {
            seenTitles.add(t);
            uniqueBooks.push(b);
          }
        }
        setBooks(uniqueBooks);
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        setError("Unable to load admin dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const booksByGenre = books.reduce((acc, book) => {
    const genreKey = book.genre?.trim() || "Unspecified";
    if (!acc[genreKey]) acc[genreKey] = [];
    acc[genreKey].push(book);
    return acc;
  }, {});

  const genreKeys = Object.keys(booksByGenre).sort((a, b) => a.localeCompare(b));

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Team reading overview</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              View registration stats and user reading activity.
            </p>
          </div>
          <Link to="/books">
            <Button variant="primary" size="md">
              Go to Book Management
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading admin summary...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Registered users</p>
                <p className="mt-3 text-3xl font-extrabold text-blue-600">{usersOverview.totalUsers}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Active accounts in the system.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total books logged</p>
                <p className="mt-3 text-3xl font-extrabold text-indigo-600">{usersOverview.totalBooksInSystem}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">All user titles in the library.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Active Readers</p>
                <p className="mt-3 text-3xl font-extrabold text-emerald-600">
                  {usersOverview.users?.filter((u) => u.totalBooks > 0).length || 0}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Users with at least one book.</p>
              </div>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Registered Users & Reading Activity</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review users and their reading activity.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {usersOverview.users.length} users loaded
                </span>
              </div>
              
              {usersOverview.users?.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No users found.
                </div>
              ) : (
                <div className="space-y-4">
                  {usersOverview.users?.map((u) => {
                    const isExpanded = expandedUserId === u.id;
                    return (
                      <div
                        key={u.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                👤 {u.first_name} {u.last_name}
                              </span>
                              {u.role === "admin" && (
                                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                              Want: {u.wantCount}
                            </span>
                            <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                              Reading: {u.readingCount}
                            </span>
                            <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              Finished: {u.finishedCount}
                            </span>

                            <button
                              onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                              className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              {isExpanded ? "Hide Books & Reviews ▲" : `View Books (${u.totalBooks}) ▼`}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                              Reading List & Reviews for {u.first_name}:
                            </h4>
                            {u.books?.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">This user hasn't added any books yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {u.books.map((b) => (
                                  <div
                                    key={b._id || b.id}
                                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                          {b.title}
                                        </h5>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">by {b.author}</p>
                                      </div>
                                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 whitespace-nowrap">
                                        {b.status === "want" ? "Want to Read" : b.status === "reading" ? "Reading" : "Finished"}
                                      </span>
                                    </div>

                                    {b.status === "finished" && (
                                      <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-semibold">Rating:</span>
                                        <StarRating value={b.rating || 0} readOnly={true} />
                                      </div>
                                    )}

                                    {b.review && (
                                      <div className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs italic border border-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                        "{b.review}"
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Library (Books by Genre)</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A preview of the current catalog grouped for quick review.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {genreKeys.length} genres
                </span>
              </div>

              {genreKeys.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No books available yet.
                </div>
              ) : (
                <div className="space-y-8">
                  {genreKeys.map((genre) => (
                    <div key={genre} className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{genre}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {booksByGenre[genre].length} books
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {booksByGenre[genre].map((book) => (
                          <BookCard
                            key={book._id || book.id}
                            book={book}
                            readOnly={true}
                            hideRating={true}
                            hideStatus={true}
                            detailsLink={`/books/${book._id || book.id}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

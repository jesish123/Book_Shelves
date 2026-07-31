import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import { getBooks, addBook, deleteBook as apiDeleteBook, getUsersOverview } from "../api";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BookPage = ({ openAddModal = false }) => {
  const [activeAdminTab, setActiveAdminTab] = useState("catalog"); // "catalog" | "users"
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Users overview state
  const [usersOverview, setUsersOverview] = useState({ totalUsers: 0, totalBooksInSystem: 0, users: [] });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(openAddModal);
  const [editingBook, setEditingBook] = useState(null);

  const fetchAllBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load books:", err);
      setError("Failed to load books from database. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsersOverview();
      setUsersOverview(data);
    } catch (err) {
      console.error("Failed to load users overview:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (openAddModal) {
      setIsModalOpen(true);
      setEditingBook(null);
    }
  }, [openAddModal]);

  useEffect(() => {
    fetchAllBooks();
    fetchUsersData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSaveBook = async (bookData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editingBook) {
        const bookId = editingBook._id || editingBook.id;
        const res = await axios.patch(`${API_URL}/api/books/${bookId}`, bookData, { headers });
        setBooks((prev) => prev.map((b) => ((b._id || b.id) === bookId ? res.data : b)));
      } else {
        const newBook = await addBook(bookData);
        setBooks((prev) => [newBook, ...prev]);
      }
      fetchUsersData();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Failed to save book. Please ensure required fields are filled out.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await apiDeleteBook(id);
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== id));
      fetchUsersData();
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert("Failed to delete book.");
    }
  };

  const filteredBooks = books.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      (b.title || "").toLowerCase().includes(term) ||
      (b.author || "").toLowerCase().includes(term) ||
      (b.genre || "").toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Control Center</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage database books & monitor registered user reading activities and reviews.
            </p>
          </div>
          {activeAdminTab === "catalog" && (
            <Button variant="primary" size="md" onClick={handleOpenAddModal}>
              ➕ Add New Book
            </Button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
          <button
            onClick={() => setActiveAdminTab("catalog")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeAdminTab === "catalog"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            📚 Book Catalog (CRUD)
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{books.length}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("users")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeAdminTab === "users"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            👥 Registered Users & Reading Activity
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {usersOverview.totalUsers}
            </span>
          </button>
        </div>

        {/* TAB 1: CATALOG CRUD */}
        {activeAdminTab === "catalog" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="🔍 Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <span className="text-xs text-slate-500 font-medium">
                Total Books: {filteredBooks.length}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading catalog...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-4xl">📖</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">No books found</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm ? "No books match your search." : "Catalog is empty. Add a book to get started!"}
                </p>
                <div className="mt-6">
                  <Button variant="primary" size="md" onClick={handleOpenAddModal}>
                    ➕ Add New Book
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book._id || book.id}
                    book={book}
                    adminMode={true}
                    onDelete={handleDeleteBook}
                    onEdit={handleOpenEditModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTERED USERS & READING ACTIVITY */}
        {activeAdminTab === "users" && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Users</p>
                <p className="mt-2 text-3xl font-extrabold text-blue-600">{usersOverview.totalUsers}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Books Logged</p>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">{usersOverview.totalBooksInSystem}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Readers</p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {usersOverview.users?.filter((u) => u.totalBooks > 0).length || 0}
                </p>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : usersOverview.users?.length === 0 ? (
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
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

                        {/* Shelf Counters */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            Want to Read: {u.wantCount}
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

                      {/* Expandable Reading Activity & Reviews */}
                      {isExpanded && (
                        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
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
                                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {b.title}
                                      </h5>
                                      <p className="text-xs text-slate-600 dark:text-slate-400">by {b.author}</p>
                                    </div>
                                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                                    <div className="mt-2 rounded-lg bg-white p-2.5 text-xs italic border border-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
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
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <AddBookModal
          onClose={handleCloseModal}
          onAdd={handleSaveBook}
          initialData={editingBook}
          isEditing={Boolean(editingBook)}
        />
      )}
    </AdminLayout>
  );
};

export default BookPage;


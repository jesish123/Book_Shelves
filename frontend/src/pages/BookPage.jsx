import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";
import Button from "../components/Button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const BookPage = ({ openAddModal = false, showAdminActions = true, defaultFilter = "" }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(openAddModal);
  const [editingBook, setEditingBook] = useState(null);

  const fetchAllBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (defaultFilter) {
        params.set("status", defaultFilter);
      }
      const queryString = params.toString();
      const endpoint = `${API_URL}/api/books`;
      const response = await axios.get(
        `${endpoint}${queryString ? `?${queryString}` : ""}`,
        getAuthHeaders()
      );
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load books:", err);
      setError("Failed to load books from database. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openAddModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsModalOpen(true);
      setEditingBook(null);
    }
  }, [openAddModal]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const headers = getAuthHeaders();

      if (editingBook) {
        const bookId = editingBook._id || editingBook.id;
        const res = await axios.patch(`${API_URL}/api/books/${bookId}`, bookData, headers);
        setBooks((prev) => prev.map((b) => ((b._id || b.id) === bookId ? res.data : b)));
      } else {
        const response = await axios.post(`${API_URL}/api/books`, bookData, headers);
        setBooks((prev) => [response.data, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Failed to save book. Please ensure required fields are filled out.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`${API_URL}/api/books/${id}`, getAuthHeaders());
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== id));
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

  const groupedBooksByGenre = filteredBooks.reduce((acc, book) => {
    const genreKey = book.genre?.trim() || 'Unspecified';
    if (!acc[genreKey]) acc[genreKey] = [];
    acc[genreKey].push(book);
    return acc;
  }, {});

  const genreSections = Object.keys(groupedBooksByGenre).sort((a, b) => a.localeCompare(b));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Book Management
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {showAdminActions
                ? "Manage the shared catalog with add, edit, and delete actions."
                : "Browse the shared book catalog without edit controls."}
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleOpenAddModal}>
            ➕ Add New Book
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-slate-500 font-medium">Total Books: {filteredBooks.length}</span>
            </div>
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
            <div className="space-y-8">
              {genreSections.map((genre) => (
                <section key={genre} className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{genre}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{groupedBooksByGenre[genre].length} book(s)</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {genreSections.indexOf(genre) + 1} / {genreSections.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    {groupedBooksByGenre[genre].map((book) => (
                      <BookCard
                        key={book._id || book.id}
                        book={book}
                        adminMode={showAdminActions}
                        onDelete={showAdminActions ? handleDeleteBook : undefined}
                        onEdit={showAdminActions ? handleOpenEditModal : undefined}
                        hideStatus={true}
                        hideRating={true}
                        detailsLink={`/books/${book._id || book.id}`}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
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

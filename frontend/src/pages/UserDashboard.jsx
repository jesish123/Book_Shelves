import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";
import Button from "../components/Button";
import { getBooks, addBook, updateBookStatus, deleteBook as apiDeleteBook } from "../api";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UserDashboard() {
  // Feature 1: useState for books array with status field ('want', 'reading', 'finished')
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Column header count calculations using state / useEffect
  const [counts, setCounts] = useState({ want: 0, reading: 0, finished: 0 });

  const fetchUserBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      const userBooksList = Array.isArray(data) ? data : [];
      setBooks(userBooksList);
    } catch (err) {
      console.error("Failed to fetch user books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBooks();
  }, []);

  // Feature 6: useEffect: count books per shelf, show in column header
  useEffect(() => {
    const want = books.filter((b) => b.status === "want").length;
    const reading = books.filter((b) => b.status === "reading").length;
    const finished = books.filter((b) => b.status === "finished").length;
    setCounts({ want, reading, finished });
  }, [books]);

  // Feature 2: AddBookModal submission
  const handleAddBook = async (bookData) => {
    try {
      const newBook = await addBook(bookData);
      setBooks((prev) => [newBook, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add book:", err);
      alert("Failed to add book. Please fill required fields.");
    }
  };

  // Feature 3: Move book between columns by changing status
  const handleMoveStatus = async (id, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
    );
    try {
      await updateBookStatus(id, newStatus);
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  // Feature 4: Delete book from list
  const handleDeleteBook = async (id) => {
    if (!window.confirm("Remove this book from your reading list?")) return;
    setBooks((prev) => prev.filter((b) => (b._id || b.id) !== id));
    try {
      await apiDeleteBook(id);
    } catch (err) {
      console.error("Failed to delete book on server:", err);
    }
  };

  // Feature 5: Star rating component with useState for finished books
  const handleRateBook = async (id, rating) => {
    setBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, rating } : b))
    );
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/books/${id}`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update rating on server:", err);
    }
  };


  const wantBooks = books.filter((b) => b.status === "want");
  const readingBooks = books.filter((b) => b.status === "reading");
  const finishedBooks = books.filter((b) => b.status === "finished");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* User Dashboard Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-md">
          <div>
            <h1 className="text-2xl font-extrabold">My Personal Reading Dashboard</h1>
            <p className="mt-1 text-sm opacity-90">
              Manage your personal library across reading shelves with live status updates.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => setIsModalOpen(true)}>
            ➕ Add Book to Shelf
          </Button>
        </div>

        {/* 3-Column Shelf Layout: Want to Read | Currently Reading | Finished Reading */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Column 1: Want to Read */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  📚 Want to Read
                </h2>
                <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {counts.want} {counts.want === 1 ? "book" : "books"}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {wantBooks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                    No books in Want to Read shelf
                  </div>
                ) : (
                  wantBooks.map((book) => (
                    <BookCard
                      key={book._id || book.id}
                      book={book}
                      adminMode={false}
                      onMove={handleMoveStatus}
                      onDelete={handleDeleteBook}
                      onRate={handleRateBook}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 2: Currently Reading */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-amber-50/30 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  📖 Currently Reading
                </h2>
                <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-extrabold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  {counts.reading} {counts.reading === 1 ? "book" : "books"}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {readingBooks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                    No books currently being read
                  </div>
                ) : (
                  readingBooks.map((book) => (
                    <BookCard
                      key={book._id || book.id}
                      book={book}
                      adminMode={false}
                      onMove={handleMoveStatus}
                      onDelete={handleDeleteBook}
                      onRate={handleRateBook}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Finished Reading */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-emerald-50/30 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  ✅ Finished Reading
                </h2>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {counts.finished} {counts.finished === 1 ? "book" : "books"}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {finishedBooks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                    No finished books yet
                  </div>
                ) : (
                  finishedBooks.map((book) => (
                    <BookCard
                      key={book._id || book.id}
                      book={book}
                      adminMode={false}
                      onMove={handleMoveStatus}
                      onDelete={handleDeleteBook}
                      onRate={handleRateBook}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature 2: AddBookModal */}
      {isModalOpen && (
        <AddBookModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddBook}
        />
      )}
    </AdminLayout>
  );
}

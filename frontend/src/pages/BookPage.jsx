import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../components/Button";
import AddBookModal from "../components/AddBookModal";
import BookCard from "../components/BookCard";
import * as api from "../api";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState({ want: 0, reading: 0, finished: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBooks(status);
      setBooks(data.map((book) => ({ ...book, id: book._id || book.id })));
    } catch (err) {
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const countsData = await api.getCounts();
      setCounts(countsData || { want: 0, reading: 0, finished: 0 });
    } catch (err) {
      setError((current) => current || err.message || 'Failed to load shelf counts');
    }
  };

  useEffect(() => {
    fetchBooks(statusFilter === 'all' ? undefined : statusFilter);
    fetchCounts();
  }, [statusFilter]);

  const addBook = async (book) => {
    try {
      const created = await api.createBook(book);
      setBooks((current) => [{ ...created, id: created._id || created.id }, ...current]);
      await fetchCounts();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to add book');
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.deleteBook(id);
      setBooks((current) => current.filter((book) => book.id !== id));
      await fetchCounts();
    } catch (err) {
      setError(err.message || 'Failed to delete');
    }
  };

  const moveBook = async (id, toStatus) => {
    try {
      const updated = await api.updateBook(id, { status: toStatus });
      setBooks((current) => current.map((book) => (book.id === id ? { ...updated, id: updated._id || updated.id } : book)));
      await fetchCounts();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const setRating = async (id, rating) => {
    try {
      const updated = await api.updateBook(id, { rating });
      setBooks((current) => current.map((book) => (book.id === id ? { ...updated, id: updated._id || updated.id } : book)));
    } catch (err) {
      setError(err.message || 'Failed to update rating');
    }
  };

  const byStatus = useMemo(() => ({
    want: books.filter((book) => book.status === 'want'),
    reading: books.filter((book) => book.status === 'reading'),
    finished: books.filter((book) => book.status === 'finished'),
  }), [books]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Book Shelves</h1>
          <p className="mt-2 text-slate-600">Track your want-to-read, currently reading, and finished books from one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border px-3 py-2">
            <option value="all">All</option>
            <option value="want">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>+ Add Book</Button>
        </div>
      </div>

      {loading && <div className="rounded border border-blue-200 bg-blue-50 p-4 text-blue-700">Loading books…</div>}
      {error && <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>}
      {!loading && !error && books.length === 0 && (
        <div className="rounded border border-slate-200 bg-white p-6 text-slate-600">No books found for this selection.</div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <h2 className="text-lg font-semibold">Want to Read</h2>
            <span className="text-sm text-slate-500">{counts.want}</span>
          </div>
          <div className="space-y-4">
            {byStatus.want.map((book) => (
              <BookCard key={book.id} book={book} onMove={moveBook} onDelete={deleteBook} onRate={setRating} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <h2 className="text-lg font-semibold">Reading</h2>
            <span className="text-sm text-slate-500">{counts.reading}</span>
          </div>
          <div className="space-y-4">
            {byStatus.reading.map((book) => (
              <BookCard key={book.id} book={book} onMove={moveBook} onDelete={deleteBook} onRate={setRating} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <h2 className="text-lg font-semibold">Finished</h2>
            <span className="text-sm text-slate-500">{counts.finished}</span>
          </div>
          <div className="space-y-4">
            {byStatus.finished.map((book) => (
              <BookCard key={book.id} book={book} onMove={moveBook} onDelete={deleteBook} onRate={setRating} />
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && <AddBookModal onAdd={addBook} onClose={() => setIsModalOpen(false)} />}
    </AdminLayout>
  );
};

export default BookPage;
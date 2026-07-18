import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddBookModal from "../components/AddBookModal";
import BookCard from "../components/BookCard";

const initialBooks = [
  {
    id: 1,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    status: "want",
    rating: 0,
    coverUrl: "https://picsum.photos/seed/hobbit/80/120",
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    status: "want",
    rating: 0,
    coverUrl: "https://picsum.photos/seed/dune/80/120",
  },
  {
    id: 3,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    status: "reading",
    rating: 0,
    coverUrl: "https://picsum.photos/seed/wind/80/120",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "Tech",
    status: "reading",
    rating: 0,
    coverUrl: "https://picsum.photos/seed/pragmatic/80/120",
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopia",
    status: "finished",
    rating: 5,
    coverUrl: "https://picsum.photos/seed/1984/80/120",
  },
  {
    id: 6,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    status: "finished",
    rating: 4,
    coverUrl: "https://picsum.photos/seed/mockingbird/80/120",
  },
];

const BookPage = () => {
  const [books, setBooks] = useState(() => initialBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState({ want: 0, reading: 0, finished: 0 });

  useEffect(() => {
    const c = books.reduce(
      (acc, b) => {
        if (b.status === "want") acc.want += 1;
        if (b.status === "reading") acc.reading += 1;
        if (b.status === "finished") acc.finished += 1;
        return acc;
      },
      { want: 0, reading: 0, finished: 0 }
    );
    setCounts(c);
  }, [books]);

  const addBook = (book) => {
    setBooks((s) => [{ id: Date.now(), rating: 0, ...book }, ...s]);
    setIsModalOpen(false);
  };

  const deleteBook = (id) => setBooks((s) => s.filter((b) => b.id !== id));

  const moveBook = (id, toStatus) =>
    setBooks((s) => s.map((b) => (b.id === id ? { ...b, status: toStatus } : b)));

  const setRating = (id, rating) =>
    setBooks((s) => s.map((b) => (b.id === id ? { ...b, rating } : b)));

  const byStatus = useMemo(() => ({
    want: books.filter((b) => b.status === "want"),
    reading: books.filter((b) => b.status === "reading"),
    finished: books.filter((b) => b.status === "finished"),
  }), [books]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Book Shelves</h1>
          <p className="mt-2 text-slate-600">Track your want-to-read, currently reading, and finished books from one place.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          + Add Book
        </button>
      </div>

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
import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import BookCard from "../components/BookCard";
import Button from "../components/Button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const LibraryPage = () => {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLibraryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [libraryResponse, myResponse] = await Promise.all([
        axios.get(`${API_URL}/books/library`, getAuthHeaders()),
        axios.get(`${API_URL}/books/mine`, getAuthHeaders()),
      ]);
      setLibraryBooks(Array.isArray(libraryResponse.data) ? libraryResponse.data : []);
      setMyBooks(Array.isArray(myResponse.data) ? myResponse.data : []);
    } catch (err) {
      console.error("Failed to load library data:", err);
      setError("Unable to load library books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const handleAddToShelf = async (bookId) => {
    try {
      await axios.post(`${API_URL}/books/${bookId}/add-to-shelf`, {}, getAuthHeaders());
      fetchLibraryData();
      window.dispatchEvent(new CustomEvent('bookAddedToShelf', { detail: { bookId } }));
      alert("Book added to your shelf.");
    } catch (err) {
      console.error("Failed to add book to shelf:", err);
      alert(err.response?.data?.message || "Could not add the book to your shelf.");
    }
  };

  const myBookIds = new Set(myBooks.map((book) => book._id || book.id));

  const booksWithStatus = libraryBooks.map((book) => ({
    book,
    alreadyAdded: myBookIds.has(book._id || book.id),
  }));

  const booksByGenre = booksWithStatus.reduce((collection, entry) => {
    const genre = (entry.book.genre || "Uncategorized").trim() || "Uncategorized";
    if (!collection[genre]) {
      collection[genre] = [];
    }
    collection[genre].push(entry);
    return collection;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Library</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Browse the full database of books and add any title to your personal shelf.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {loading ? "Loading..." : `${booksWithStatus.length} books available`}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : booksWithStatus.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            No books found in the library.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(booksByGenre).map(([genre, entries]) => (
              <section key={genre} className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {genre}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((entry) => (
                    <BookCard
                      key={entry.book._id || entry.book.id}
                      book={entry.book}
                      adminMode={false}
                      onAddToShelf={handleAddToShelf}
                      alreadyAdded={entry.alreadyAdded}
                      hideRating={true}
                      hideStatus={true}
                      detailsLink={`/books/${entry.book._id || entry.book.id}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default LibraryPage;


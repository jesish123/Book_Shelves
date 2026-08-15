import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import BookCard from "../components/BookCard";
import Button from "../components/Button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const UserDashboard = () => {
  const navigate = useNavigate();
  // Feature 1: useState for books array with status field ('want', 'reading', 'finished')
  const [allBooks, setAllBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Column header count calculations using state / useEffect
  const [counts, setCounts] = useState({ want: 0, reading: 0, finished: 0 });
  const [summaries, setSummaries] = useState({});
  const [loadingSummaryId, setLoadingSummaryId] = useState(null);

  const fetchAllUserBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`, getAuthHeaders());
      const userBooksList = Array.isArray(response.data) ? response.data : [];
      setAllBooks(userBooksList);
      if (selectedStatus === "all") {
        setVisibleBooks(userBooksList);
      }
    } catch (err) {
      console.error("Failed to fetch all user books:", err);
    }
  };

  const fetchVisibleBooks = async (status = "all") => {
    setLoading(true);
    try {
      const url = status && status !== "all"
        ? `${API_URL}/books?status=${encodeURIComponent(status)}`
        : `${API_URL}/books`;
      const response = await axios.get(url, getAuthHeaders());
      const userBooksList = Array.isArray(response.data) ? response.data : [];
      setVisibleBooks(userBooksList);
    } catch (err) {
      console.error("Failed to fetch visible user books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserBooks();
  }, []);

  useEffect(() => {
    fetchVisibleBooks(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    const handleBookAdded = () => {
      fetchAllUserBooks();
      fetchVisibleBooks(selectedStatus);
    };

    window.addEventListener('bookAddedToShelf', handleBookAdded);
    return () => window.removeEventListener('bookAddedToShelf', handleBookAdded);
  }, [selectedStatus]);

  // Feature 6: useEffect: count books per shelf, show in column header
  useEffect(() => {
    const want = allBooks.filter((b) => b.status === "want").length;
    const reading = allBooks.filter((b) => b.status === "reading").length;
    const finished = allBooks.filter((b) => b.status === "finished").length;
    setCounts({ want, reading, finished });
  }, [allBooks]);

  // Feature 2: AddBookModal submission
  // Feature 3: Move book between columns by changing status
  const handleMoveStatus = async (id, newStatus) => {
    setVisibleBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
    );
    setAllBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
    );
    try {
      await axios.patch(`${API_URL}/books/${id}`, { status: newStatus }, getAuthHeaders());
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  // Feature 4: Delete book from list
  const handleDeleteBook = async (id) => {
    if (!window.confirm("Remove this book from your reading list?")) return;
    setVisibleBooks((prev) => prev.filter((b) => (b._id || b.id) !== id));
    setAllBooks((prev) => prev.filter((b) => (b._id || b.id) !== id));
    try {
      await axios.delete(`${API_URL}/books/${id}`, getAuthHeaders());
    } catch (err) {
      console.error("Failed to delete book on server:", err);
    }
  };

  // Feature 5: Star rating component with useState for finished books
  const handleRateBook = async (id, rating) => {
    setVisibleBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, rating } : b))
    );
    setAllBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, rating } : b))
    );
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/books/${id}`,
        { rating },
        getAuthHeaders()
      );
    } catch (err) {
      console.error("Failed to update rating on server:", err);
    }
  };

  const handleSummarizeBook = async (id) => {
    setLoadingSummaryId(id);
    try {
      const response = await axios.post(`${API_URL}/books/${id}/summarize`, {}, getAuthHeaders());
      if (response.data?.summary) {
        setSummaries((prev) => ({ ...prev, [id]: response.data.summary }));
      }
    } catch (err) {
      console.error("Failed to summarize book:", err);
      alert("Unable to generate book summary at this time.");
    } finally {
      setLoadingSummaryId(null);
    }
  };

  const wantBooks = visibleBooks.filter((b) => b.status === "want");
  const readingBooks = visibleBooks.filter((b) => b.status === "reading");
  const finishedBooks = visibleBooks.filter((b) => b.status === "finished");

  const groupByGenre = (books) =>
    books.reduce((grouped, book) => {
      const genre = (book.genre || "Uncategorized").trim() || "Uncategorized";
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(book);
      return grouped;
    }, {});

  const wantBooksByGenre = groupByGenre(wantBooks);
  const readingBooksByGenre = groupByGenre(readingBooks);
  const finishedBooksByGenre = groupByGenre(finishedBooks);

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* User Dashboard Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-md">
          <div>
            <h1 className="text-2xl font-extrabold">My Personal Reading Dashboard</h1>
            <p className="mt-1 text-sm opacity-90">
              Manage your personal library across reading shelves with live status updates.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-white/40 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300"
            >
              <option className="text-slate-900" value="all">All Statuses</option>
              <option className="text-slate-900" value="want">Want to Read</option>
              <option className="text-slate-900" value="reading">Reading</option>
              <option className="text-slate-900" value="finished">Finished</option>
            </select>
            <Button variant="primary" size="md" onClick={() => navigate("/library") }>
              📚 Go to Library
            </Button>
          </div>
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
                  Object.entries(wantBooksByGenre).map(([genre, books]) => (
                    <div key={genre} className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{genre}</h3>
                      <div className="space-y-4">
                        {books.map((book) => (
                          <BookCard
                            key={book._id || book.id}
                            book={book}
                            adminMode={false}
                            onMove={handleMoveStatus}
                            onDelete={handleDeleteBook}
                            onRate={handleRateBook}
                            onSummarize={handleSummarizeBook}
                            summary={summaries[book._id || book.id]}
                            summarizing={loadingSummaryId === (book._id || book.id)}
                            sourceLabel={book._memberId ? 'From Library' : 'My Shelf'}
                          />
                        ))}
                      </div>
                    </div>
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
                  Object.entries(readingBooksByGenre).map(([genre, books]) => (
                    <div key={genre} className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{genre}</h3>
                      <div className="space-y-4">
                        {books.map((book) => (
                          <BookCard
                            key={book._id || book.id}
                            book={book}
                            adminMode={false}
                            onMove={handleMoveStatus}
                            onDelete={handleDeleteBook}
                            onRate={handleRateBook}
                            onSummarize={handleSummarizeBook}
                            summary={summaries[book._id || book.id]}
                            summarizing={loadingSummaryId === (book._id || book.id)}
                            sourceLabel={book._memberId ? 'From Library' : 'My Shelf'}
                          />
                        ))}
                      </div>
                    </div>
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
                  Object.entries(finishedBooksByGenre).map(([genre, books]) => (
                    <div key={genre} className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{genre}</h3>
                      <div className="space-y-4">
                        {books.map((book) => (
                          <BookCard
                            key={book._id || book.id}
                            book={book}
                            adminMode={false}
                            onMove={handleMoveStatus}
                            onDelete={handleDeleteBook}
                            onRate={handleRateBook}
                            onSummarize={handleSummarizeBook}
                            summary={summaries[book._id || book.id]}
                            summarizing={loadingSummaryId === (book._id || book.id)}
                            sourceLabel={book._memberId ? 'From Library' : 'My Shelf'}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </PublicLayout>
  );
}

export default UserDashboard;

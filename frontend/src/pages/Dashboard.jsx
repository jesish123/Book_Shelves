import { useMemo, useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import * as api from "../api";

function OverviewCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function BookOverviewCard({ book }) {
  const [imageError, setImageError] = useState(false);
  const hasCover = typeof book.coverUrl === "string" && book.coverUrl.trim().length > 0;
  const initials = book.title
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {hasCover && !imageError ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="h-16 w-16 rounded-2xl object-cover shadow-sm"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-700 text-lg font-bold text-white">
            {initials || "BK"}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-sm text-slate-600">{book.author} • {book.genre}</p>
        </div>
      </div>
      {book.status === "finished" && (
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-slate-500">Rating</span>
          <StarRating value={book.rating} onChange={() => {}} />
        </div>
      )}
    </article>
  );
}

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [counts, setCounts] = useState({ want: 0, reading: 0, finished: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [booksData, countsData] = await Promise.all([api.getBooks(), api.getCounts()]);
        if (!mounted) return;
        setBooks(booksData.map((book) => ({ ...book, id: book._id || book.id })));
        setCounts(countsData || { want: 0, reading: 0, finished: 0 });
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const byStatus = useMemo(
    () => ({
      want: books.filter((book) => book.status === "want"),
      reading: books.filter((book) => book.status === "reading"),
      finished: books.filter((book) => book.status === "finished"),
    }),
    [books]
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600">Overview of your book shelves and reading progress.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" size="md">View Library</Button>
            <Button variant="success" size="md" onClick={() => {}}>Add New Book</Button>
          </div>
        </div>

        {loading && <div className="rounded border border-blue-200 bg-blue-50 p-4 text-blue-700">Loading dashboard…</div>}
        {error && <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewCard title="Total Books" value={books.length} description="Books in your collection." />
              <OverviewCard title="Want to Read" value={counts.want} description="Ready for your next reads." />
              <OverviewCard title="Reading Now" value={counts.reading} description="Books currently in progress." />
              <OverviewCard title="Finished" value={counts.finished} description="Books you've completed." />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <section>
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                  <h2 className="text-lg font-semibold">Want to Read</h2>
                  <span className="text-sm text-slate-500">{counts.want}</span>
                </div>
                <div className="space-y-4">
                  {byStatus.want.length === 0 ? (
                    <p className="rounded border border-dashed border-slate-200 p-4 text-sm text-slate-500">No books on this shelf yet.</p>
                  ) : (
                    byStatus.want.map((book) => <BookOverviewCard key={book.id} book={book} />)
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                  <h2 className="text-lg font-semibold">Reading</h2>
                  <span className="text-sm text-slate-500">{counts.reading}</span>
                </div>
                <div className="space-y-4">
                  {byStatus.reading.length === 0 ? (
                    <p className="rounded border border-dashed border-slate-200 p-4 text-sm text-slate-500">No books on this shelf yet.</p>
                  ) : (
                    byStatus.reading.map((book) => <BookOverviewCard key={book.id} book={book} />)
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                  <h2 className="text-lg font-semibold">Finished</h2>
                  <span className="text-sm text-slate-500">{counts.finished}</span>
                </div>
                <div className="space-y-4">
                  {byStatus.finished.length === 0 ? (
                    <p className="rounded border border-dashed border-slate-200 p-4 text-sm text-slate-500">No books on this shelf yet.</p>
                  ) : (
                    byStatus.finished.map((book) => <BookOverviewCard key={book.id} book={book} />)
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
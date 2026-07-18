import { useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StarRating from "../components/StarRating";

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
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="h-16 w-16 rounded-2xl object-cover shadow-sm"
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
  const [books] = useState(initialBooks);

  const counts = useMemo(
    () =>
      books.reduce(
        (acc, book) => {
          if (book.status === "want") acc.want += 1;
          if (book.status === "reading") acc.reading += 1;
          if (book.status === "finished") acc.finished += 1;
          return acc;
        },
        { want: 0, reading: 0, finished: 0 }
      ),
    [books]
  );

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
            <button className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">View Library</button>
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Add New Book</button>
          </div>
        </div>

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
              {byStatus.want.map((book) => (
                <BookOverviewCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
              <h2 className="text-lg font-semibold">Reading</h2>
              <span className="text-sm text-slate-500">{counts.reading}</span>
            </div>
            <div className="space-y-4">
              {byStatus.reading.map((book) => (
                <BookOverviewCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
              <h2 className="text-lg font-semibold">Finished</h2>
              <span className="text-sm text-slate-500">{counts.finished}</span>
            </div>
            <div className="space-y-4">
              {byStatus.finished.map((book) => (
                <BookOverviewCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
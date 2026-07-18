import StarRating from "./StarRating";

function statusColor(status) {
  if (status === "want") return "bg-slate-100 text-slate-800";
  if (status === "reading") return "bg-yellow-100 text-yellow-800";
  if (status === "finished") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-800";
}

function CoverPlaceholder({ title, coverUrl }) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover`}
        className="h-20 w-16 rounded-2xl object-cover shadow-sm"
      />
    );
  }

  const initials = (title || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-20 w-16 items-center justify-center rounded-2xl bg-slate-700 text-lg font-bold text-white">
      {initials || "BK"}
    </div>
  );
}

export default function BookCard({ book, onMove, onDelete, onRate }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <CoverPlaceholder title={book.title} coverUrl={book.coverUrl} />
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{book.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{book.author} • {book.genre}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor(book.status)}`}>
              {book.status === "want" ? "Want to Read" : book.status === "reading" ? "Reading" : "Finished"}
            </span>
          </div>
        </div>
      </div>

      {book.status === "finished" && (
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">Rating</div>
          <StarRating value={book.rating} onChange={(value) => onRate(book.id, value)} />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {book.status === "want" && (
          <>
            <button type="button" onClick={() => onMove(book.id, "reading")} className="rounded bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-500">
              Start Reading
            </button>
            <button type="button" onClick={() => onMove(book.id, "finished")} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Mark Finished
            </button>
          </>
        )}
        {book.status === "reading" && (
          <>
            <button type="button" onClick={() => onMove(book.id, "want")} className="rounded bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300">
              Move to Want
            </button>
            <button type="button" onClick={() => onMove(book.id, "finished")} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Finish Book
            </button>
          </>
        )}
        {book.status === "finished" && (
          <>
            <button type="button" onClick={() => onMove(book.id, "reading")} className="rounded bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-500">
              Re-read
            </button>
            <button type="button" onClick={() => onMove(book.id, "want")} className="rounded bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300">
              Want Again
            </button>
          </>
        )}
        <button type="button" onClick={() => onDelete(book.id)} className="rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600">
          Delete
        </button>
      </div>
    </article>
  );
}

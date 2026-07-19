import { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";

function statusColor(status) {
  if (status === "want") return "bg-slate-100 text-slate-800";
  if (status === "reading") return "bg-yellow-100 text-yellow-800";
  if (status === "finished") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-800";
}

function CoverPlaceholder({ title, coverUrl }) {
  const [imageError, setImageError] = useState(false);
  const hasCover = typeof coverUrl === "string" && coverUrl.trim().length > 0;

  if (hasCover && !imageError) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover`}
        className="h-20 w-16 rounded-2xl object-cover shadow-sm"
        onError={() => setImageError(true)}
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
            <Button variant="warning" size="sm" onClick={() => onMove(book.id, "reading")}>Start Reading</Button>
            <Button variant="success" size="sm" onClick={() => onMove(book.id, "finished")}>Mark Finished</Button>
          </>
        )}
        {book.status === "reading" && (
          <>
            <Button variant="secondary" size="sm" onClick={() => onMove(book.id, "want")}>Move to Want</Button>
            <Button variant="success" size="sm" onClick={() => onMove(book.id, "finished")}>Finish Book</Button>
          </>
        )}
        {book.status === "finished" && (
          <>
            <Button variant="warning" size="sm" onClick={() => onMove(book.id, "reading")}>Re-read</Button>
            <Button variant="secondary" size="sm" onClick={() => onMove(book.id, "want")}>Want Again</Button>
          </>
        )}
        <Button variant="danger" size="sm" onClick={() => onDelete(book.id)}>Delete</Button>
      </div>
    </article>
  );
}

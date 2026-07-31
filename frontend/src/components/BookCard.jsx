import { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";

function CoverPlaceholder({ title, coverUrl }) {
  const [imageError, setImageError] = useState(false);
  const hasCover = typeof coverUrl === "string" && coverUrl.trim().length > 0;

  if (hasCover && !imageError) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover`}
        className="h-20 w-14 rounded-md object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0"
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
    <div className="flex h-20 w-14 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-sm shrink-0">
      {initials || "BK"}
    </div>
  );
}

export default function BookCard({ book, onMove, onDelete, onRate, onEdit, adminMode = false }) {
  const bookId = book._id || book.id;
  const cover = book.coverUrl || book.coverImage || "";

  return (
    <article className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <CoverPlaceholder title={book.title} coverUrl={cover} />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{book.title}</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{book.author}</p>
            {book.genre && (
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {book.genre}
              </span>
            )}
            {book.review && (
              <p className="mt-1 text-xs italic text-slate-500 line-clamp-2 dark:text-slate-400">
                "{book.review}"
              </p>
            )}
          </div>
        </div>

        {!adminMode && book.status === "finished" && (
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rating</span>
            <StarRating value={book.rating || 0} onChange={(value) => onRate && onRate(bookId, value)} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        {adminMode ? (
          <div className="flex items-center gap-2 w-full justify-end">
            <Button variant="secondary" size="sm" onClick={() => onEdit && onEdit(book)}>
              ✏️ Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete && onDelete(bookId)}>
              🗑️ Delete
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {book.status === "want" && (
                <>
                  <Button variant="warning" size="sm" onClick={() => onMove(bookId, "reading")}>Start Reading</Button>
                  <Button variant="success" size="sm" onClick={() => onMove(bookId, "finished")}>Mark Finished</Button>
                </>
              )}
              {book.status === "reading" && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => onMove(bookId, "want")}>Move to Want</Button>
                  <Button variant="success" size="sm" onClick={() => onMove(bookId, "finished")}>Finish Book</Button>
                </>
              )}
              {book.status === "finished" && (
                <>
                  <Button variant="warning" size="sm" onClick={() => onMove(bookId, "reading")}>Re-read</Button>
                  <Button variant="secondary" size="sm" onClick={() => onMove(bookId, "want")}>Want Again</Button>
                </>
              )}
            </div>
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(bookId)}>Delete</Button>
            )}
          </>
        )}
      </div>
    </article>
  );
}



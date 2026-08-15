import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import Button from "./Button";

const getCoverCandidates = (book = {}) => {
  const isbn = (book.isbn || book.ISBN || "").toString().replace(/[^0-9Xx]/g, "").toUpperCase();
  if (!isbn) return [];

  return [
    `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
    `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
    `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`,
  ];
};

const CoverPlaceholder = ({ title, coverUrl, book }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const coverCandidates = [...(coverUrl ? [coverUrl] : []), ...getCoverCandidates(book)];
  const uniqueCandidates = Array.from(new Set(coverCandidates.filter(Boolean)));
  const currentSrc = uniqueCandidates[currentSrcIndex] || "";

  useEffect(() => {
    setCurrentSrcIndex(0);
    setImageError(false);
  }, [coverUrl, book?.isbn, book?.ISBN]);

  const handleImageError = () => {
    if (currentSrcIndex < uniqueCandidates.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
      return;
    }
    setImageError(true);
  };

  const hasCover = typeof currentSrc === "string" && currentSrc.trim().length > 0;

  if (hasCover && !imageError) {
    return (
      <img
        src={currentSrc}
        alt={`${title} cover`}
        className="h-20 w-14 rounded-md object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0"
        referrerPolicy="origin"
        onError={handleImageError}
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

const BookCard = ({ book, onMove, onDelete, onRate, onEdit, onAddToShelf, onSummarize, summary, summarizing = false, alreadyAdded = false, adminMode = false, readOnly = false, hideRating = false, hideStatus = false, detailsLink, sourceLabel }) => {
  const bookId = book._id || book.id;
  const isbn = book.isbn || book.ISBN || "";
  const cover = book.coverUrl || book.coverImage || (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn.replace(/[^0-9Xx]/g, '').toUpperCase()}-L.jpg` : "");

  return (
    <article className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {detailsLink ? (
            <Link to={detailsLink} className="shrink-0 hover:opacity-80 transition">
              <CoverPlaceholder title={book.title} coverUrl={cover} book={book} />
            </Link>
          ) : (
            <CoverPlaceholder title={book.title} coverUrl={cover} book={book} />
          )}
          <div className="flex-1 min-w-0">
            {detailsLink ? (
              <Link to={detailsLink} className="block text-base font-bold text-slate-900 dark:text-slate-100 truncate hover:text-blue-600">
                {book.title}
              </Link>
            ) : (
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{book.title}</h3>
            )}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{book.author}</p>
            {!hideStatus && book.status && (
              <span
                className={`inline-flex mt-2 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  book.status === 'want'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : book.status === 'reading'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {book.status === 'want' ? 'Want to Read' : book.status === 'reading' ? 'Reading' : 'Finished'}
              </span>
            )}
            {book.genre && (
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {book.genre}
              </span>
            )}
            {sourceLabel && (
              <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {sourceLabel}
              </span>
            )}
            {book.review && (
              <p className="mt-1 text-xs italic text-slate-500 line-clamp-2 dark:text-slate-400">
                "{book.review}"
              </p>
            )}
          </div>
        </div>

        {!readOnly && !adminMode && book.status === "finished" && !hideRating && (
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rating</span>
            <StarRating value={book.rating || 0} onChange={(value) => onRate && onRate(bookId, value)} />
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
        {readOnly ? null : adminMode ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit && onEdit(book)}>
              ✏️ Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete && onDelete(bookId)}>
              🗑️ Delete
            </Button>
          </div>
        ) : onAddToShelf ? (
          <div className="flex w-full justify-end">
            <Button
              variant={alreadyAdded ? "secondary" : "primary"}
              size="sm"
              onClick={() => !alreadyAdded && onAddToShelf(bookId)}
              disabled={alreadyAdded}
            >
              {alreadyAdded ? "In Shelf" : "➕ Add to Shelf"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {book.status === "want" && (
                <>
                  <Button variant="warning" size="sm" onClick={() => onMove && onMove(bookId, "reading")}>Start Reading</Button>
                  <Button variant="success" size="sm" onClick={() => onMove && onMove(bookId, "finished")}>Mark Finished</Button>
                </>
              )}
              {book.status === "reading" && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => onMove && onMove(bookId, "want")}>Move to Want</Button>
                  <Button variant="success" size="sm" onClick={() => onMove && onMove(bookId, "finished")}>Finish Book</Button>
                </>
              )}
              {book.status === "finished" && (
                <>
                  <Button variant="warning" size="sm" onClick={() => onMove && onMove(bookId, "reading")}>Re-read</Button>
                  <Button variant="secondary" size="sm" onClick={() => onMove && onMove(bookId, "want")}>Want Again</Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {onDelete && (
                <Button variant="danger" size="sm" onClick={() => onDelete(bookId)}>Delete</Button>
              )}
              {onSummarize && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSummarize && onSummarize(bookId)}
                  disabled={summarizing}
                >
                  {summarizing ? 'Summarizing...' : summary ? 'Refresh Summary' : 'Summarize'}
                </Button>
              )}
            </div>
          </div>
        )}
        {detailsLink && (
          <div className="mt-3">
            <Link to={detailsLink} className="text-sm font-semibold text-blue-600 hover:underline">
              View details
            </Link>
          </div>
        )}
      </div>
      {summary && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Summary:</span>
          <p className="mt-2 whitespace-pre-line">{summary}</p>
        </div>
      )}
    </article>
  );
}

export default BookCard;



import { useState } from "react";
import Button from "./Button";

async function getBookCoverUrl(title, author) {
  const cleanTitle = (title || '').trim();
  const cleanAuthor = (author || '').trim();

  if (!cleanTitle && !cleanAuthor) {
    return '';
  }

  const queryParts = [];
  if (cleanTitle) queryParts.push(`intitle:${encodeURIComponent(cleanTitle)}`);
  if (cleanAuthor) queryParts.push(`inauthor:${encodeURIComponent(cleanAuthor)}`);

  const query = queryParts.join('+');
  if (!query) return '';

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    if (!response.ok) {
      return '';
    }

    const data = await response.json();
    const imageLinks = data?.items?.[0]?.volumeInfo?.imageLinks || {};
    const imageUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || '';
    return imageUrl.replace(/^http:\/\//i, 'https://');
  } catch {
    return '';
  }
}

function AddBookModal({ onAdd, onClose, initialData = null, isEditing = false }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [genre, setGenre] = useState(initialData?.genre || "");
  const [status, setStatus] = useState(initialData?.status || "want");
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");
  const [review, setReview] = useState(initialData?.review || "");
  const [isSearchingCover, setIsSearchingCover] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedCoverUrl = coverUrl.trim();

    setIsSearchingCover(true);
    try {
      const resolvedCoverUrl = trimmedCoverUrl || (await getBookCoverUrl(trimmedTitle, trimmedAuthor));
      await onAdd({
        title: trimmedTitle,
        author: trimmedAuthor,
        genre: genre.trim(),
        status,
        coverUrl: resolvedCoverUrl,
        review: review.trim(),
        rating: 0,
      });
      setTitle("");
      setAuthor("");
      setGenre("");
      setStatus("want");
      setCoverUrl("");
      setReview("");
    } finally {
      setIsSearchingCover(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          {isEditing ? "Edit Book" : "Add Book"}
        </h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Genre</label>
            <input value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cover URL</label>
            <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://example.com/cover.jpg" className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Review</label>
            <textarea value={review} onChange={(e) => setReview(e.target.value)} rows="3" className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
              <option value="want">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={isSearchingCover}>
              {isSearchingCover ? "Fetching cover..." : (isEditing ? "Update" : "Add")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;

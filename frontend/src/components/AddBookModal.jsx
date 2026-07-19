import { useState } from "react";
import { getBookCoverUrl } from "../api";
import Button from "./Button";

export default function AddBookModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("want");
  const [coverUrl, setCoverUrl] = useState("");
  const [review, setReview] = useState("");
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
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Add Book</h3>
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
              {isSearchingCover ? "Fetching cover..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

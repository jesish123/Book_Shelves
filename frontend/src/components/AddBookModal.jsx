import { useState } from "react";

export default function AddBookModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("want");
  const [coverUrl, setCoverUrl] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    onAdd({ title: title.trim(), author: author.trim(), genre: genre.trim(), status, coverUrl: coverUrl.trim() });
    setTitle("");
    setAuthor("");
    setGenre("");
    setStatus("want");
    setCoverUrl("");
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border px-3 py-2 rounded bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
              <option value="want">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import Button from "./Button";

const getBookCoverUrl = async (title, author) => {
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

const AddBookModal = ({ onAdd, onClose, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    author: initialData?.author || "",
    isbn: initialData?.isbn || "",
    genre: initialData?.genre || "",
    publisher: initialData?.publisher || "",
    publicationDate: initialData?.publicationDate ? new Date(initialData.publicationDate).toISOString().split('T')[0] : "",
    language: initialData?.language || "English",
    pageCount: initialData?.pageCount || "",
    description: initialData?.description || "",
    coverUrl: initialData?.coverUrl || "",
    stockQuantity: initialData?.stockQuantity || 0,
    shelfLocation: initialData?.shelfLocation || "",
    availabilityStatus: initialData?.availabilityStatus || "active",
    status: initialData?.status || "want",
  });
  const [file, setFile] = useState(null);
  const [isSearchingCover, setIsSearchingCover] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.title.trim() || !formData.author.trim()) {
      setError("Title and author are required.");
      return;
    }

    setIsSearchingCover(true);
    try {
      let finalFileUrl = formData.fileUrl || "";
      if (file) {
        setIsUploading(true);
        const fileData = new FormData();
        fileData.append('bookFile', file);
        const uploadRes = await fetch('/api/books/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: fileData
        });
        if (uploadRes.ok) {
          const resData = await uploadRes.json();
          finalFileUrl = resData.fileUrl;
        } else {
          throw new Error('File upload failed');
        }
        setIsUploading(false);
      }

      const resolvedCoverUrl = formData.coverUrl.trim() || (await getBookCoverUrl(formData.title.trim(), formData.author.trim()));
      await onAdd({
        ...formData,
        coverUrl: resolvedCoverUrl,
        fileUrl: finalFileUrl,
      });
    } catch (err) {
      setError(err.message || "Failed to save book.");
    } finally {
      setIsSearchingCover(false);
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          {isEditing ? "Edit Book Metadata" : "Add New Book"}
        </h3>
        
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300 shrink-0">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Core Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 dark:border-slate-700">Core Identification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Author(s) *</label>
                <input name="author" value={formData.author} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Genre / Categories</label>
                <input name="genre" value={formData.genre} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cover Image URL</label>
                <input name="coverUrl" value={formData.coverUrl} onChange={handleChange} placeholder="Leave empty to auto-fetch from Google Books" className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>

              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subtitle</label>
                    <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">ISBN-10 / ISBN-13</label>
                    <input name="isbn" value={formData.isbn} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
                  </div>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <>
              {/* Categorization and Metadata */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 dark:border-slate-700">Categorization & Metadata</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Publisher</label>
                <input name="publisher" value={formData.publisher} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Publication Date</label>
                <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
                <input name="language" value={formData.language} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Page Count</label>
                <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description / Synopsis</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Readable File (PDF/EPUB)</label>
              <input type="file" accept=".pdf,.epub" onChange={handleFileChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              {formData.fileUrl && !file && <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">Current file linked: {formData.fileUrl.split('/').pop()}</p>}
            </div>
          </div>

          {/* Inventory and System Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 dark:border-slate-700">Inventory & Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shelf Location</label>
                <input name="shelfLocation" value={formData.shelfLocation} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Availability</label>
                <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
                  <option value="active">Active</option>
                  <option value="out of stock">Out of Stock</option>
                  <option value="archived">Archived</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
            </>
          )}
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 shrink-0 sticky bottom-0 bg-white dark:bg-slate-900 py-2">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={isSearchingCover || isUploading || !formData.title.trim() || !formData.author.trim()}>
              {isUploading ? "Uploading file..." : isSearchingCover ? "Fetching cover..." : (isEditing ? "Save Changes" : "Add Book")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;

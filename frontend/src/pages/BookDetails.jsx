import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import AddBookModal from "../components/AddBookModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const getCoverCandidates = (book = {}) => {
  const isbn = (book.isbn || book.ISBN || "").toString().replace(/[^0-9Xx]/g, "").toUpperCase();
  if (!isbn) return [];

  return [
    `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
    `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
    `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`,
  ];
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [savingReview, setSavingReview] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [coverSrc, setCoverSrc] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsAdmin(user.role === "admin");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const fetchBook = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/books/${id}`, getAuthHeaders());
      const bookData = response.data;
      setBook(bookData);
      const candidateList = [...(bookData.coverUrl ? [bookData.coverUrl] : []), ...getCoverCandidates(bookData)];
      setCoverSrc(Array.from(new Set(candidateList.filter(Boolean)))[0] || "");
      setReview(bookData.review || "");
      setRating(bookData.rating || 0);
      setAlreadyAdded(Boolean(bookData.userId || bookData._memberId));
    } catch (err) {
      console.error("Failed to load book details:", err);
      setError(err.response?.data?.message || "Unable to load book details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleSaveReview = async () => {
    if (!book) return;
    if (!review.trim() && rating <= 0) {
      alert("Add a rating or review before saving.");
      return;
    }

    setSavingReview(true);
    try {
      const payload = {
        review: review.trim(),
        rating,
      };
      const response = await axios.patch(`${API_URL}/api/books/${id}`, payload, getAuthHeaders());
      setBook(response.data);
      setReview(response.data.review || "");
      setRating(response.data.rating || 0);
      alert("Review saved successfully.");
    } catch (err) {
      console.error("Failed to save review:", err);
      alert(err.response?.data?.message || "Failed to save review.");
    } finally {
      setSavingReview(false);
    }
  };

  const handleAddToShelf = async () => {
    if (!book) return;
    try {
      await axios.post(`${API_URL}/api/books/${id}/add-to-shelf`, {}, getAuthHeaders());
      setAlreadyAdded(true);
      alert("Book added to your shelf.");
    } catch (err) {
      console.error("Failed to add book to shelf:", err);
      alert(err.response?.data?.message || "Unable to add the book to your shelf.");
    }
  };

  const handleSaveBook = async (updatedData) => {
    try {
      const response = await axios.patch(`${API_URL}/api/books/${id}`, updatedData, getAuthHeaders());
      setBook(response.data);
      setEditOpen(false);
      alert("Book updated successfully.");
    } catch (err) {
      console.error("Failed to update book:", err);
      alert(err.response?.data?.message || "Failed to update book.");
    }
  };

  const isLibrarySource = book && Boolean(book._memberId);
  const canReview = book && book.status !== "want" && !isAdmin;

  const handleCoverError = () => {
    if (!book) return;
    const candidates = [...(book.coverUrl ? [book.coverUrl] : []), ...getCoverCandidates(book)];
    const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)));
    const nextIndex = uniqueCandidates.indexOf(coverSrc) + 1;

    if (nextIndex > 0 && nextIndex < uniqueCandidates.length) {
      setCoverSrc(uniqueCandidates[nextIndex]);
      return;
    }

    setCoverSrc("");
  };

  // Compute analytics
  let totalSaves = 0;
  let avgRating = 0;
  if (book) {
    const members = book.members || [];
    totalSaves = members.length;
    const ratings = members.map(m => m.rating).filter(r => r > 0);
    if (book.rating > 0) ratings.push(book.rating);
    avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
  }

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Book Details</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">View full details, inventory status, and analytics.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            {isAdmin && (
              <Button variant="primary" size="md" onClick={() => setEditOpen(true)}>
                ✏️ Edit Book
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : !book ? (
          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
            Book not found.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* Left Column: Cover & Actions */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                {coverSrc ? (
                  <img src={coverSrc} alt={`${book.title} cover`} referrerPolicy="origin" onError={handleCoverError} className="h-96 w-full rounded-2xl object-cover shadow-md" />
                ) : (
                  <div className="flex h-96 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                    <span className="text-3xl font-bold">{(book.title || "").slice(0, 2).toUpperCase() || "BK"}</span>
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  {book.fileUrl && (
                    <a href={book.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="md" fullWidth={true}>
                        📖 Read Book
                      </Button>
                    </a>
                  )}
                  {isLibrarySource && !alreadyAdded && !isAdmin && (
                    <Button variant="secondary" size="md" fullWidth={true} onClick={handleAddToShelf}>
                      ➕ Add to Shelf
                    </Button>
                  )}
                  {isLibrarySource && alreadyAdded && !isAdmin && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                      ✓ In Your Shelf
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement and Analytics */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 dark:border-slate-800">Engagement & Analytics</h3>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total User Saves</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{totalSaves}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Avg Rating</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                    <StarRating value={Math.round(avgRating)} readOnly />
                    <span className="ml-1">{avgRating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Report Flags</span>
                  <span className={`font-semibold ${book.reportFlagCounter > 0 ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {book.reportFlagCounter || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Metadata */}
            <div className="space-y-6">
              {/* Header Info */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{book.title}</h2>
                  {book.subtitle && <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400">{book.subtitle}</h3>}
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">{book.author}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {book.genre && <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{book.genre}</span>}
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase tracking-wider">{isLibrarySource ? "Library" : "Personal Shelf"}</span>
                    {!isLibrarySource && book.status && (
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 capitalize">
                        {book.status}
                      </span>
                    )}
                  </div>
                </div>

                {book.description && (
                  <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Synopsis</h4>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                      {book.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Data Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Core Metadata */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 dark:border-slate-700">Publication Details</h3>
                  
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-slate-500 dark:text-slate-400">ISBN</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{book.isbn || '—'}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Publisher</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{book.publisher || '—'}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Published Date</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : '—'}
                    </div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Language</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{book.language || 'English'}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Page Count</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{book.pageCount || '—'}</div>
                  </div>
                </div>

                {/* Inventory Metadata */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 dark:border-slate-700">Inventory & Status</h3>
                  
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-slate-500 dark:text-slate-400">Stock Quantity</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{book.stockQuantity || 0} copies</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Shelf Location</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{book.shelfLocation || '—'}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Availability</div>
                    <div className="font-medium capitalize text-slate-900 dark:text-slate-100">
                      <span className={`inline-flex items-center gap-1.5 ${
                        book.availabilityStatus === 'active' ? 'text-emerald-600 dark:text-emerald-400' :
                        book.availabilityStatus === 'out of stock' ? 'text-red-500 dark:text-red-400' :
                        'text-amber-500 dark:text-amber-400'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {book.availabilityStatus || 'Active'}
                      </span>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400">Date Added</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '—'}
                    </div>

                    <div className="text-slate-500 dark:text-slate-400">Last Updated</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Review Section */}
              {!isAdmin && !isLibrarySource && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Your Review & Rating</h3>
                  {canReview ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Star Rating</label>
                        <StarRating value={rating} onChange={setRating} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Review</label>
                        <textarea
                          rows={4}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          placeholder="Share what you thought about this book..."
                        />
                      </div>
                      <div className="flex gap-3 flex-wrap pt-2">
                        <Button variant="primary" size="md" onClick={handleSaveReview} disabled={savingReview}>
                          {savingReview ? "Saving..." : "Save Review"}
                        </Button>
                        <Button variant="secondary" size="md" onClick={() => {
                          setReview(book.review || "");
                          setRating(book.rating || 0);
                        }}>
                          Reset
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                      <p>You can add a review once this book is marked as <strong>reading</strong> or <strong>finished</strong>.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {editOpen && book && (
        <AddBookModal
          isEditing={true}
          initialData={book}
          onClose={() => setEditOpen(false)}
          onAdd={handleSaveBook}
        />
      )}
    </PublicLayout>
  );
};

export default BookDetails;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getBooks = async (status) => {
  const url = status && status !== "all" 
    ? `${API_URL}/books?status=${status}` 
    : `${API_URL}/books`;
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

export const getCounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/books/counts`, getAuthHeaders());
    return response.data;
  } catch {
    // Fallback if backend /books/counts endpoint is not implemented: compute from all books
    const books = await getBooks();
    return {
      want: books.filter((b) => b.status === "want" || b.status === "pending").length,
      reading: books.filter((b) => b.status === "reading" || b.status === "in-progress").length,
      finished: books.filter((b) => b.status === "finished" || b.status === "completed").length,
    };
  }
};

export const addBook = async (bookData) => {
  const response = await axios.post(`${API_URL}/books`, bookData, getAuthHeaders());
  return response.data;
};

export const updateBookStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/books/${id}`, { status }, getAuthHeaders());
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await axios.delete(`${API_URL}/books/${id}`, getAuthHeaders());
  return response.data;
};

export const getUsersOverview = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users/overview`, getAuthHeaders());
    return response.data;
  } catch {
    const response = await axios.get(`${API_URL}/api/books/admin/users-overview`, getAuthHeaders());
    return response.data;
  }
};



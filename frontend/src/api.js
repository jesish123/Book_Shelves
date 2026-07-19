import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/books';

const client = axios.create({ baseURL: BASE, timeout: 10000 });

export async function getBooks(status) {
  const params = {};
  if (status && status !== 'all') params.status = status;
  const res = await client.get('/', { params });
  return res.data;
}

export async function getCounts() {
  const res = await client.get('/counts');
  return res.data;
}

export async function createBook(payload) {
  const res = await client.post('/', payload);
  return res.data;
}

export async function updateBook(id, payload) {
  const res = await client.put(`/${id}`, payload);
  return res.data;
}

export async function deleteBook(id) {
  const res = await client.delete(`/${id}`);
  return res.data;
}

export async function getBookCoverUrl(title, author) {
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

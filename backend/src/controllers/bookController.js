const bookModel = require('../models/bookModel');

function getBooks(req, res) {
  const books = bookModel.getAllBooks();
  res.json(books);
}

function getBookById(req, res) {
  const book = bookModel.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(book);
}

function createBook(req, res) {
  const { title, author, status } = req.body;
  if (!title || !author || !status) {
    return res.status(400).json({ error: 'Title, author, and status are required' });
  }

  const book = bookModel.createBook(req.body);
  res.status(201).json(book);
}

function updateBook(req, res) {
  const book = bookModel.updateBook(req.params.id, req.body);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(book);
}

function deleteBook(req, res) {
  const deleted = bookModel.deleteBook(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(204).end();
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};

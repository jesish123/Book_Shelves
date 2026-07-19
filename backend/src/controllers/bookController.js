const bookModel = require('../models/bookModel');

const getAllBooks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const books = await bookModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
};

const getCounts = async (req, res) => {
  try {
    const agg = await bookModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const counts = { want: 0, reading: 0, finished: 0 };
    agg.forEach((g) => {
      if (g._id) counts[g._id] = g.count;
    });
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving counts', error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const payload = {
      title: title.trim(),
      author: author.trim(),
      genre: (req.body.genre || '').trim(),
      coverUrl: (req.body.coverUrl || '').trim(),
      status: req.body.status || 'want',
      rating: req.body.rating ?? 0,
      review: (req.body.review || '').trim(),
      userId: req.body.userId || null,
    };

    const book = await bookModel.create(payload);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await bookModel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleted = await bookModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

module.exports = {
  getBooks: getAllBooks,
  getAllBooks,
  getCounts,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};

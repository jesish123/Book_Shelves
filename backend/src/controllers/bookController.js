const bookModel = require('../models/bookModel');
const UserModel = require('../models/UserModal');

const getUserId = (req) => req.user?.id || req.user?._id || null;

const seedSampleBooks = async (userId = null) => {
  const count = await bookModel.countDocuments();
  if (count > 0) return;

  const sampleBooks = [
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Adventure / Fiction",
      coverUrl: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
      status: "want",
      rating: 0,
      review: "An inspiring journey of self-discovery and following your dreams.",
      userId,
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help / Productivity",
      coverUrl: "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg",
      status: "want",
      rating: 0,
      review: "Practical framework for building good habits and breaking bad ones.",
      userId,
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Classic Romance",
      coverUrl: "https://m.media-amazon.com/images/I/71Q1tPupKFL._AC_UF1000,1000_QL80_.jpg",
      status: "reading",
      rating: 0,
      review: "Witty commentary on social class and romance.",
      userId,
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian Fiction",
      coverUrl: "https://m.media-amazon.com/images/I/71N+6Jsm+zL._AC_UF1000,1000_QL80_.jpg",
      status: "reading",
      rating: 0,
      review: "A chilling warning about totalitarianism and surveillance.",
      userId,
    },
    {
      title: "The Hobbit",
      author: "J. R. R. Tolkien",
      genre: "Epic Fantasy",
      coverUrl: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
      status: "finished",
      rating: 5,
      review: "A timeless masterpiece of adventure, courage, and world-building.",
      userId,
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Classic Fiction",
      coverUrl: "https://m.media-amazon.com/images/I/71FxgtfkcQL._AC_UF1000,1000_QL80_.jpg",
      status: "finished",
      rating: 5,
      review: "Deeply moving exploration of justice, empathy, and moral growth.",
      userId,
    },
  ];

  await bookModel.insertMany(sampleBooks);
};

const getUsersOverview = async (req, res) => {
  try {
    await seedSampleBooks(getUserId(req));
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 });
    const books = await bookModel.find().sort({ createdAt: -1 });

    const usersData = users.map((u) => {
      const userBooks = books.filter((b) => !b.userId || String(b.userId) === String(u._id));
      const wantCount = userBooks.filter((b) => b.status === 'want').length;
      const readingCount = userBooks.filter((b) => b.status === 'reading').length;
      const finishedCount = userBooks.filter((b) => b.status === 'finished').length;

      return {
        id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        totalBooks: userBooks.length,
        wantCount,
        readingCount,
        finishedCount,
        books: userBooks,
      };
    });

    res.status(200).json({
      totalUsers: users.length,
      totalBooksInSystem: books.length,
      users: usersData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users overview', error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    await seedSampleBooks(userId);

    const filter = req.user?.role === 'admin' ? {} : { $or: [{ userId }, { userId: null }] };
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
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const matchStage = req.user?.role === 'admin' ? {} : { userId };
    const agg = await bookModel.aggregate([
      { $match: matchStage },
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
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const book = await bookModel.findOne({ _id: req.params.id, userId });
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
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

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
      userId,
    };

    const book = await bookModel.create(payload);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const filter = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, $or: [{ userId }, { userId: null }] };

    const book = await bookModel.findOneAndUpdate(
      filter,
      { ...req.body, userId },
      { returnDocument: 'after', new: true }
    );

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
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const filter = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, $or: [{ userId }, { userId: null }] };

    const deleted = await bookModel.findOneAndDelete(filter);
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
  getUsersOverview,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};


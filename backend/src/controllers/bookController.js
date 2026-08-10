const bookModel = require('../models/bookModel');
const UserModel = require('../models/UserModal');
const { generateBookSummary } = require('../services/GeminiService');

const getUserId = (req) => req.user?.id || req.user?._id || null;

const isSameId = (a, b) => String(a) === String(b);

const flattenBookForUser = (book, userId) => {
  if (!book) return book;
  const bookObj = typeof book.toObject === 'function' ? book.toObject() : { ...book };

  if (bookObj.userId && isSameId(bookObj.userId, userId)) {
    return bookObj;
  }

  const member = Array.isArray(bookObj.members)
    ? bookObj.members.find((m) => isSameId(m.userId, userId))
    : null;

  if (member) {
    return {
      ...bookObj,
      userId,
      status: member.status,
      rating: member.rating,
      review: member.review,
      _memberId: member._id,
      memberAddedAt: member.addedAt,
    };
  }

  return bookObj;
};

const seedSampleBooks = async () => {
  const sampleBooks = [
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Adventure / Fiction",
      coverUrl: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
      status: "want",
      rating: 0,
      review: "An inspiring journey of self-discovery and following your dreams.",
      userId: null,
      isbn: "9780061122415",
      publisher: "HarperOne",
      publicationDate: new Date("1988-01-01"),
      language: "English",
      pageCount: 197,
      stockQuantity: 5,
      shelfLocation: "A-1",
      availabilityStatus: "active",
      description: "Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery, The Alchemist has become a modern classic, selling millions of copies around the world and transforming the lives of countless readers across generations."
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help / Productivity",
      coverUrl: "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg",
      status: "want",
      rating: 0,
      review: "Practical framework for building good habits and breaking bad ones.",
      userId: null,
      isbn: "9780735211292",
      publisher: "Avery",
      publicationDate: new Date("2018-10-16"),
      language: "English",
      pageCount: 320,
      stockQuantity: 12,
      shelfLocation: "A-2",
      availabilityStatus: "active",
      description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day."
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
      status: "reading",
      rating: 0,
      review: "Witty commentary on social class and romance.",
      userId: null,
      isbn: "9780141439518",
      publisher: "Penguin Classics",
      publicationDate: new Date("1813-01-28"),
      language: "English",
      pageCount: 432,
      stockQuantity: 3,
      shelfLocation: "B-1",
      availabilityStatus: "active",
      description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language."
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
      status: "reading",
      rating: 0,
      review: "A chilling warning about totalitarianism and surveillance.",
      userId: null,
      isbn: "9780451524935",
      publisher: "Signet Classic",
      publicationDate: new Date("1949-06-08"),
      language: "English",
      pageCount: 328,
      stockQuantity: 8,
      shelfLocation: "B-2",
      availabilityStatus: "active",
      description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real."
    },
    {
      title: "The Hobbit",
      author: "J. R. R. Tolkien",
      genre: "Epic Fantasy",
      coverUrl: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
      status: "finished",
      rating: 5,
      review: "A timeless masterpiece of adventure, courage, and world-building.",
      userId: null,
      isbn: "9780547928227",
      publisher: "Houghton Mifflin",
      publicationDate: new Date("1937-09-21"),
      language: "English",
      pageCount: 300,
      stockQuantity: 4,
      shelfLocation: "C-1",
      availabilityStatus: "active",
      description: "A great modern classic and the prelude to The Lord of the Rings."
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Classic Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
      status: "finished",
      rating: 5,
      review: "Deeply moving exploration of justice, empathy, and moral growth.",
      userId: null,
      isbn: "9780060935467",
      publisher: "Harper Perennial",
      publicationDate: new Date("1960-07-11"),
      language: "English",
      pageCount: 336,
      stockQuantity: 6,
      shelfLocation: "C-2",
      availabilityStatus: "active",
      description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it."
    },
  ];

  for (const sample of sampleBooks) {
    try {
      // Fix broken URLs in any existing copies (both library and user shelves)
      await bookModel.updateMany(
        { title: sample.title },
        { $set: { coverUrl: sample.coverUrl } }
      );

      await bookModel.findOneAndUpdate(
        { title: sample.title, author: sample.author, userId: sample.userId },
        { $set: sample },
        { upsert: true, collation: { locale: 'en', strength: 2 } }
      );
    } catch (err) {
      console.error('Error ensuring sample book:', sample.title, err.message);
    }
  }
};

const getUsersOverview = async (req, res) => {
  try {
    await seedSampleBooks(getUserId(req));
    const users = await UserModel.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    const books = await bookModel.find().sort({ createdAt: -1 });

    const usersData = users.map((u) => {
      const userBooks = books.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return true;
        return Array.isArray(b.members) && b.members.some((m) => isSameId(m.userId, u._id));
      });

      const wantCount = userBooks.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return b.status === 'want';
        const member = b.members.find((m) => isSameId(m.userId, u._id));
        return member?.status === 'want';
      }).length;
      const readingCount = userBooks.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return b.status === 'reading';
        const member = b.members.find((m) => isSameId(m.userId, u._id));
        return member?.status === 'reading';
      }).length;
      const finishedCount = userBooks.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return b.status === 'finished';
        const member = b.members.find((m) => isSameId(m.userId, u._id));
        return member?.status === 'finished';
      }).length;

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

    const totalBooksInSystem = usersData.reduce((sum, user) => sum + user.totalBooks, 0);

    res.status(200).json({
      totalUsers: users.length,
      totalBooksInSystem,
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

    await seedSampleBooks();

    let filter;
    if (req.user?.role === 'admin') {
      filter = req.query.all === 'true' ? {} : { userId: null };
      if (req.query.status) {
        filter.status = req.query.status;
      }
    } else {
      if (req.query.status) {
        filter = {
          $or: [
            { userId, status: req.query.status },
            { members: { $elemMatch: { userId, status: req.query.status } } },
          ],
        };
      } else {
        filter = {
          $or: [
            { userId },
            { 'members.userId': userId },
          ],
        };
      }
    }

    const books = await bookModel.find(filter).sort({ createdAt: -1 });
    const result = req.user?.role === 'admin' ? books : books.map((book) => flattenBookForUser(book, userId));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
};

const getLibraryBooks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    await seedSampleBooks();
    const filter = { userId: null };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const books = await bookModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving library books', error: error.message });
  }
};

const getMyBooks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const books = await bookModel.find({
      $or: [
        { userId },
        { 'members.userId': userId },
      ],
    }).sort({ createdAt: -1 });

    const result = books.map((book) => flattenBookForUser(book, userId));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your books', error: error.message });
  }
};

const addLibraryBookToShelf = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const libraryBook = await bookModel.findOne({ _id: req.params.id, userId: null });
    if (!libraryBook) {
      return res.status(404).json({ message: 'Library book not found' });
    }

    const alreadyAdded = Array.isArray(libraryBook.members)
      && libraryBook.members.some((m) => isSameId(m.userId, userId));

    if (alreadyAdded) {
      return res.status(409).json({ message: 'You already added this book to your shelf' });
    }

    libraryBook.members.push({
      userId,
      status: 'want',
      rating: 0,
      review: '',
    });

    await libraryBook.save();
    res.status(200).json(flattenBookForUser(libraryBook, userId));
  } catch (error) {
    res.status(500).json({ message: 'Error adding book to shelf', error: error.message });
  }
};

const getCounts = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user?.role === 'admin') {
      const agg = await bookModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const counts = { want: 0, reading: 0, finished: 0 };
      agg.forEach((g) => {
        if (g._id) counts[g._id] = g.count;
      });
      return res.status(200).json(counts);
    }

    const books = await bookModel.find({
      $or: [
        { userId },
        { 'members.userId': userId },
      ],
    }).sort({ createdAt: -1 });

    const flattened = books.map((book) => flattenBookForUser(book, userId));
    const counts = { want: 0, reading: 0, finished: 0 };
    flattened.forEach((book) => {
      if (book.status && counts[book.status] !== undefined) {
        counts[book.status] += 1;
      }
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

    const filter = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : {
        _id: req.params.id,
        $or: [
          { userId },
          { userId: null },
        ],
      };

    const book = await bookModel.findOne(filter);
    if (book) {
      const response = req.user?.role === 'admin' ? book : flattenBookForUser(book, userId);
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
};

const summarizeBook = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const filter = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : {
        _id: req.params.id,
        $or: [
          { userId },
          { userId: null },
          { 'members.userId': userId },
        ],
      };

    const book = await bookModel.findOne(filter);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const summary = await generateBookSummary(book);
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating book summary:', error.message);
    res.status(500).json({ message: 'Error generating book summary', error: error.message });
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
      userId: req.user?.role === 'admin' ? null : userId,
      isbn: (req.body.isbn || '').trim(),
      subtitle: (req.body.subtitle || '').trim(),
      publisher: (req.body.publisher || '').trim(),
      publicationDate: req.body.publicationDate ? new Date(req.body.publicationDate) : null,
      language: (req.body.language || 'English').trim(),
      pageCount: req.body.pageCount ? Number(req.body.pageCount) : null,
      description: (req.body.description || '').trim(),
      stockQuantity: req.body.stockQuantity ? Number(req.body.stockQuantity) : 0,
      shelfLocation: (req.body.shelfLocation || '').trim(),
      availabilityStatus: req.body.availabilityStatus || 'active',
      reportFlagCounter: req.body.reportFlagCounter ? Number(req.body.reportFlagCounter) : 0,
      fileUrl: (req.body.fileUrl || '').trim(),
    };

    // Prevent duplicates (case-insensitive) for the same user/library
    try {
      const existing = await bookModel.findOne({ title: payload.title, author: payload.author, userId: payload.userId })
        .collation({ locale: 'en', strength: 2 });
      if (existing) {
        return res.status(409).json({ message: 'Book already exists' });
      }

      const book = await bookModel.create(payload);
      res.status(201).json(book);
    } catch (err) {
      // If unique index violation occurs, return conflict
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'Duplicate book entry' });
      }
      throw err;
    }
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

    const book = await bookModel.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (req.user?.role === 'admin') {
      const updateData = { ...req.body };
      const updatedBook = await bookModel.findOneAndUpdate(
        { _id: req.params.id },
        updateData,
        { returnDocument: 'after', new: true }
      );
      return res.json(updatedBook);
    }

    const userOwnsDoc = book.userId && isSameId(book.userId, userId);
    const member = Array.isArray(book.members)
      ? book.members.find((m) => isSameId(m.userId, userId))
      : null;

    if (userOwnsDoc) {
      const updateData = { ...req.body, userId };
      const updatedBook = await bookModel.findOneAndUpdate(
        { _id: req.params.id, userId },
        updateData,
        { returnDocument: 'after', new: true }
      );
      return res.json(updatedBook);
    }

    if (member) {
      if (req.body.status) member.status = req.body.status;
      if (req.body.rating !== undefined) member.rating = req.body.rating;
      if (req.body.review !== undefined) member.review = req.body.review;
      await book.save();
      return res.json(flattenBookForUser(book, userId));
    }

    return res.status(404).json({ error: 'Book not found' });
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

    if (req.user?.role === 'admin') {
      const deleted = await bookModel.findOneAndDelete({ _id: req.params.id });
      if (!deleted) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.status(204).end();
    }

    const book = await bookModel.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const userOwnsDoc = book.userId && isSameId(book.userId, userId);
    if (userOwnsDoc) {
      const deleted = await bookModel.findOneAndDelete({ _id: req.params.id, userId });
      if (!deleted) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.status(204).end();
    }

    const member = Array.isArray(book.members)
      ? book.members.find((m) => isSameId(m.userId, userId))
      : null;

    if (member) {
      book.members = book.members.filter((m) => !isSameId(m.userId, userId));
      await book.save();
      return res.status(204).end();
    }

    return res.status(404).json({ error: 'Book not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};


module.exports = {
  getBooks: getAllBooks,
  getAllBooks,
  getLibraryBooks,
  getMyBooks,
  addLibraryBookToShelf,
  getCounts,
  getUsersOverview,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  summarizeBook,
};


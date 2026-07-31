const UserModel = require('../models/UserModal');
const bookModel = require('../models/bookModel');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

// Get users overview with reading activity
const getUsersOverview = async (req, res) => {
  try {
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

module.exports = {
  getAllUsers,
  getUserProfile,
  getUsersOverview,
};

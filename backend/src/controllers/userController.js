const UserModel = require('../models/UserModal');
const bookModel = require('../models/bookModel');
const bcrypt = require('bcryptjs');

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

// Update the current user's password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};

// Get users overview with reading activity
const getUsersOverview = async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    const books = await bookModel.find().sort({ createdAt: -1 });

    const usersData = users.map((u) => {
      const userBooks = books.filter((b) => String(b.userId) === String(u._id));
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

module.exports = {
  getAllUsers,
  getUserProfile,
  updatePassword,
  getUsersOverview,
};

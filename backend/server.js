require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const booksRoutes = require('./src/routes/booksRoutes');
const AuthRoutes = require('./src/routes/AuthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const verifyToken = require('./src/middlewares/VerifyToken');

const passport = require('passport');
require('./src/config/passport');

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Express Server is running');
});

app.use('/auth', AuthRoutes);
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);
app.use('/api/books', verifyToken, booksRoutes);
app.use('/books', verifyToken, booksRoutes);


const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express Server is running on port ${PORT}`);
  });
}

module.exports = app;
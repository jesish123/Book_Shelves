const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/booksRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/books', booksRoutes);
app.use('/books', booksRoutes);

app.get('/', (req, res) => {
  res.send('Book API is running');
});

module.exports = app;

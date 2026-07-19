const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const taskRoutes = require('./src/routes/taskRoutes');
const booksRoutes = require('./src/routes/booksRoutes');

app.get('/', (req, res) => {
  res.send('Express Server is running');
});

app.use('/api/tasks', taskRoutes);
app.use('/api/books', booksRoutes);
app.use('/books', booksRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express Server is running on port ${PORT}`);
  });
}

module.exports = app;
const connectDB = require('../src/config/db');
const Book = require('../src/models/bookModel');

(async () => {
  try {
    await connectDB();
    const books = await Book.find().sort({ createdAt: -1 });
    console.log(JSON.stringify(books, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error listing books:', err);
    process.exit(1);
  }
})();
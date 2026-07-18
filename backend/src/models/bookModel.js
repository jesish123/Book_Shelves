const books = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX329_BO1,204,203,200_.jpg',
    status: 'Completed',
    rating: 5,
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL._SX327_BO1,204,203,200_.jpg',
    status: 'Want to Read',
    rating: 0,
  },
];

let nextId = books.length + 1;

function getAllBooks() {
  return books;
}

function getBookById(id) {
  return books.find((book) => book.id === Number(id));
}

function createBook(data) {
  const book = {
    id: nextId++,
    title: data.title,
    author: data.author,
    cover: data.cover || '',
    status: data.status,
    rating: Number.isFinite(Number(data.rating)) ? Number(data.rating) : 0,
  };

  books.push(book);
  return book;
}

function updateBook(id, data) {
  const book = getBookById(id);
  if (!book) {
    return null;
  }

  book.title = data.title ?? book.title;
  book.author = data.author ?? book.author;
  book.cover = data.cover ?? book.cover;
  book.status = data.status ?? book.status;
  book.rating = Number.isFinite(Number(data.rating)) ? Number(data.rating) : book.rating;

  return book;
}

function deleteBook(id) {
  const index = books.findIndex((book) => book.id === Number(id));
  if (index === -1) {
    return false;
  }

  books.splice(index, 1);
  return true;
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};

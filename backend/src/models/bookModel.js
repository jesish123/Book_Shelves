const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      default: '',
      trim: true,
    },
    coverUrl: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ['want', 'reading', 'finished'],
      default: 'want',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      default: '',
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    isbn: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '', trim: true },
    publisher: { type: String, default: '', trim: true },
    publicationDate: { type: Date, default: null },
    language: { type: String, default: 'English', trim: true },
    pageCount: { type: Number, default: null },
    description: { type: String, default: '', trim: true },
    stockQuantity: { type: Number, default: 0 },
    shelfLocation: { type: String, default: '', trim: true },
    availabilityStatus: { 
      type: String, 
      enum: ['active', 'out of stock', 'archived', 'pending'], 
      default: 'active' 
    },
    reportFlagCounter: { type: Number, default: 0 },
    fileUrl: { type: String, default: '', trim: true },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          required: true,
          trim: true,
          enum: ['want', 'reading', 'finished'],
          default: 'want',
        },
        rating: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
        review: {
          type: String,
          default: '',
          trim: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate (title, author, userId) entries.
// This enforces uniqueness for library books (userId null) and per-user copies.
bookSchema.index({ title: 1, author: 1, userId: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

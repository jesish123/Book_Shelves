const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads/books');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // allow pdf and epub
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/epub+zip') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and EPUB files are allowed!'), false);
    }
  }
});
const controller = require('../controllers/bookController');
const verifyToken = require('../middlewares/VerifyToken');

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

router.use(verifyToken);

router.get('/admin/users-overview', requireAdmin, controller.getUsersOverview);
router.get('/library', controller.getLibraryBooks);
router.get('/mine', controller.getMyBooks);
router.get('/', controller.getAllBooks);
router.get('/counts', controller.getCounts);
router.get('/:id', controller.getBookById);

router.post('/upload', requireAdmin, upload.single('bookFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/books/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

router.post('/:id/summarize', controller.summarizeBook);
router.post('/', controller.createBook);
router.post('/:id/add-to-shelf', controller.addLibraryBookToShelf);
router.put('/:id', controller.updateBook);
router.patch('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;

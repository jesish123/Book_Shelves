const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

// list books, optional ?status=want|reading|finished
router.get('/', controller.getAllBooks);

// counts per status
router.get('/counts', controller.getCounts);

router.get('/:id', controller.getBookById);
router.post('/', controller.createBook);
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;
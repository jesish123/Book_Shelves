const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');
const verifyToken = require('../middlewares/VerifyToken');

router.use(verifyToken);

router.get('/admin/users-overview', controller.getUsersOverview);
router.get('/', controller.getAllBooks);
router.get('/counts', controller.getCounts);
router.get('/:id', controller.getBookById);
router.post('/', controller.createBook);
router.put('/:id', controller.updateBook);
router.patch('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;
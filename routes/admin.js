const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const { ensureAdmin } = require('../middleware/auth');

// multer setup - store uploads in public/uploads
const upload = multer({ dest: path.join(__dirname, '../public/uploads') });

// admin auth
router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// admin dashboard
router.get('/dashboard', ensureAdmin, productController.adminList);
router.get('/add-product', ensureAdmin, productController.showAddForm);
router.post('/add-product', ensureAdmin, upload.single('image'), productController.addProduct);
router.post('/delete/:id', ensureAdmin, productController.deleteProduct);
router.get('/edit/:id', ensureAdmin, productController.showEditForm);
router.post('/edit/:id', ensureAdmin, upload.single('image'), productController.updateProduct);

module.exports = router;

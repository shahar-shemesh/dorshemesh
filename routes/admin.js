const isAuth = require('../middleware/is-auth');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


// /admin => GET
router.get('/', adminController.getLogin);


// /admin/login => POST
router.post('/login', adminController.postLogin);


// /admin/signup => GET
router.get('/signup', adminController.getSignup);

// /admin/signup => POST
router.post('/signup', adminController.postSignup);


// /admin/logout => POST
router.post('/logout', adminController.postLogout);


// // /admin/add-product => GET
// router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET
// router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
// router.post('/add-product', isAuth, adminController.postAddProduct);

// router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// router.post('/edit-product', isAuth, adminController.postEditProduct);

// router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;

const isAuth = require('../middleware/is-auth');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();



// /admin/login => GET
router.get('/', adminController.getLogin);


// /admin/login => POST
router.post('/login', adminController.postLogin);


// /admin/signup => GET
router.get('/signup', isAuth, adminController.getSignup);


// /admin/signup => POST
router.post('/signup', isAuth, adminController.postSignup);



// /admin/logout => POST
router.post('/logout', isAuth, adminController.postLogout);



// /admin/mode => GET
router.get('/mode', isAuth, adminController.getMode);



// /admin/edit-page-content => POST
router.post('/edit-page-content', isAuth, adminController.postEditPageContent);


// /admin/edit-project => POST
router.post('/edit-project', isAuth, adminController.postEditProject);


// /admin/new-project => GET
router.get('/new-project', isAuth, adminController.getAddNewProject);


// /admin/add-new-project => POST
router.post('/add-new-project', isAuth, adminController.postAddNewProject);


// /admin/update-project-image => POST
// router.post('/update-project-image', isAuth, adminController.postUpdateProjectImage);

// /admin/delete-or-archive-project => POST
router.post('/delete-or-archive-project', isAuth, adminController.postDeleteArchiveProject);


// /admin/reorder-gallery => POST
router.post('/reorder-gallery', isAuth, adminController.postReorderGallery);


module.exports = router;





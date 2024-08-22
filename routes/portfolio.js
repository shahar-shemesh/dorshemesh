const express = require('express');

/* --------------------- Controllers --------------------- */
const portfolioController = require('../controllers/portfolio');
/* ------------------------------------------------------- */

const router = express.Router();

// http://dorshemesh.com/ => GET
router.get('/', portfolioController.getIndex);

// http://dorshemesh.com/about => GET
router.get("/about", portfolioController.getAbout);

// http://dorshemesh.com/contact => GET
router.get("/contact", portfolioController.getContact);

// http://dorshemesh.com/:projectName => GET
router.get("/:kebabName", portfolioController.getProject);

module.exports = router;

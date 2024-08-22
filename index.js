require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require("mongoose");

/* --------------------- Controllers --------------------- */
const portfolioController = require('./controllers/portfolio');
const adminController = require('./controllers/admin');
/* ------------------------------------------------------- */


const app = express();

// Configure Sass middleware to compile SCSS files
app.use(sassMiddleware({
    src: path.join(__dirname, 'css'), // Path to your SCSS files
    dest: path.join(__dirname, '/public'), // Compiled CSS destination
    debug: true,
    outputStyle: 'compressed', // Output style: 'compressed' or 'expanded'
}));

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));   // allow to get data from the client. Parsing URL-encoded bodies in the HTTP requests.
app.set('view engine', 'ejs');
app.set('views', './views');

const portfolioRoutes = require('./routes/portfolio');


// Connect to the MongoDB database
mongoose.connect('mongodb+srv://dorshem:' + process.env.PASS + '@dorshemeshcluster0.gxbxrux.mongodb.net/dorDB', { useNewUrlParser: true }).then(function () {
    console.log("Connected to DB.");
}).catch(function (err) {
    console.log(err);
});


// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String
// });
// const User = new mongoose.model("User", userSchema);


/* --------------------- Define Routes --------------------- */
//app.use('/admin', adminRoutes);
app.use(portfolioRoutes);
/* ------------------------------------------------------- */


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
});



require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require("mongoose");

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { csrfSync } = require('csrf-sync');


/* --------------------- Controllers --------------------- */
const portfolioController = require('./controllers/portfolio');
const adminController = require('./controllers/admin');
/* ------------------------------------------------------- */


/* --------------------- Routes --------------------- */
const portfolioRoutes = require('./routes/portfolio');
const adminRoutes = require('./routes/admin');
/* ------------------------------------------------------- */


/* --------------------- Models --------------------- */
const User = require('./models/user');
/* ------------------------------------------------------- */


const MONGODB_URI = 'mongodb+srv://dorshem:' + process.env.PASS + '@dorshemeshcluster0.gxbxrux.mongodb.net/dorDB'

const app = express();


const store = new MongoDBStore({      // הגדרת חנות הסשנים ב-MongoDB
    uri: MONGODB_URI,                   // כתובת החיבור ל-MongoDB
    collection: 'sessions'              // שם הקולקשיין לאחסון הסשנים
});


// Configure Sass middleware to compile SCSS files
app.use(sassMiddleware({
    src: path.join(__dirname, 'css'), // Path to your SCSS files
    dest: path.join(__dirname, '/public'), // Compiled CSS destination
    debug: true,
    outputStyle: 'compressed', // Output style: 'compressed' or 'expanded'
}));

// app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));   // allow to get data from the client. Parsing URL-encoded bodies in the HTTP requests.
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({                  // הגדרת הסשן
    secret: 'my secret',             // מחרוזת סודית המשמשת לחתום את המזהה של הסשן בעוגייה
    resave: false,                   // קובע האם לשמור את הסשן בכל בקשה, אפילו אם לא היה שינוי במידע. עדיף להגדיר שקר כדי לשפר ביצועים
    saveUninitialized: false,        // קובע אם לשמור סשן ריק. הגדרה לשקר תבטיח שלא יישמר סשן ללא צורך
    store: store,                    // שימוש בחנות הסשנים שהגדרנו
}));





app.use((req, res, next) => {
    if (!req.session.user) {
        return next();                     // אם אין סשן, עוברים לפונקציה(מידלוור) הבאה
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});


const { csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: (req) => {                   // Used to retrieve the token submitted by the user in a form
        return req.body["_csrf"];
    },
});
app.use(csrfSynchronisedProtection);                // הגדרת אמצעי הגנה ל-CSRF דרך ה-session



app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = generateToken(req);
    res.locals.csrfToken = req.csrfToken();
    next();
});








// // Connect to the MongoDB database
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(function () {
//     console.log("Connected to DB.");
// }).catch(function (err) {
//     console.log(err);
// });




/* --------------------- Middlewares --------------------- */
app.use('/admin', adminRoutes);
app.use(portfolioRoutes);
/* ------------------------------------------------------- */







main().catch(err => console.log(err));


async function main() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(MONGODB_URI);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("connected to mongoDB");

        const PORT = 4000;
        app.listen(PORT, () => {
            console.log(`API listening on PORT ${PORT} `)
        });


    } catch {
        console.log("err");
    }

}

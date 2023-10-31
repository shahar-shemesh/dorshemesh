require('dotenv').config();                         // using Environment Variables

const express = require("express"); 	        	// popular web framework for Node.js.
const bodyParser = require("body-parser");	        // a middleware used to parse the request body in HTTP requests.
const ejs = require("ejs");				            // ejs module is a templating engine for JavaScript.
const mongoose = require("mongoose");               /* { Mongoose allow to define schemas to specify the structure of data and create
                                                        models based on those schemas. Models allow to interact with the database, perform CRUD
                                                        operations (Create, Read, Update, Delete), and define relationships between different collections
                                                        (known as models in Mongoose). Moongose have features to connect to a MongoDB database,
                                                        define schemas, create models, and perform database operations. } */
//const request = require("request");		        // a simplified HTTP client used for making HTTP requests.
const _ = require("lodash"); 			            // lowercase to uppercase or the opposite, and provides utility functions for JavaScript.

const app = express();	                            // Creating an instance of the Express application.
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
});

app.use(express.static("public"));                  // for public files like css & images etc. Serving static files from the "public" directory.

app.use(bodyParser.urlencoded({ extended: true }));   // allow to get data from the client. Parsing URL-encoded bodies in the HTTP requests.

app.set('view engine', 'ejs');                      /* View engines allow us to render web pages using template files. Setting the view engine to EJS
                                                       (EJS=Embedded JavaScript) for rendering dynamic web pages. */

// mongoose.connect("mongodb://127.0.0.1:27017/dorDB"); // connected to DB

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://dorshem:' + process.env.PASS + '@dorshemeshcluster0.gxbxrux.mongodb.net/dorDB', { useNewUrlParser: true }).then(function () {
    console.log("Connected to DB.");
}).catch(function(err) {
    console.log(err);
});

// app.listen(3000, function(){
//     console.log("Server started on port 3000");
// });




/*******************        Write Here: ↓↓        ***************/


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const pageSchema = new mongoose.Schema({
    pageName: String,
    pageContent: { type: ["integer", "string"] }
});

const projectSchema = new mongoose.Schema({
    projectName: String,
    projectDesc: String,
    images: [String]
});

const User = new mongoose.model("User", userSchema);
const Page = new mongoose.model("Page", pageSchema);
const Project = new mongoose.model("Project", projectSchema);

// const newUser = new User({
//     username: "shahar",
//     password: "123"
// });
// newUser.save();

// const newPage = new Page({
//     pageName: "about",
//     pageContent: ["Hello", "World"]
// });
// newPage.save();

// const projectPage = new Page({
//     pageName: "project",
//     pageContent: []
// });
// projectPage.save();

// const newProject = new Project({
//     projectName: "MOSH BEN-ARI",
//     projectDesc: "Cover design, for a new single by Mosh Ben Ari – a wonderful story about a journey to Sinai, Egypt",
//     images: ["https://dorshemesh.com/wp-content/uploads/2022/08/Untitled-1-1024x1024.jpg", "https://dorshemesh.com/wp-content/uploads/2022/08/18x24-Grid-Poster-Mockup-For-Branding-scaled.jpg", "https://dorshemesh.com/wp-content/uploads/prfmor-768x768.jpg", "https://dorshemesh.com/wp-content/uploads/Artboard-1-5-768x491.jpg"]
// });
// newProject.save();

// const newProject1 = new Project({
//     projectName: "ISRAELI T-SHIRTS",
//     projectDesc: "A line of colorful and typographic t-shirts from the best Israeli slang",
//     images: ["https://dorshemesh.com/wp-content/uploads/2022/08/t2768.jpg","https://dorshemesh.com/wp-content/uploads/2022/08/Untitled-1-1024x1024.jpg", "https://dorshemesh.com/wp-content/uploads/2022/08/18x24-Grid-Poster-Mockup-For-Branding-scaled.jpg", "https://dorshemesh.com/wp-content/uploads/prfmor-768x768.jpg", "https://dorshemesh.com/wp-content/uploads/Artboard-1-5-768x491.jpg"]
// });
// newProject1.save();

// const newProject11 = new Project({
//     projectName: "UNLABEL",
//     projectDesc: "Branding an American record company that gives full attention to an artist with a lot of passion and conceptual thinking",
//     images: ["https://dorshemesh.com/wp-content/uploads/Artboard-1-5-768x491.jpg", "https://dorshemesh.com/wp-content/uploads/2022/08/t2768.jpg","https://dorshemesh.com/wp-content/uploads/2022/08/Untitled-1-1024x1024.jpg", "https://dorshemesh.com/wp-content/uploads/2022/08/18x24-Grid-Poster-Mockup-For-Branding-scaled.jpg", "https://dorshemesh.com/wp-content/uploads/prfmor-768x768.jpg"]
// });
// newProject11.save();

// const newProject121 = new Project({
//     projectName: "MAZAL BEER",
//     projectDesc: "Original Israeli beer with a monstrous taste!",
//     images: ["https://dorshemesh.com/wp-content/uploads/Artboard-1-1-768x491.jpg", "https://dorshemesh.com/wp-content/uploads/Artboard-1-5-768x491.jpg", "https://dorshemesh.com/wp-content/uploads/2022/08/t2768.jpg","https://dorshemesh.com/wp-content/uploads/2022/08/Untitled-1-1024x1024.jpg", "https://dorshemesh.com/wp-content/uploads/2022/08/18x24-Grid-Poster-Mockup-For-Branding-scaled.jpg", "https://dorshemesh.com/wp-content/uploads/prfmor-768x768.jpg"]
// });
// newProject121.save();


// const toKebabCase = function(str){
//     return _.kebabCase(str);
// }
// ↓ toKebabCase == ↓ (arrow function)
const toKebabCase = (str => _.kebabCase(str));


app.get("/", function (req, res) {
    Page.findOne({ pageName: "home" })
        .then(function (page) {
            Project.find()
                .then(function (projects) {
                    res.render('home',
                        {
                            page: page,
                            projects: projects,
                            toKebabCase: toKebabCase
                        }
                    );
                })
        })
        .catch(function (err) {
            res.redirect('/');
        });
});


app.get("/about", function (req, res) {
    Page.findOne({ pageName: "about" })
        .then(function (page) {
            res.render('about', { page: page });
        })
        .catch(function (err) {
            res.redirect('/');
        });
});


app.get("/contact", function (req, res) {
    Page.findOne({ pageName: "contact" })
        .then(function (page) {
            res.render('contact', { page: page });
        })
        .catch(function (err) {
            res.redirect('/');
        });
});


app.get("/:kebabName", async (req, res) => {

    const kebabName = (req.params.kebabName);

    const page = await Page.findOne({pageName: "project"});

    Project.find()
        .then(function (allProjects) {

            let projectExist = 0;

            allProjects.forEach(project => {
                if (_.kebabCase(project.projectName) == kebabName){
                    projectExist = 1;
                    res.render('project', {page: page, project: project});
                }
            });

            if (!projectExist)
                res.redirect('/');
        })
        .catch(function (err) {
            res.redirect('/');
        });
});


module.exports = app;
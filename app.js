require('dotenv').config();                       

const express = require("express"); 	        
const bodyParser = require("body-parser");	       
const ejs = require("ejs");				            
const mongoose = require("mongoose");               

const _ = require("lodash"); 			  

const app = express();	  
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
});

app.use(express.static("public"));            

app.use(bodyParser.urlencoded({ extended: true }));   // allow to get data from the client. Parsing URL-encoded bodies in the HTTP requests.

app.set('view engine', 'ejs');                    


// Connect to the MongoDB database
mongoose.connect('mongodb+srv://dorshem:' + process.env.PASS + '@dorshemeshcluster0.gxbxrux.mongodb.net/dorDB', { useNewUrlParser: true }).then(function () {
    console.log("Connected to DB.");
}).catch(function(err) {
    console.log(err);
});


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
    mainImg: String,
    images: [String]
});

const User = new mongoose.model("User", userSchema);
const Page = new mongoose.model("Page", pageSchema);
const Project = new mongoose.model("Project", projectSchema);

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
const _ = require("lodash");


/* --------------------- Models --------------------- */
const Project = require('../models/project');
const Page = require('../models/page');
/* ------------------------------------------------------- */


// ↓ toKebabCase == ↓ (arrow function)
const toKebabCase = str => _.kebabCase(str);


exports.getIndex = async (req, res) => {
    const indexPage = await Page.findOne({ pageName: "home" });
    if (indexPage) {
        res.render('home', {
            page: indexPage,
            projects: await Project.find(),
            toKebabCase: toKebabCase
        })
    } else {
        res.redirect('/');
    };
};




exports.getAbout = (req, res) => {
    Page.findOne({ pageName: "about" })
        .then(function (page) {
            res.render('about', { page: page });
        })
        .catch(function (err) {
            res.redirect('/');
        });
};


exports.getContact = (req, res) => {
    Page.findOne({ pageName: "contact" })
        .then(function (page) {
            res.render('contact', { page: page });
        })
        .catch(function (err) {
            res.redirect('/');
        });
};


exports.getProject = async (req, res) => {
    try {
        const kebabName = req.params.kebabName;
        const page = await Page.findOne({ pageName: "project" });

        if (!page) {
            return res.redirect('/');
        }

        // Create a regex pattern to match flexible formats:
        // Replace hyphens with optional spaces or nothing, making the pattern case-insensitive
        const regexPattern = new RegExp(kebabName.split('-').join('[\\s-]*'), 'i');

        // Find the specific project directly from the database
        const projectFounded = await Project.findOne({
            projectName: { $regex: regexPattern }
        });

        if (projectFounded) {
            res.render('project', { page, project: projectFounded });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};
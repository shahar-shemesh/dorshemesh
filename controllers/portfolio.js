const _ = require("lodash");


/* --------------------- Models --------------------- */
const Project = require('../models/project');
const Page = require('../models/page');
/* ------------------------------------------------------- */


// ↓ toKebabCase == ↓ (arrow function)
const toKebabCase = (str => _.kebabCase(str));


exports.getIndex = (req, res) => {
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

    const kebabName = (req.params.kebabName);

    const page = await Page.findOne({ pageName: "project" });

    Project.find()
        .then(function (allProjects) {

            let projectExist = 0;

            allProjects.forEach(project => {
                if (_.kebabCase(project.projectName) == kebabName) {
                    projectExist = 1;
                    res.render('project', { page: page, project: project });
                }
            });

            if (!projectExist)
                res.redirect('/');
        })
        .catch(function (err) {
            res.redirect('/');
        });
};


const _ = require("lodash");
const bcrypt = require('bcryptjs');


/* --------------------- Models --------------------- */
const Project = require('../models/project');
const Page = require('../models/page');
const User = require('../models/user');
/* -------------------------------------------------- */

/* --------------------- Controllers --------------------- */
const portfolioController = require('../controllers/portfolio');
/* ------------------------------------------------------- */



exports.getLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.render('base', {
            content: 'admin/login',
            page: { pageName: "home" },
            path: '/admin'
        });
    }
    else {
        return res.redirect('/');
    }

};


exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.editing = true;
            req.session.user = user;
            await req.session.save();
            return res.redirect('/');
        } else {
            return res.redirect('/admin');
        }

    } catch (error) {
        console.log(error)
    }
};



exports.getMode = async (req, res, next) => {
    const editing = req.query.editing;

    req.session.editing = await (editing?.toLowerCase?.() === 'true');

    return res.redirect(req.get('Referer') || '/');
};




exports.getSignup = (req, res, next) => {
    res.render('base', {
        page: { pageName: "home" },
        content: 'admin/signup',
        pageTitle: 'Signup',
        path: '/admin/signup',
    });
};


exports.postSignup = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    try {
        const userDoc = await User.findOne({ email: email });
        if (userDoc) {
            return res.redirect('/admin');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/');

    } catch (error) {
        console.log(error)
    }
};




exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) { console.log(err) }
        res.redirect('/');
    });
};



exports.postEditPageContent = async (req, res, next) => {
    // const currentPage = req.body.page;
    // const updatedContent = req.body.content;

    // const page = await Page.findOne({ pageName: currentPage });
    // try {
    //     page.pageContent = updatedContent;
    //     await page.save();
    //     res.redirect('/' + currentPage);
    // } catch (error) {
    //     console.log(error);
    // }

    const currentPage = req.body.page;
    var updatedContent;

    switch (currentPage) {
        case 'home':
            updatedContent = req.body.content;
            break;

        case 'contact':
            const platforms = req.body.platform; // Array of platform names
            const links = req.body.link; // Array of platform links
            updatedContent = platforms.map((platform, index) => {
                return {
                    platform: platform,
                    link: links[index]
                };
            });
            break;

        default:
            break;
    }


    const page = await Page.findOne({ pageName: currentPage });
    try {
        page.pageContent = updatedContent;
        await page.save();
        res.redirect('/' + currentPage);
    } catch (error) {
        console.log(error);
    }
};


exports.postEditProject = async (req, res, next) => {
    const projectId = JSON.parse(req.body.projectId);
    const updatedContent = {
        projectName: req.body.projectName,
        projectDesc: req.body.projectDesc
    };

    const project = await Project.findById(projectId);
    try {
        project.projectName = updatedContent.projectName;
        project.projectDesc = updatedContent.projectDesc;
        await project.save();
        const newProjectPath = portfolioController.toKebabCase(updatedContent.projectName);
        res.redirect('/' + newProjectPath);
    } catch (error) {
        console.log(error);
    }
};



exports.getAddNewProject = (req, res, next) => {
    res.render('base', {
        page: { pageName: "project" },
        content: 'admin/add-project/index',
        pageTitle: 'Add a New Project',
        path: '/admin/new-project',
    });
};


exports.postAddNewProject = async (req, res, next) => {
    const { projectName, projectDesc, mainImg, images } = req.body;

    try {
        const projectExist = await Project.findOne({ projectName: projectName });
        if (projectExist) {
            return res.redirect('/admin');
        }
        const project = new Project({
            projectName: projectName,
            projectDesc: projectDesc,
            mainImg: mainImg,
            images: [...images]
        });
        await project.save();
        res.redirect('/');

    } catch (error) {
        console.log(error)
    }
};

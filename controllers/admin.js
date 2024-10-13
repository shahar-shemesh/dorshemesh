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
    // const updatedContent = {
    //     projectName: req.body.projectName,
    //     projectDesc: req.body.projectDesc
    // };
    const updatedContent = {
        projectName: req.body.projectName,
        projectDesc: req.body.projectDesc,
        mainImg: req.body.mainImg,
        images: req.body.images
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




exports.postUpdateProjectImage = async (req, res, next) => {
    const projectId = JSON.parse(req.body.projectId);
    const { imageOrder, image } = req.body;

    const project = await Project.findById(projectId);
    try {
        project.images[imageOrder] = image;
        await project.save();
        res.redirect('/');
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
            images: images
        });
        await project.save();
        res.redirect('/');

    } catch (error) {
        console.log(error)
    }
};

exports.postDeleteArchiveProject = async (req, res, next) => {
    const projectId = JSON.parse(req.body.projectId);
    const operation = req.body.trash;

    switch (operation) {
        case 'archive':
            const project = await Project.findById(projectId);
            try {
                if (project.archive){
                    project.archive = false;
                } else {
                    project.archive = true;
                }
                await project.save();
                res.redirect('/');
            } catch (error) {
                console.log(error);
            }
            break;

        case 'delete':
            await Project.findByIdAndDelete(projectId);
            res.redirect('/');
            break;
        default:
            break;
    }
};





exports.postReorderGallery = async (req, res) => {
    try {
        const newOrder = JSON.parse(req.body.order);  // Parse the new order from the form input

        // Loop through the new order array and update each project's order in the database
        await Promise.all(newOrder.map((projectId, index) => {
            return Project.updateOne({ _id: projectId }, { order: index });
        }));

        // Redirect or send a success message
        res.redirect('/admin');  // Redirect to another page, or render a success page
    } catch (err) {
        console.error('Error updating gallery order:', err);
        res.status(500).send('Error updating gallery order');
    }
};




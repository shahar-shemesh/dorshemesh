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
            req.session.editing = false;
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


//document.getElementById('home-content').innerText

exports.postEditPageContent = async (req, res, next) => {
    const currentPage = req.body.page;
    const updatedContent = req.body.content;

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
    const currentPage = req.body.page;
    const updatedContent = req.body.content;

    const page = await Page.findOne({ pageName: currentPage });
    try {
        page.pageContent = updatedContent;
        await page.save();
        res.redirect('/' + currentPage);
    } catch (error) {
        console.log(error);
    }
};







// exports.getAdminDashboard = (req, res, next) => {
//     // שמירה על הלוגיקה והדאטה המקוריים
//     portfolioController.getIndex(req, {
//       ...res, // מפעילים את אותו response
//       render: (view, options) => {
//         // החלפה של ה-view
//         res.render('base', {
//           ...options, // שמירה על כל שאר האפשרויות המקוריות
//           content: 'pages/home/index',
//           pageTitle: 'Admin - Home',
//           path: '/admin'
//         });
//       },
//     }, next);
//   };



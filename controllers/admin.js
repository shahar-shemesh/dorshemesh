const _ = require("lodash");


/* --------------------- Models --------------------- */
const Project = require('../models/project');
const Page = require('../models/page');
/* ------------------------------------------------------- */



const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('admin/login', {
        pageTitle: 'ADMIN Login',
        path: '/'
    });
};


exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
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



exports.getSignup = (req, res, next) => {
    res.render('admin/signup', {
        pageTitle: 'Signup',
        isAuthenticated: false,
        path: '/signup',
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
            password: hashedPassword,
            cart: { items: [] }
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



module.exports = (req, res, next) => {
    res.locals.basePath = (req.session.isLoggedIn && !req.session.guestMode) ? '/admin' : '';
    next();
};
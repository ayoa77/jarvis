function requireLogin(req, res, next) {
    if (!req.user) {
        req.session.reset();
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = requireLogin;
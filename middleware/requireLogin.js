function requireLogin(req, res, next) {
    if (!req.user) {
        req.session.destroy();
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = requireLogin;
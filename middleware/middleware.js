const jwt = require('jsonwebtoken');

const authStatus = (req, res, next) => {

    const token = req.cookies.jwt;

    // check web token
    if (token) {
        jwt.verify(token, 'Keezy Taught Me', (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

module.exports = { authStatus };
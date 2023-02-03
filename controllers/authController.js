const User = require('../models/User');
const jwt = require('jsonwebtoken');


//error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password:''};

    // wrong email
    if (err.message === 'Email not registered.' ) {
        errors.email = 'That email is not registered.'
    };

    // wrong password 
    if (err.message === 'Incorrect Password.') {
        errors.password = 'That password is not registered.'
    };

    // dup error code
    if (err.code === 11000) {
        errors.email = 'This email already registered to a user.'
    }

    // validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// tokens
const maxAge = 7 * 24 * 60 * 60;
const createTokens = (id) => {
    return jwt.sign({ id }, 'Keezy Taught Me', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

   try {
    const user = await User.create({ email, password });
    const token = createTokens(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({user: user._id});
   } 
   catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });

   }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = createTokens(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(222).json({user: user._id});
    } catch (err) {
       const errors = handleErrors(err);
        res.status(400).json({ errors }); 
       
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt','', {maxAge: 1});
    res.redirect('/');
}
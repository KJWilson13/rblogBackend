const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email address.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password.'],
        minlength: [5, 'The minimum password length is 5 characters.']
    },
});

// function after document saved to DB
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// function before doc to DB
userSchema.pre('save', function (next) {
   console.log('user about to be created', this);
    next();
})

// login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        // compares inputted password with hashed password in DB
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password.')
    }
    throw Error('Email not registered.')
}


const User = mongoose.model('user', userSchema);

module.exports = User;
const User = require('../models/user');
const Item = require('../models/item'); 
const bcrypt = require('bcryptjs');

exports.getSignupForm = (req, res) => {
    res.render('users/new');
};

exports.signup = async (req, res) => {
    try {
        // Pass the raw password; `pre('save')` middleware will hash it
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        req.session.user = newUser;
        req.flash('success', 'Signup successful! Welcome to Style Haven.');
        res.redirect('/users/profile');
    } catch (error) {
        console.error('Error during signup:', error);
        req.flash('error', 'Error creating user, please try again.');
        res.status(500).redirect('/users/signup');
    }
};



exports.getLoginForm = (req, res) => {
    res.render('users/login');
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                req.session.user = user;
                req.flash('success', 'Successfully logged in.');
                res.redirect('/users/profile');
            } else {
                req.flash('error', 'Invalid email or password.');
                res.redirect('/users/login');
            }
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/users/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Authentication failed. Please try again.');
        res.status(500).redirect('/users/login');
    }
};


exports.getProfile = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You need to log in to view your profile.');
        return res.redirect('/users/login');
    }

    try {
        const user = await User.findById(req.session.user._id).populate('items');
        res.render('users/profile', { user });
        if (!user) {
            req.flash('error', 'User not found.');
            return res.status(404).redirect('/users/login');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        req.flash('error', 'Internal server error while fetching profile.');
        res.status(500).redirect('/users/profile');
    }
};

exports.logout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                req.flash('error', 'Failed to log out.');
                return res.redirect('/users/profile'); 
            }
            res.cookie('message', 'You have been logged out successfully', { maxAge: 3000, httpOnly: true });
            res.redirect('/');
        });
    } else {
        req.flash('error', 'No active session.');
        res.redirect('/users/login');
    }
};

//const rawPassword = '123456';
//const storedHash = '$2a$10$l/raj600dhUACbo0ttxdTupY6k.M3/E/2T6l.n6XITOTmoMkQsfSa'; // Replace with hash from the DB

//bcrypt.compare(rawPassword, storedHash, (err, result) => {
//    if (err) return console.error('Error comparing:', err);
//    console.log('Password comparison result:', result); 
//});

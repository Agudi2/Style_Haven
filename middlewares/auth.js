const Item = require('../models/item');

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in.');
        res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first.');
        res.redirect('/users/login');
    }
};

exports.isAuthor = async (req, res, next) => {
    try {
        let id = req.params.id || req.params.itemId;  // Adjust to check itemId if id is undefined

        // Add a console log to debug
        console.log(`Received id: ${id}`);

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid clothing id');
        }

        const item = await Item.findById(id).populate('seller');
        if (item) {
            if (item.seller._id.equals(req.session.user._id)) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
};


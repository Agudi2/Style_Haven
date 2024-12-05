const model = require('../models/item.js');
const User = require('../models/user.js');
const multer = require('multer');
const path = require('path'); 
const upload = multer({
    dest: path.join(__dirname, '..', 'public', 'images'),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .jpeg, .jpg and .png files are allowed!'));
    }
});

exports.index = async (req, res, next) => {
    try {
        let items = await model.find({ active: true }).sort({ price: 1 }).populate('seller');

        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.details.toLowerCase().includes(searchTerm)
            );
        }

        res.render('./cloth/index', { items });
    } catch (err) {
        console.error("Error fetching items:", err);
        next(err);
    }
};

exports.new = (req, res) => {
    res.render('cloth/new');
};


exports.create = async (req, res, next) => {
    try {
        const item = new model({
            ...req.body,
            seller: req.session.user._id
        });
        await item.save();
        res.redirect('/cloth');
    } catch (err) {
        console.error("Error creating item:", err);
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    }
};

exports.show = async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid clothing id');
        }

        const item = await model.findById(id).populate('seller');
        if (item) {
            return res.render('./cloth/show', { item });
        } else {
            throw new Error('Cannot find a clothing with id ' + id);
        }
    } catch (err) {
        console.error("Error showing item:", err);
        next(err);
    }
};

exports.edit = async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid clothing id');
        }

        const item = await model.findById(id).populate('seller');
        if (item) {
            return res.render('./cloth/edit', { item });
        } else {
            throw new Error('Cannot find a clothing with id ' + id);
        }
    } catch (err) {
        console.error("Error editing item:", err);
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid clothing id');
        }

        const item = await model.findByIdAndUpdate(id, req.body, { useFindAndModify: false, runValidators: true });
        if (item) {
            res.redirect('/cloth/' + id);
        } else {
            throw new Error('Cannot find a clothing with id ' + id);
        }
    } catch (err) {
        console.error("Error updating item:", err);
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid clothing id');
        }

        const item = await model.findByIdAndDelete(id);
        if (item) {
            await Offer.deleteMany({ item: id });
            res.redirect('/cloth');
        } else {
            throw new Error('Cannot find a clothing with id ' + id);
        }
    } catch (err) {
        console.error("Error deleting item:", err);
        next(err);
    }
};


exports.create = [
    upload.single('image'),
    async (req, res, next) => {
        try {
            const itemData = {
                title: req.body.title,
                condition: req.body.condition,
                price: req.body.price,
                details: req.body.details,
                image: req.file ? `/images/${req.file.filename}` : '',
                seller: req.session.user._id
            };

            const item = new model(itemData);
            await item.save();

            // Add item reference to the user
            const user = await User.findById(req.session.user._id);
            user.items.push(item);
            await user.save();

            req.flash('success', 'Item added successfully!');
            res.redirect('/cloth');
        } catch (err) {
            console.error("Error creating item:", err);
            if (err.name === 'ValidationError') {
                err.status = 400;
                req.flash('error', 'Validation Error: ' + err.message);
                return res.redirect('/cloth/new');
            }
            next(err);
        }
    }
];




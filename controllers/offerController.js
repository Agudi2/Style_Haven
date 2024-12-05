const Offer = require('../models/offer');
const Item = require('../models/item');
const User = require('../models/user');

exports.create = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if (!item) {
            throw new Error('Item not found');
        }
        if (item.seller.equals(req.session.user._id)) {
            throw new Error('You cannot make an offer on your own item');
        }

        const offer = new Offer({
            amount: req.body.amount,
            item: req.params.itemId,
            user: req.session.user._id
        });
        
        await offer.save();
        await Item.findByIdAndUpdate(req.params.itemId, {
            $inc: { totalOffers: 1 },
            $max: { highestOffer: req.body.amount }
        });

        res.redirect(`/cloth/${req.params.itemId}`);
    } catch (err) {
        console.error("Error making offer:", err);
        next(err);
    }
};

exports.index = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId).populate('offers');
        if (!item) {
            throw new Error('Item not found');
        }
        if (!item.seller.equals(req.session.user._id)) {
            throw new Error('Unauthorized to view offers');
        }
        
        res.render('offers/index', { item });
    } catch (err) {
        console.error("Error fetching offers:", err);
        next(err);
    }
};

exports.accept = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId).populate('offers');
        if (!item) {
            throw new Error('Item not found');
        }
        if (!item.seller.equals(req.session.user._id)) {
            throw new Error('Unauthorized to accept offers');
        }

        const offer = await Offer.findById(req.params.offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }

        offer.status = 'accepted';
        await offer.save();
        await Item.findByIdAndUpdate(req.params.itemId, {
            active: false
        });

        await Offer.updateMany({ item: req.params.itemId, _id: { $ne: req.params.offerId } }, { status: 'rejected' });
        res.redirect(`/cloth/${req.params.itemId}/offers`);
    } catch (err) {
        console.error("Error accepting offer:", err);
        next(err);
    }
};

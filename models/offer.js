const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    amount: { type: Number, required: true, min: 0.01 },
    status: { type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);

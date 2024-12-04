const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    condition: { 
      type: String, 
      required: true, 
      enum: ['new', 'used', 'good', 'fair', 'mint'] 
    },
    price: { type: Number, required: true, min: 0.01 },
    details: { type: String, required: true },
    image: { type: String, required: true }, 
    totalOffers: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    highestOffer: { type: Number, default: 0 }
});

// Ensure the model is only created once
module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);

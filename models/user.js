const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: [true, 'Email address is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    offers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }] // Add this line to reference offers
}, { timestamps: true });

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        console.log('Hash generated during save:', hash);
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', userSchema);

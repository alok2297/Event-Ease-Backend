const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    nonVegPrice: { type: Number, required: true },
    vegPrice: { type: Number, required: true }
});

const Menu = mongoose.model('VendorMenu', priceSchema);

module.exports = Menu;
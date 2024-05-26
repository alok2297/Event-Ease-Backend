const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    brandName: { type: String, required: true },
    city: { type: String, required: true },
    vendorType: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;

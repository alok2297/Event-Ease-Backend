const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    brandName: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    additionalEmail: { type: String, required: false },
    contactNumber: { type: String, required: true },
});

const info = mongoose.model('VendorInfo', infoSchema);

module.exports = info;


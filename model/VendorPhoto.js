const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  cover: { type: String },
  album: [{ type: String }]
});

const photos = mongoose.model('VendorPhoto', photoSchema);

module.exports = photos;
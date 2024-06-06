const mongoose = require('mongoose');

const banquetSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  fixedCapacity: {
    type: Number,
  },
  floatingCapacity: {
    type: Number,
  },
  rooms: {
    type: Number,
  },
  decorPrice: {
    type: Number,
  },
  roomPrice: {
    type: Number,
  },
  banquet: {
    type: String,
  },
  album: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  pricing: {
    type: String,
  },
});

const banquet = mongoose.model('VendorBanquet', banquetSchema);

module.exports = banquet;
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
  address: {
    type: String,
    required: true,
  },
  fixedCapacity: {
    type: Number,
    required: true,
  },
  floatingCapacity: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  decorPrice: {
    type: Number,
    required: true,
  },
  roomPrice: {
    type: Number,
    required: true,
  },
  banquet: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
});

const banquet = mongoose.model('VendorBanquet', banquetSchema);

module.exports = banquet;
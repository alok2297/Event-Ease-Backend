const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    bookings: [
        {
            fullName: { type: String, required: true },
            contactNumber: { type: String, required: true },
            functionDate: { type: Date, required: true },
            numberOfGuests: { type: Number, required: true },
            numberOfRooms: { type: Number, required: false },
            functionType: { type: String, required: true },
            functionTime: { type: String, required: true }
        }
    ]
});

const booking = mongoose.model('VendorBooking', bookingSchema);

module.exports = booking;

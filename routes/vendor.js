const express = require('express');
const bcrypt = require('bcryptjs');
const Vendor = require('../model/Vendor');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { brandName, city, vendorType, phoneNumber, email, password } = req.body;

    // Basic validation
    if (!brandName || !city || !vendorType || !phoneNumber || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the vendor already exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new vendor object
        const newVendor = new Vendor({
            brandName,
            city,
            vendorType,
            phoneNumber,
            email,
            password: hashedPassword
        });

        // Save the vendor to the database
        await newVendor.save();

        // Respond with success
        res.status(201).json({ message: 'Vendor registered successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if the vendor exists
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Respond with success
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
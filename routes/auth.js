const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../model/User');
const Vendor = require('../model/Vendor');
const router = express.Router();

// Register route
router.post('/register', [
  // Validation checks
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ email, password });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Signup endpoint for vendor
router.post('/signup', async (req, res) => {
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



module.exports = router;

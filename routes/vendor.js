const express = require('express');
const bcrypt = require('bcryptjs');
const Vendor = require('../model/Vendor');
const VendorInfo = require('../model/VendorInfo');
const Booking = require('../model/vendorBooking')
const Menu = require('../model/VendorMenu')
const Banquet = require('../model/VendorBanquet')
const Photos = require('../model/VendorPhoto')

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

// router.post("/uploader", upload.array('file', 10), async (req, res) => {
//     IMGUR_CLIENT_ID = "32fb92989b59acb"
//     const fileData = req.files;
//     const data = req.body;
//     const formData = new FormData();

//     files.forEach((file) => {
//         formData.append('image', file.buffer, {
//             filename: file.originalname,
//             contentType: file.mimetype
//         });
//     });
//     try {
//         const response = await fetch("https://api.imgur.com/3/image", {
//             method: 'POST',
//             headers: {
//                 Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 image: imageData,
//                 type: 'base64',
//             }),
//         })
//         console.log(response);
//     }
//     catch (e) {
//         console.log(e);
//     }
// })

router.post('/booking', async (req, res) => {
    const { email, fullName, contactNumber, functionDate, numberOfGuests, numberOfRooms, functionType, functionTime } = req.body;

    // Basic validation
    if (!email || !fullName || !contactNumber || !functionDate || !numberOfGuests || !functionType || !functionTime) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the existing booking record for the email
        let existingBooking = await Booking.findOne({ email });

        // If no booking exists for the email, create a new booking array
        if (!existingBooking) {
            existingBooking = new Booking({
                email,
                bookings: []
            });
        }

        // Create a new booking object
        const newBooking = {
            fullName,
            contactNumber,
            functionDate,
            numberOfGuests,
            numberOfRooms,
            functionType,
            functionTime
        };

        // Add the new booking to the bookings array
        existingBooking.bookings.push(newBooking);

        // Save the updated booking to the database
        await existingBooking.save();

        // Respond with success
        res.status(200).json({ message: 'Booking created successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/set-menu', async (req, res) => {
    const { email, nonVegPrice, vegPrice } = req.body;

    // Basic validation
    if (!email || !nonVegPrice || !vegPrice) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the menu exists
        const updatedMenu = await Menu.findOneAndUpdate(
            { email }, // Filter by email
            { email, nonVegPrice, vegPrice }, // Update with these values
            { new: true, upsert: true, setDefaultsOnInsert: true } // Options
        );

        // Respond with success
        res.status(201).json({ message: 'Menu created successfully', data: updatedMenu });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/set-banquet', async (req, res) => {
    const { email, name, city, address, fixedCapacity, floatingCapacity, rooms, decorPrice, roomPrice, banquet, album } = req.body;

    // Basic validation
    if (!email || !name || !city || !address || !fixedCapacity || !floatingCapacity || !rooms || !decorPrice || !roomPrice || !banquet) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the banquet exists
        const updatedBanquet = await Banquet.findOneAndUpdate(
            { email }, // Filter by email
            { name, city, address, fixedCapacity, floatingCapacity, rooms, decorPrice, roomPrice, banquet, album }, // Update with these values
            { new: true, upsert: true, setDefaultsOnInsert: true } // Options
        );

        // Respond with success
        res.status(201).json({ message: 'Banquet details saved successfully', data: updatedBanquet });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/set-info', async (req, res) => {
    const { email, brandName, contactPersonName, additionalEmail, contactNumber } = req.body;

    // Basic validation
    if (!email || !brandName || !contactPersonName || !additionalEmail || !contactNumber) {
        return res.status(400).json({ message: 'Email, brand name, contact person name, and contact number are required' });
    }

    try {
        // Check if the vendor info exists
        const existingInfo = await VendorInfo.findOneAndUpdate(
            { email }, // Filter
            { email, brandName, contactPersonName, additionalEmail, contactNumber }, // Update
            { new: true, upsert: true, setDefaultsOnInsert: true } // Options
        );

        // Respond with success
        res.status(201).json({ message: 'Vendor info saved successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/set-photos', async (req, res) => {
    const { email, cover, album } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ message: 'Email and at least one image are required' });
      }

      try {
        // Find the existing photos record for the email
        let existingPhoto = await Photos.findOne({ email });
    
        // If no photo record exists for the email, create a new photo record
        if (!existingPhoto) {
          existingPhoto = new Photos({
            email,
            cover,
            album: []
          });
        }
    
        // Update the cover image if provided
        if (cover) {
          existingPhoto.cover = cover;
        }
    
        // Add the new images to the images array
        if(album){
          existingPhoto.album.push(...album);
        }
    
        // Save the updated photo document to the database
        await existingPhoto.save();
    
        // Respond with success
        res.status(200).json({ message: 'Images added successfully', data: existingPhoto });
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
      }
});

router.post('/get-booking', async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the booking exists
        const existingBooking = await Booking.findOne({ email }).select('-_id -__v -email');
        if (!existingBooking) {
            return res.status(400).json({ message: 'No booking found' });
        }

        // Respond with success
        res.status(201).json({ data: existingBooking });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/get-prices', async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the booking exists
        const pricing = await Menu.findOne({ email }).select('-_id -__v -email');
        if (!pricing) {
            return res.status(400).json({ message: 'No data found' });
        }

        // Respond with success
        res.status(201).json({ data: pricing });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/get-info', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the vendor info by email
        const vendorInfo = await VendorInfo.findOne({ email }).select('-__v -email -_id');
        if (!vendorInfo) {
            return res.status(404).json({ message: 'Vendor information not found' });
        }

        // Respond with the vendor information
        res.status(200).json({ data: vendorInfo });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/get-banquet', async (req, res) => {
    const { email } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Fetch the banquet details by email
        const banquet = await Banquet.findOne({ email }).select('-__v -email -_id');;
        if (!banquet) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // Respond with the banquet details
        res.status(200).json(banquet);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/get-photos', async (req, res) => {
    const { email } = req.body;
  
    // Basic validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      // Fetch the photo details by email
      const photo = await Photos.findOne({ email }).select('-__v -email -_id');
      if (!photo) {
        return res.status(404).json({ message: 'Photos not found' });
      }
  
      // Respond with the photo details
      res.status(200).json(photo);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
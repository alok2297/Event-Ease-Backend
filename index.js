const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://alok:1234@cluster0.1erd75r.mongodb.net/test', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

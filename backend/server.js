const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// MODELS
// ============================================

// Service Model
const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    location: { type: String, required: true }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

// ============================================
// ROUTES
// ============================================

// GET /services - List all services (AC/Plumbing options)
app.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

// POST /book - Save a booking
app.post('/book', async (req, res) => {
    try {
        const { user, service, date, location } = req.body;

        // Validate required fields
        if (!user || !service || !date || !location) {
            return res.status(400).json({ message: 'All fields are required: user, service, date, location' });
        }

        const booking = new Booking({
            user,
            service,
            date: new Date(date),
            location
        });

        await booking.save();

        // Populate service details in response
        const populatedBooking = await Booking.findById(booking._id).populate('service');

        res.status(201).json({
            message: 'Booking created successfully',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// GET /bookings - List all bookings (bonus route)
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('service');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// ============================================
// DATABASE SEEDING
// ============================================

const seedDatabase = async () => {
    try {
        const count = await Service.countDocuments();
        if (count === 0) {
            const dummyServices = [
                {
                    name: 'AC Maintenance',
                    image: 'https://images.unsplash.com/photo-1631545308418-7c63e81f6b7e?w=400',
                    price: 2500,
                    category: 'AC'
                },
                {
                    name: 'AC Installation',
                    image: 'https://plus.unsplash.com/premium_photo-1663013675008-bd5a7898ac46?w=400',
                    price: 4000,
                    category: 'AC'
                },
                {
                    name: 'Plumbing Repair',
                    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
                    price: 1500,
                    category: 'Plumbing'
                },
                {
                    name: 'Leakage Fix',
                    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
                    price: 1200,
                    category: 'Plumbing'
                },
                {
                    name: 'Electrical Fix',
                    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
                    price: 1800,
                    category: 'Electrical'
                },
                {
                    name: 'Wiring Installation',
                    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400',
                    price: 5000,
                    category: 'Electrical'
                },
                {
                    name: 'Home Cleaning',
                    image: 'https://images.unsplash.com/photo-1581578731117-104f2a412727?w=400',
                    price: 3000,
                    category: 'Cleaning'
                },
                {
                    name: 'Sofa Cleaning',
                    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400',
                    price: 2000,
                    category: 'Cleaning'
                }
            ];

            await Service.insertMany(dummyServices);
            console.log('✅ Database seeded with dummy services');
        } else {
            console.log('📦 Services already exist, skipping seed');
        }
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    }
};

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        await seedDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 WebSync server running on port ${PORT}`);
            console.log(`📡 API Endpoints:`);
            console.log(`   GET  http://localhost:${PORT}/services`);
            console.log(`   POST http://localhost:${PORT}/book`);
            console.log(`   External Access: http://192.168.1.12:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const paymentRoutes = require('./routes/payments');

// Initialize Express
const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection - UPDATED for Mongoose 7+
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Check if database exists
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('🔧 Please ensure MongoDB is running. Start it with:');
        console.log('   Windows: net start MongoDB');
        console.log('   Mac: brew services start mongodb-community');
        console.log('   Linux: sudo systemctl start mongod');
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Final Year Project Management System API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            projects: '/api/projects',
            payments: '/api/payments'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    let dbStatusText;
    switch(dbStatus) {
        case 0: dbStatusText = 'disconnected'; break;
        case 1: dbStatusText = 'connected'; break;
        case 2: dbStatusText = 'connecting'; break;
        case 3: dbStatusText = 'disconnecting'; break;
        default: dbStatusText = 'unknown';
    }

    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStatusText
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum is 5MB.' });
    }

    // Multer file type error
    if (err.message.includes('Only image and PDF files are allowed')) {
        return res.status(400).json({ error: 'Only image and PDF files are allowed' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        success: false
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        success: false
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 API Documentation available at http://localhost:${PORT}`);
    console.log(`🌐 Frontend should be running on http://localhost:3000`);
});
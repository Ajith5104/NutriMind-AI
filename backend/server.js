const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database is now handled by middleware for Serverless compatibility

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Require Database Connection before hitting any routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Serverless DB Error:', error.message);
        res.status(500).json({ message: 'Database Connection Error', error: error.message });
    }
});

// Routes
app.use('/api/diet', require('./routes/dietRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Initialize connection on startup (for local development visibility)
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        console.log('--------------------------------------------');
        console.log('✅ NutriMind-AI Backend System Ready');
        console.log('--------------------------------------------');
    }).catch(err => {
        console.error('❌ INITIAL DB CONNECTION FAILED:', err.message);
    });
}

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;

const mongoose = require('mongoose');

// Vercel Serverless Global Cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is completely missing in your .env file.");
    }

    if (process.env.MONGO_URI.includes('<db_password>')) {
        throw new Error("You haven't replaced '<db_password>' with your actual password in your .env file!");
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Immediately fails if no connection (stops 10s timeouts)
            serverSelectionTimeoutMS: 5000, 
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log(`?? MongoDB Connected: ${mongoose.connection.host}`);
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        const errMsg = e.message.includes('ECONNREFUSED') || e.message.includes('ENOTFOUND')
            ? `MongoDB connection failed! Please check:
  1. Your MONGO_URI in .env file is correct (replace <username>, <db_password>, <cluster-url>)
  2. MongoDB Atlas Network Access: Add IP 0.0.0.0/0 to allow all connections (or Vercel IPs)
  3. MongoDB Atlas: Database user has correct permissions
  Original error: ${e.message}`
            : `MongoDB connection error: ${e.message}`;
        throw new Error(errMsg);
    }

    return cached.conn;
};

module.exports = connectDB;

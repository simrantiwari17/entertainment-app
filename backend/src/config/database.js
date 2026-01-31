/**
 * Database configuration – MongoDB connection (ES modules).
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/entertainment-app';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected ✅');
  } catch (error) {
    console.error('MongoDB connection failed ❌', error.message);
    process.exit(1);
  }
};

export default connectDB;

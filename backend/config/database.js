/**
 * 🗄️ Database Connection Configuration
 * 
 * This module handles the connection to MongoDB database.
 * It uses Mongoose ODM (Object Document Mapper) for MongoDB operations.
 * 
 * Environment Variables Required:
 * - MONGODB_URI: MongoDB connection string (development)
 * - MONGODB_URI_PROD: MongoDB connection string (production)
 */

import mongoose from 'mongoose';

/**
 * 🔌 Connect to MongoDB Database
 * 
 * Establishes a connection to the MongoDB database using the connection string
 * from environment variables. The function will retry connection if needed.
 * 
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails, the process will exit
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from environment
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log successful connection with database host information
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log connection error and exit process if database connection fails
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with error code 1 to indicate failure
  }
};

export default connectDB; 
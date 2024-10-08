import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

/**
 * Connects to MongoDB using Mongoose.
 * Ensures the connection is only established once and doesn't reconnect on subsequent calls.
 */
export const connectToDatabase = async (): Promise<void> => {
  // Check the current connection status
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB.');
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log('Connection to MongoDB is in progress.');
    return;
  }

  try {
    // Connect to MongoDB if not already connected or connecting
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`✅ User Service - MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ User Service - Database connection failed:', (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
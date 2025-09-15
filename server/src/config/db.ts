import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;          
  if (!uri) throw new Error('MONGO_URI is not set');

  try {
    await mongoose.connect(uri, { dbName: 'ShippingDB' });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error', error);
    process.exit(1);
  }
};

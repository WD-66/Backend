import mongoose from 'mongoose';

try {
  await mongoose.connect(process.env.MONGO_URI!, { dbName: 'blog' });
  console.log('MongoDB connected successfully!');
} catch (error) {
  console.log('Failed to connect to DB', error);
}

import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || '';

try {
  await mongoose.connect(MONGO_URI);
  console.log('\x1b[34mConnected to MongoDB\x1b[0m');
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(`\x1b[31mError connecting to MongoDB: ${err.message}\x1b[0m`);
  } else {
    console.error('\x1b[31mError connecting to MongoDB: Unknown error occurred\x1b[0m');
  }
  process.exit(1);
}

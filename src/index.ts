import mongoose from 'mongoose';
import { mongo_uri, port } from './settings/env';
import Server from './settings/server';

const run = async () => {
  try {
    await mongoose.connect(mongo_uri, {});
    console.log('🔌 Database connection was successful! 🔌');
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message} ❌`);
    process.exit(1);
  }

  const server = new Server();
  await server.router();
  server.listen(port);
};

run();

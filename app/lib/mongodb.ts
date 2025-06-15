// app/lib/mongodb.ts
import { MongoClient, MongoClientOptions, Db } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing MongoDB connection string.');
}

console.log('MongoDB URI found:', uri.substring(0, 20) + '...');

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// ✅ Fix environment detection
if (process.env.NEXT_PUBLIC_APP_ENV === 'development') { 
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

clientPromise
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((error) => console.error('❌ MongoDB connection failed:', error));

export default clientPromise;

export async function getDatabase(dbName?: string): Promise<Db> {
  try {
    const client = await clientPromise;
    const database = client.db(dbName || process.env.DB_NAME || 'char');
    await database.admin().ping();
    return database;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
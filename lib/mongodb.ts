
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim() || "BazarDor";

let validUri = false;
if (uri) {
  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    console.warn(
      "MONGODB_URI must start with mongodb:// or mongodb+srv://. MongoDB features are disabled."
    );
  } else {
    validUri = true;
  }
} else {
  console.warn(
    "MONGODB_URI is not configured. Authentication and database features are disabled."
  );
}

const globalForMongo = globalThis as typeof globalThis & {
  __bazardorMongoClient?: MongoClient;
};

export const mongoClient: MongoClient | null = validUri
  ? (globalForMongo.__bazardorMongoClient ??= new MongoClient(uri!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    }))
  : null;

export const mongoDb: Db | null = mongoClient
  ? mongoClient.db(databaseName)
  : null;

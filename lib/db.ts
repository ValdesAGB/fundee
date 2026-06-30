import "dotenv/config";
import { MongoClient, Db } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB_NAME || "fundee";

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

function getDbInstance(): Db {
  if (!globalForMongo._mongoDb) {
    if (!uri) {
      throw new Error(
        "Please define the DATABASE_URL environment variable inside .env",
      );
    }

    const isAtlas = uri.startsWith("mongodb+srv://");
    const useTls = process.env.MONGODB_TLS === "true" || isAtlas;

    const clientOptions: any = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    if (useTls) {
      clientOptions.tls = true;
      clientOptions.tlsAllowInvalidCertificates =
        process.env.MONGODB_TLS_ALLOW_INVALID === "true";
    }

    const client = new MongoClient(uri, clientOptions);
    client.connect().catch(console.error);

    globalForMongo._mongoClient = client;
    globalForMongo._mongoDb = client.db(dbName);
  }
  return globalForMongo._mongoDb;
}

export async function getDb(): Promise<Db> {
  return getDbInstance();
}

export async function getClient(): Promise<MongoClient> {
  getDbInstance();
  return globalForMongo._mongoClient!;
}

export async function closeConnection(): Promise<void> {
  if (globalForMongo._mongoClient) {
    await globalForMongo._mongoClient.close();
    delete globalForMongo._mongoClient;
    delete globalForMongo._mongoDb;
  }
}

// Synchronous proxy for the Db instance to support lazy module evaluation (important for Next.js builds)
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    if (prop === "then" || prop === "toJSON") return undefined;
    const actualDb = getDbInstance();
    const value = Reflect.get(actualDb, prop);
    if (typeof value === "function") {
      return value.bind(actualDb);
    }
    return value;
  },
});

// Synchronous proxy for the MongoClient instance
export const client = new Proxy({} as MongoClient, {
  get(_target, prop) {
    if (prop === "then" || prop === "toJSON") return undefined;
    getDbInstance();
    const actualClient = globalForMongo._mongoClient!;
    const value = Reflect.get(actualClient, prop);
    if (typeof value === "function") {
      return value.bind(actualClient);
    }
    return value;
  },
});

import { MongoClient, Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

const dbName = process.env.MONGODB_DB_NAME || "fundee";

const globalForMongo = globalThis as unknown as {
  client: MongoClient | undefined;
  db: Db | undefined;
};

async function connectToDatabase(): Promise<Db> {
  if (globalForMongo.db && globalForMongo.client) {
    try {
      // ✅ Vérifie que la connexion est toujours active
      await globalForMongo.client.db("admin").command({ ping: 1 });
      return globalForMongo.db;
    } catch {
      // Connexion fermée — on réinitialise
      globalForMongo.client = undefined;
      globalForMongo.db = undefined;
    }
  }

  const client = new MongoClient(uri!, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  await client.connect();

  globalForMongo.client = client;
  globalForMongo.db = client.db(dbName);

  return globalForMongo.db;
}

// ✅ Proxy qui reconnecte automatiquement si nécessaire
export const db = new Proxy({} as Db, {
  get(_, prop: string) {
    return async (...args: any[]) => {
      const database = await connectToDatabase();
      const collection = (database as any)[prop];
      if (typeof collection === "function") {
        return collection.apply(database, args);
      }
      return collection;
    };
  },
});

export async function getDb(): Promise<Db> {
  return connectToDatabase();
}

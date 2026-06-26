import 'dotenv/config';
import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB_NAME || 'fundee';

let clientPromise: Promise<MongoClient> | null = null;
let dbPromise: Promise<Db> | null = null;

function createClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env');
  }
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });
  return client.connect();
}

function getClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = createClient();
  }
  return clientPromise;
}

function getDbPromise(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = getClientPromise().then(client => client.db(dbName));
  }
  return dbPromise;
}

export async function getDb(): Promise<Db> {
  return getDbPromise();
}

export async function getClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function closeConnection(): Promise<void> {
  const client = await getClientPromise();
  return client.close();
}

function createDbProxy(): Db {
  return new Proxy({} as Db, {
    get(_target, prop) {
      if (prop === 'then' || prop === 'toJSON') return undefined;
      
      return async (...args: any[]) => {
        const db = await getDbPromise();
        const value = Reflect.get(db, prop);
        
        if (typeof value === 'function') {
          const result = value.bind(db)(...args);
          
          // If the result is a Collection, wrap it in a proxy to support chaining
          if (result instanceof Collection) {
            return createCollectionProxy(result);
          }
          
          return result;
        }
        return value;
      };
    }
  });
}

function createCollectionProxy(collection: Collection): Collection {
  return new Proxy(collection, {
    get(target, prop) {
      if (prop === 'then' || prop === 'toJSON') return undefined;
      
      const value = Reflect.get(target, prop);
      
      if (typeof value === 'function') {
        return (...args: any[]) => value.bind(target)(...args);
      }
      return value;
    }
  });
}

export const db = createDbProxy();

// Proxy for client - mainly for close()
export const client = new Proxy({} as MongoClient, {
  get(_target, prop) {
    if (prop === 'then' || prop === 'toJSON') return undefined;
    return async (...args: any[]) => {
      const client = await getClientPromise();
      const value = Reflect.get(client, prop);
      if (typeof value === 'function') {
        return value.bind(client)(...args);
      }
      return value;
    };
  }
});
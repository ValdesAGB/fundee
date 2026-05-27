import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB_NAME || 'fundee';

const globalForMongo = globalThis as unknown as {
    client: MongoClient | undefined;
    db: Db | undefined;
};

function getClient(): MongoClient {
    if (!globalForMongo.client) {
        if (!uri) {
            throw new Error('Please define the DATABASE_URL environment variable inside .env');
        }
        globalForMongo.client = new MongoClient(uri);
    }
    return globalForMongo.client;
}

function getDb(): Db {
    if (!globalForMongo.db) {
        const clientInstance = getClient();
        clientInstance.connect().catch(console.error);
        globalForMongo.db = clientInstance.db(dbName);
    }
    return globalForMongo.db;
}

// Export lazy proxies to prevent module evaluation throws during Next.js build-time static generation
export const client = new Proxy({} as MongoClient, {
    get(target, prop) {
        if (typeof prop === 'string' && (prop === 'then' || prop === 'toJSON')) {
            return undefined;
        }
        const actualClient = getClient();
        const value = Reflect.get(actualClient, prop);
        if (typeof value === 'function') {
            return value.bind(actualClient);
        }
        return value;
    }
});

export const db = new Proxy({} as Db, {
    get(target, prop) {
        if (typeof prop === 'string' && (prop === 'then' || prop === 'toJSON')) {
            return undefined;
        }
        const actualDb = getDb();
        const value = Reflect.get(actualDb, prop);
        if (typeof value === 'function') {
            return value.bind(actualDb);
        }
        return value;
    }
});
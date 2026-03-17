import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.DATABASE_URL;

if (!uri) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

const globalForMongo = globalThis as unknown as {
    client: MongoClient | undefined;
    db: Db | undefined;
};

const dbName = process.env.MONGODB_DB_NAME || 'fundee';

function getClient(): MongoClient {
    if (!globalForMongo.client) {
        globalForMongo.client = new MongoClient(uri!, {
            tls: true,
            tlsAllowInvalidCertificates: true,
        });
    }
    return globalForMongo.client;
}

export const client = getClient();

// ✅ Connexion explicite au démarrage
if (!globalForMongo.db) {
    client.connect().catch(console.error);
    globalForMongo.db = client.db(dbName);
}

export const db = globalForMongo.db;
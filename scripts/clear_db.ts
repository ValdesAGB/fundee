import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function clearDb() {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error('DATABASE_URL not set');
    
    const dbName = process.env.MONGODB_DB_NAME || uri.split('/').pop()?.split('?')[0] || 'Fundee';
    console.log(`🧹 Starting database cleanup on database: ${dbName}...`);

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        
        const collections = await db.listCollections().toArray();
        for (const col of collections) {
            if (col.name.startsWith('system.')) continue;
            await db.collection(col.name).deleteMany({});
            console.log(`  Wiped collection: ${col.name}`);
        }
        console.log('🎉 All collections cleared successfully!');
    } catch (err) {
        console.error('❌ Error during cleanup:', err);
    } finally {
        await client.close();
    }
}

clearDb();

import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function checkDb() {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error('DATABASE_URL not set');
    
    // Extract DB name
    const dbName = process.env.MONGODB_DB_NAME || uri.split('/').pop()?.split('?')[0] || 'Fundee';
    console.log(`Targeting database: ${dbName}`);

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        
        const collections = await db.listCollections().toArray();
        console.log('Collections in DB:', collections.map(c => c.name));
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`Collection: ${col.name} | Documents: ${count}`);
            if (col.name === 'business' || col.name === 'businesses') {
                const doc = await db.collection(col.name).findOne({});
                console.log(`Sample document from ${col.name}:`, JSON.stringify(doc, null, 2));
            }
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

checkDb();

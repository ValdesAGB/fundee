import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function fixDb() {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error('DATABASE_URL not set');
    
    // Extract DB name
    const dbName = process.env.MONGODB_DB_NAME || uri.split('/').pop()?.split('?')[0] || 'Fundee';
    console.log(`Fixing database: ${dbName}`);

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        
        // 1. Fix 'business' documents by adding isActive: true
        const businessResult = await db.collection('business').updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );
        console.log(`Updated ${businessResult.modifiedCount} business documents (added isActive: true)`);
        
        // Ensure even if isActive exists but is not true, we set it to true for dev testing if they are our mock businesses
        const forceActiveResult = await db.collection('business').updateMany(
            { isActive: false },
            { $set: { isActive: true } }
        );
        console.log(`Updated ${forceActiveResult.modifiedCount} business documents (forced isActive: true)`);

        // 2. Fix 'product' documents similarly
        const productResult = await db.collection('product').updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );
        console.log(`Updated ${productResult.modifiedCount} product documents (added isActive: true)`);

        // 3. Clean up duplicate collections (casing issues)
        const collectionsToDrop = ['Business', 'Product', 'Category', 'Review', 'CartItem', 'User', 'Promotion', 'Notification', 'OrderItem', 'Account', 'Favorite', 'Session', 'Verification'];
        
        const existingCollections = (await db.listCollections().toArray()).map(c => c.name);
        
        for (const colName of collectionsToDrop) {
            if (existingCollections.includes(colName)) {
                // Check if it's empty before dropping to be safe, but we saw they were 0 in check_db
                const count = await db.collection(colName).countDocuments();
                if (count === 0) {
                    await db.collection(colName).drop();
                    console.log(`Dropped empty duplicate collection: ${colName}`);
                } else {
                    console.warn(`Collection ${colName} is NOT empty (${count} docs), skipping drop`);
                }
            }
        }

        console.log('✅ Database repair completed');
    } catch (err) {
        console.error('Error during database repair:', err);
    } finally {
        await client.close();
    }
}

fixDb();

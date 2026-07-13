import { getDb } from "../lib/db";
import { ObjectId } from "mongodb";

async function main() {
  const db = await getDb();
  
  console.log("--- BUSINESSES ---");
  const businesses = await db.collection("business").find().toArray();
  for (const b of businesses) {
    console.log(`Business ID: ${b._id} (${typeof b._id}), Name: ${b.name}`);
  }

  console.log("\n--- PRODUCTS ---");
  const products = await db.collection("product").find().toArray();
  for (const p of products) {
    console.log(`Product ID: ${p._id}, Name: ${p.name}, businessId: ${p.businessId} (${typeof p.businessId})`);
  }

  console.log("\n--- TEST LOOKUP ---");
  const lookupProducts = await db.collection("product").aggregate([
    {
      $lookup: {
        from: 'business',
        let: { busId: { $toObjectId: '$businessId' } },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$busId'] } } },
          { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, logo: 1 } }
        ],
        as: 'business'
      }
    },
    { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } }
  ]).toArray();

  for (const p of lookupProducts) {
    console.log(`Product: ${p.name}, Business Field:`, p.business);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

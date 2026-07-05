import { db } from '../lib/db';

async function main() {
  const users = await db.collection("user").find({}).toArray();
  console.log("Users in DB:");
  console.log(users);

  const accounts = await db.collection("account").find({}).toArray();
  console.log("Accounts in DB:");
  console.log(accounts);

  const sessions = await db.collection("session").find({}).toArray();
  console.log("Sessions in DB:");
  console.log(sessions);
  
  process.exit(0);
}

main().catch(console.error);

import { auth } from '../lib/auth';
import { db } from '../lib/db';
import { Headers } from 'next/dist/compiled/@edge-runtime/primitives';

async function main() {
  console.log("Starting Better Auth Bearer test...");

  // 1. Get or create a test user
  let user = await db.collection("user").findOne({ email: "user@test.com" });
  if (!user) {
    console.error("Test user not found in database. Run seed first.");
    process.exit(1);
  }

  // 2. Create a session for this user
  const sessionToken = "test-token-" + Date.now();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  
  await db.collection("session").insertOne({
    token: sessionToken,
    userId: user._id.toString(),
    expiresAt: expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`Created test session in DB. Token: ${sessionToken}`);

  // 3. Test retrieving the session via auth.api.getSession with headers
  // Simulate Web API Headers object
  const webHeaders = new Headers();
  webHeaders.append("Authorization", `Bearer ${sessionToken}`);

  console.log("Calling getSession with Web API Headers object...");
  const sessionWeb = await auth.api.getSession({
    headers: webHeaders
  });

  console.log("Web API Headers result:", sessionWeb ? "SUCCESS" : "FAILED");
  if (sessionWeb) {
    console.log("User:", sessionWeb.user.email);
  }

  // 4. Test retrieving via plain object
  console.log("Calling getSession with plain object headers...");
  const sessionPlain = await auth.api.getSession({
    headers: {
      "authorization": `Bearer ${sessionToken}`
    }
  });

  console.log("Plain object result:", sessionPlain ? "SUCCESS" : "FAILED");
  
  // Clean up
  await db.collection("session").deleteOne({ token: sessionToken });
  process.exit(0);
}

main().catch(console.error);

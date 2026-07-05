import { auth } from '../lib/auth';

async function main() {
  console.log("Testing Better Auth sign-in response...");
  
  // Call the sign-in logic directly via Better Auth auth object
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: "user@test.com",
        password: "password123",
      }
    });

    console.log("Sign-in response object:");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Sign-in failed:", error);
  }
  process.exit(0);
}

main().catch(console.error);

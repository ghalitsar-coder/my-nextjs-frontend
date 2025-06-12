import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load environment variables (multiple possible locations)
dotenv.config({ path: "./.env" });
dotenv.config({ path: "./.env.local" });

async function resetAuthSchema() {
  try {
    console.log("🔗 Connecting to Neon database...");

    // Check if DATABASE_URL is available
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL not found in environment variables");
      console.log(
        "Available env vars:",
        Object.keys(process.env).filter((key) => key.includes("DATABASE"))
      );
      process.exit(1);
    }

    console.log("✅ DATABASE_URL found");
    console.log("🔗 Database URL:", databaseUrl.replace(/:[^:@]*@/, ":***@")); // Hide password

    // Create Neon connection
    const neonClient = neon(databaseUrl);
    const db = drizzle(neonClient);

    console.log("🗑️ Dropping auth schema and user_role type...");

    // Drop schema auth cascade
    await db.execute(sql`DROP SCHEMA IF EXISTS auth CASCADE;`);
    console.log("✅ Schema 'auth' dropped successfully");

    // Drop user_role type if exists (might not exist if it was in auth schema)
    try {
      await db.execute(sql`DROP TYPE IF EXISTS user_role;`);
      console.log("✅ Type 'user_role' dropped successfully");
    } catch (typeError) {
      console.log(
        "ℹ️  Type 'user_role' was likely already removed with schema"
      );
    }

    console.log("🎉 Schema reset completed!");
  } catch (error) {
    console.error("❌ Error resetting schema:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
  } finally {
    process.exit(0);
  }
}

resetAuthSchema();

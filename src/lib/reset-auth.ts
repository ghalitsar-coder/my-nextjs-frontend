import { db } from "@/db/db";
import { sql } from "drizzle-orm";

async function resetAuthSchema() {
  try {
    console.log("🗑️ Dropping auth schema and user_role type...");
    
    // Drop schema auth cascade
    await db.execute(sql`DROP SCHEMA IF EXISTS auth CASCADE;`);
    console.log("✅ Schema 'auth' dropped successfully");
    
    // Drop user_role type if exists
    await db.execute(sql`DROP TYPE IF EXISTS user_role;`);
    console.log("✅ Type 'user_role' dropped successfully");
    
    console.log("🎉 Schema reset completed!");
  } catch (error) {
    console.error("❌ Error resetting schema:", error);
  } finally {
    process.exit(0);
  }
}

resetAuthSchema();
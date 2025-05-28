import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/db";
import axios from "axios";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  onUserCreate: async (user, ctx) => {
    try {
      await axios.post(`${process.env.SPRING_BOOT_URL}/users`, {
        user_id: user.id,
        username: user.username || `user_${user.id}`,
        email: user.email,
        full_name: user.name,
        phone_number: user.phone_number || null,
        address: user.address || null,
        role: "customer",
      });
      console.log("User data sent to Spring Boot:", user.email);
    } catch (error) {
      console.error("Failed to send user data to Spring Boot:", error);
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.NEXT_AUTH_SECRET!,
});
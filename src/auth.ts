import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import axios from "axios";
import { db } from "./db/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  onUserCreate: async (user, ctx) => {
    // Kirim data pengguna ke Spring Boot
    try {
      await axios.post(`${process.env.SPRING_BOOT_URL}/users`, {
        id: user.id,
        email: user.email,
        name: user.name,
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
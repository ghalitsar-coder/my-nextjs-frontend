import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import axios from "axios";
import { db } from "@/db/db";

console.log("Auth config loaded");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "users",
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
      },
      phone_number: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
    },
  },
  onUserCreate: async (user, ctx) => {
    try {
      await axios.post(`${process.env.SPRING_BOOT_URL}/users`, {
        user_id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.name,
        phone_number: user.phone_number || null,
        address: user.address || null,
        role: user.role || "customer",
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
      redirectURI: "http://localhost:3000/api/auth/google/callback",
    },
  },
  secret: process.env.NEXT_AUTH_SECRET!,
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
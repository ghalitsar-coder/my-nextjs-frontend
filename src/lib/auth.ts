import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import axios from "axios";
import { db } from "@/db/db";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from "@/db/schema";

console.log("Auth config loaded");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      account: accountsTable,
      session: sessionsTable,
      verification: verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "user",
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
  // Tambahkan hooks/callbacks
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-up operation that created a new user
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession && newSession.user) {
          try {
            console.log("New user created, sending to Spring Boot:", newSession.user);
            
            const response = await axios.post(
              `${process.env.SPRING_BOOT_URL}/users`,
              {
                id: newSession.user.id,
                email: newSession.user.email,
                username: newSession.user.username || newSession.user.name,
                phone_number: newSession.user.phone_number || null,
                address: newSession.user.address || null,
                role: newSession.user.role || "customer",
                created_at: new Date().toISOString(),
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                timeout: 5000,
              }
            );
            
            console.log("User successfully created in Spring Boot:", response.data);
          } catch (error) {
            console.error("Failed to create user in Spring Boot:", error);
            // Continue execution even if Spring Boot sync fails
          }
        }
      }
      
      // Check for OAuth sign-up (Google)
      if (ctx.path.includes("/oauth/") && ctx.path.includes("/callback")) {
        const newSession = ctx.context.newSession;
        if (newSession && newSession.user) {
          try {
            console.log("OAuth user created, sending to Spring Boot:", newSession.user);
            
            const response = await axios.post(
              `${process.env.SPRING_BOOT_URL}/users`,
              {
                id: newSession.user.id,
                email: newSession.user.email,
                username: newSession.user.username || newSession.user.name,
                phone_number: newSession.user.phone_number || null,
                address: newSession.user.address || null,
                role: newSession.user.role || "customer",
                created_at: new Date().toISOString(),
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                timeout: 5000,
              }
            );
            
            console.log("OAuth user successfully created in Spring Boot:", response.data);
          } catch (error) {
            console.error("Failed to create OAuth user in Spring Boot:", error);
          }
        }
      }
    }),
  },
});
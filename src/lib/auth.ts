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
    requireEmailVerification: false, // Set to true if you want email verification
    
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
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
      redirectURI: "http://localhost:3000/api/auth/callback/google",
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
                fullName: newSession.user.name,
                username: newSession.user.username ,
                phoneNumber: newSession.user.phone_number || null,
                address: newSession.user.address || null,

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
      if (ctx.path.includes("/callback") && ctx.path.includes("google")) {
        const newSession = ctx.context.newSession;
        if (newSession && newSession.user) {
          try {
            console.log("OAuth user created, sending to Spring Boot:", newSession.user);
            
            const response = await axios.post(
              `${process.env.SPRING_BOOT_URL}/users-fixed`,
              {
                id: newSession.user.id,
                email: newSession.user.email,
                username: newSession.user.username || newSession.user.name || newSession.user.email.split('@')[0],
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

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
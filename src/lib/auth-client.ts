import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});

// Export individual methods for easier use
export const {
  useSession,
  signIn,
  signUp,
  signOut,
  getSession,
} = authClient;
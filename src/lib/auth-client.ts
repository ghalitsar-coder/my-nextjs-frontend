import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});
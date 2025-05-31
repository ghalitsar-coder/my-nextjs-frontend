// Manual authentication utilities
import { cookies } from "next/headers";

export interface User {
  id: number | string; // Allow both number and string
  user_id?: number; // Add user_id field for backend compatibility
  username: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  role: "customer" | "admin" | "cashier";
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

interface TokenPayload {
  userId: number | string;
  email: string;
  exp: number;
}

// JWT utilities (simple implementation)
export function createToken(payload: TokenPayload): string {
  // Simple base64 encoding for demo purposes
  // In production, use proper JWT library
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa(
    `${header}.${payloadEncoded}.${process.env.JWT_SECRET || "secret"}`
  );
  return `${header}.${payloadEncoded}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1])) as TokenPayload;

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Session management
export async function setSession(user: User): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const userId = user.user_id || user.id; // Use user_id if available, fallback to id
  const token = createToken({
    userId: userId,
    email: user.email,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    // Fetch user data from Spring Boot
    const response = await fetch(
      `${process.env.SPRING_BOOT_URL || "http://localhost:8080"}/api/users/${
        payload.userId
      }`
    );
    if (!response.ok) return null;

    const userData = await response.json();

    // Normalize user data to match our User interface
    const user: User = {
      id: userData.user_id || userData.id,
      user_id: userData.user_id,
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      address: userData.address,
      role: userData.role,
    };

    return {
      user,
      token,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch (error) {
    console.error("getSession error:", error);
    return null;
  }
}

// Simple session check for middleware (doesn't fetch from backend)
export async function getSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    return token;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

// Password hashing (simple implementation for demo)
export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  return btoa(password + (process.env.SALT || "default-salt"));
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

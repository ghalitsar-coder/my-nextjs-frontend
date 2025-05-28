"use client";

import { useState } from "react";
import { signIn } from "better-auth/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signIn("credentials", { email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
          Sign In
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleGoogleSignIn} style={{ padding: "10px 20px" }}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("/api/auth/sign-up", {
        email,
        password,
        full_name: fullName,
        username,
        phone_number: phoneNumber || null,
        address: address || null,
      });
      await axios.post("/api/auth/sign-in", { email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      window.location.href = "/api/auth/google";
    } catch (err: any) {
      setError("Google sign-up failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignUp}>
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
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Phone Number (optional)</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Address (optional)</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
          Sign Up
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleGoogleSignUp} style={{ padding: "10px 20px" }}>
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/authService";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signInWithEmail(email, password);

    if (!result.success) {
      setError(result.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#02080f",
        color: "#f5f0e5",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid #8d6a25",
          borderRadius: 10,
          padding: 32,
          background: "#031321",
        }}
      >
        <div
          style={{
            color: "#d9aa45",
            fontSize: 11,
            letterSpacing: "0.22em",
            marginBottom: 10,
          }}
        >
          VIBE CUT MEN'S SALON
        </div>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 500,
            fontSize: 32,
            margin: "0 0 8px",
          }}
        >
          ADMIN LOGIN
        </h1>

        <p style={{ color: "#999", fontSize: 13, marginBottom: 28 }}>
          Sign in to manage appointments.
        </p>

        <label style={{ display: "block", fontSize: 12, marginBottom: 7 }}>
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 18,
            background: "#020a12",
            border: "1px solid #4b4028",
            borderRadius: 5,
            color: "#fff",
          }}
        />

        <label style={{ display: "block", fontSize: 12, marginBottom: 7 }}>
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 18,
            background: "#020a12",
            border: "1px solid #4b4028",
            borderRadius: 5,
            color: "#fff",
          }}
        />

        {error && (
          <p style={{ color: "#e36b6b", fontSize: 12, marginBottom: 16 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 46,
            border: 0,
            borderRadius: 4,
            background: "#dcae46",
            color: "#090909",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "SIGNING IN..." : "SIGN IN →"}
        </button>
      </form>
    </main>
  );
}
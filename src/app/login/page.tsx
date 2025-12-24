"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      if (!accessToken) return;

      sessionStorage.setItem("google_access_token", accessToken);
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Calendar App</h1>

        <p style={styles.description}>
          Calendar App allows you to securely connect your Google Calendar and
          manage events — create, view, update, and delete calendar entries with
          ease.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <footer style={styles.footer}>
          <a href="/privacy-policy">Privacy Policy</a>
          <span>·</span>
          <a href="/terms">Terms of Service</a>
        </footer>
        <p style={styles.meta}>
          Calendar App is developed and operated by Bharti Pandit.
          <br />
          Hosted on Vercel.
        </p>
      </div>
    </main>
  );
}

/* ---------- styles ---------- */

const styles: {
  container: CSSProperties;
  card: CSSProperties;
  title: CSSProperties;
  description: CSSProperties;
  button: CSSProperties;
  footer: CSSProperties;
  meta: CSSProperties;
} = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "12px",
  },
  description: {
    fontSize: "15px",
    color: "#555",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4285F4",
    color: "#fff",
    fontWeight: 500,
  },
  footer: {
    marginTop: "24px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  meta: {
    marginTop: "16px",
    fontSize: "10px",
    color: "#666",
    textAlign: "center" as const,
    maxWidth: "420px",
  },
};

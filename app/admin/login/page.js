"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch("/api/admin/me");
        const data = await response.json();

        if (data.authenticated) {
          router.replace("/admin/enquiries");
          return;
        }
      } catch {
        // User is not logged in.
      } finally {
        setChecking(false);
      }
    }

    checkLogin();
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid username or password.");
        return;
      }

      router.replace("/admin/enquiries");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-600">
          Checking authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-500">
            Travel Unbounded
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Admin Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to manage travel enquiries.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block font-semibold text-slate-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Admin username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-semibold text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Admin password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      router.refresh();
      router.push("/");
    } catch {
      console.error("Logout failed");
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Travel <span className="text-amber-400">Unbounded</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">

          <Link
            href="/"
            className="transition hover:text-amber-400"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="transition hover:text-amber-400"
          >
            About
          </Link>

          <Link
            href="/ai-travel-agent"
            className="font-semibold text-amber-400 transition hover:text-amber-300"
          >
            AI Travel Agent
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-amber-400"
          >
            Contact
          </Link>

          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="font-semibold transition hover:text-amber-400"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full border border-amber-400 px-5 py-2.5 font-semibold text-amber-400 transition hover:bg-amber-400 hover:text-slate-950"
              >
                Create Account
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <span className="text-sm text-slate-300">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user.name}
                </span>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/30 px-5 py-2.5 font-semibold transition hover:bg-white hover:text-slate-950"
              >
                Logout
              </button>
            </>
          )}

          <Link
            href="/ai-travel-agent"
            className="rounded-full bg-amber-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Plan with AI
          </Link>

        </div>

        <Link
          href="/ai-travel-agent"
          className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 md:hidden"
        >
          Plan with AI
        </Link>
      </div>
    </nav>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await signIn.email({
        email,
        password,
        callbackURL: "/admin",
      });

      if (response?.error) {
        setError(response.error.message || "Invalid email or password");
      } else {
        localStorage.setItem("admin_logged_in", "true");
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050505] px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ff4d00]/5 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 shadow-card-soft border-white/10">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-4 leading-tight">
            <span className="text-xs font-mono tracking-[0.35em] text-white">ZABED </span>
            <span className="text-xs font-mono tracking-[0.35em] text-[#ff4d00]">MAHMUD</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-white/55">Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="zabedfolio@gmail.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-white/20 transition duration-200 focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5 focus:ring-1 focus:ring-[#ff4d00]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-white/20 transition duration-200 focus:border-[#ff4d00]/50 focus:bg-[#ff4d00]/5 focus:ring-1 focus:ring-[#ff4d00]/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full mt-2 flex items-center justify-center rounded-xl bg-[#ff4d00] py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#e04300] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

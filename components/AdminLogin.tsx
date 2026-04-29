"use client";

import { useState } from "react";
import { Lock, Mail } from "lucide-react";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => boolean;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = onLogin(email, password);
    if (!ok) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dg-cream via-white to-dg-cream-mid/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-dg-dark">
            Desert Glow
          </h1>
          <p className="text-dg-text/50 font-[family-name:var(--font-body)] text-sm mt-2 uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl text-dg-dark mb-1">
            Welcome back
          </h2>
          <p className="text-dg-text/50 font-[family-name:var(--font-body)] text-sm mb-8">
            Sign in to manage your appointments
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dg-text/30" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pam@desertglowspa.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dg-text/30" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-[family-name:var(--font-body)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-dg-pink text-white py-3.5 rounded-full text-sm uppercase tracking-widest hover:bg-dg-rose-hover transition-all duration-300 hover:shadow-lg font-[family-name:var(--font-body)]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-dg-text/30 font-[family-name:var(--font-body)]">
            Demo: pam@desertglowspa.com / desertglow2024
          </p>
        </div>
      </div>
    </div>
  );
}

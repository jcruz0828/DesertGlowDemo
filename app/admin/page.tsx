"use client";

import { useState, useEffect, useCallback } from "react";
import { getSession, login, logout } from "@/lib/auth";
import type { AdminUser } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setUser(getSession());
    setChecked(true);
  }, []);

  const handleLogin = useCallback((email: string, password: string): boolean => {
    const result = login(email, password);
    if (result) {
      setUser(result);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-dg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-dg-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />;
}

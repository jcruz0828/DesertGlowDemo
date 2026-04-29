const AUTH_KEY = "desert-glow-admin-auth";

// Demo credentials — localStorage only
const DEMO_EMAIL = "pam@desertglowspa.com";
const DEMO_PASSWORD = "desertglow2024";

export interface AdminUser {
  email: string;
  name: string;
  loggedInAt: string;
}

export function login(email: string, password: string): AdminUser | null {
  if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const user: AdminUser = {
      email,
      name: "Pam Gossman",
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function getSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

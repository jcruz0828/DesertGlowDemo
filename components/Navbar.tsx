"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Wellness", href: "#wellness" },
  { label: "About", href: "#about" },
  { label: "Appointments", href: "#appointments" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-dg-cream-mid/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-dg-dark tracking-wide">
            Desert Glow
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-dg-text hover:text-dg-rose transition-colors text-sm uppercase tracking-widest font-[family-name:var(--font-body)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book-now"
              className="bg-dg-pink text-white px-6 py-2.5 rounded-full text-sm uppercase tracking-widest hover:bg-dg-rose-hover transition-colors font-[family-name:var(--font-body)]"
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-dg-dark p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-dg-cream-mid/40 animate-slide-up">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-dg-text hover:text-dg-rose transition-colors text-sm uppercase tracking-widest"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book-now"
              onClick={() => setMobileOpen(false)}
              className="bg-dg-pink text-white px-6 py-2.5 rounded-full text-sm uppercase tracking-widest hover:bg-dg-rose-hover transition-colors text-center"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

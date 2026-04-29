import { Globe, Heart, Star } from "lucide-react";

const helpfulLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Med Spa", href: "#services" },
  { label: "Wellness", href: "#wellness" },
  { label: "Specials", href: "#specials" },
  { label: "Payment Plans", href: "#book-now" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#book-now" },
];

const hours = [
  { day: "Monday", time: "9:00 AM – 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 5:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 8:00 PM" },
  { day: "Thursday", time: "9:00 AM – 5:00 PM" },
  { day: "Friday", time: "9:00 AM – 5:00 PM" },
  { day: "Saturday", time: "9:00 AM – 5:00 PM" },
  { day: "Sunday", time: "9:00 AM – 5:00 PM" },
];

export default function Footer() {
  return (
    <footer className="bg-dg-cream-mid pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo + About */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl text-dg-dark mb-4">
              Desert Glow
            </h3>
            <p className="text-sm text-dg-text/60 leading-relaxed font-[family-name:var(--font-body)]">
              A boutique medical aesthetics and wellness practice in Palm
              Desert, CA. Personalized care in a warm, welcoming environment.
            </p>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-lg text-dg-dark mb-4">
              Helpful Links
            </h4>
            <ul className="space-y-2">
              {helpfulLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-dg-text/60 hover:text-dg-rose transition-colors font-[family-name:var(--font-body)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-lg text-dg-dark mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-dg-text/60 font-[family-name:var(--font-body)]">
              <p>
                73241 CA-111 Suite 5A
                <br />
                Palm Desert, CA 92260
              </p>
              <p>
                <a href="tel:7605653990" className="hover:text-dg-rose transition-colors">
                  (760) 565-3990
                </a>
              </p>
              <p>
                <a
                  href="mailto:pam@desertglowspa.com"
                  className="hover:text-dg-rose transition-colors"
                >
                  pam@desertglowspa.com
                </a>
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-dg-pink/20 flex items-center justify-center hover:bg-dg-pink/40 transition-colors"
                  aria-label="Facebook"
                >
                  <Globe className="w-4 h-4 text-dg-rose" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-dg-pink/20 flex items-center justify-center hover:bg-dg-pink/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Heart className="w-4 h-4 text-dg-rose" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-dg-pink/20 flex items-center justify-center hover:bg-dg-pink/40 transition-colors"
                  aria-label="Yelp"
                >
                  <Star className="w-4 h-4 text-dg-rose" />
                </a>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-lg text-dg-dark mb-4">
              Office Hours
            </h4>
            <ul className="space-y-1.5">
              {hours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between text-sm text-dg-text/60 font-[family-name:var(--font-body)]"
                >
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-dg-pink/20 text-center">
          <p className="text-xs text-dg-text/40 font-[family-name:var(--font-body)]">
            &copy; {new Date().getFullYear()} Desert Glow Medical Aesthetics &amp;
            Wellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

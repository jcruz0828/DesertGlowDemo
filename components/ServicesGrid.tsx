"use client";

import { Sparkles, Heart, Tag, ShoppingBag } from "lucide-react";

const services = [
  {
    title: "Med Spa",
    description: "Advanced aesthetic treatments for natural, lasting results.",
    icon: Sparkles,
    href: "#services",
  },
  {
    title: "Wellness",
    description: "Holistic wellness therapies to restore balance and vitality.",
    icon: Heart,
    href: "#wellness",
  },
  {
    title: "Specials",
    description: "Exclusive offers on our most popular treatments.",
    icon: Tag,
    href: "#specials",
  },
  {
    title: "Shop",
    description: "Premium skincare products curated by our experts.",
    icon: ShoppingBag,
    href: "https://shop.desertglowspa.com",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-dg-cream-mid/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl text-dg-dark text-center leading-tight">
          Medical Spa and Wellness Services
          <br className="hidden sm:block" />
          <span className="text-dg-rose"> in Palm Desert, CA</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <a
              key={service.title}
              href={service.href}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dg-cream mb-6 group-hover:bg-dg-pink/20 transition-colors">
                <service.icon className="w-7 h-7 text-dg-rose" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-dg-dark mb-3">
                {service.title}
              </h3>
              <p className="text-dg-text/60 text-sm leading-relaxed font-[family-name:var(--font-body)]">
                {service.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

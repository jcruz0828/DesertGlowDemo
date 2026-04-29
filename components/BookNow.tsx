"use client";

import { useState } from "react";

const serviceOptions = [
  "Botox",
  "Dermal Fillers",
  "Microneedling",
  "RF Microneedling",
  "Laser Treatments",
  "Weight Loss Injections",
  "IV Hydration",
  "Body Sculpting",
  "Other",
];

export default function BookNow() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    service: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FORM SUBMISSION:", form);
    setSubmitted(true);
  };

  return (
    <section id="book-now" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column */}
          <div className="flex flex-col justify-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl text-dg-dark leading-tight">
              Book an Appointment{" "}
              <span className="font-[family-name:var(--font-accent)] text-dg-rose italic">
                Today
              </span>
            </h2>
            <p className="mt-6 text-dg-text/70 leading-relaxed font-[family-name:var(--font-body)]">
              Desert Glow is a boutique medical spa — by appointment only, with
              flexible hours to fit your schedule. Whether you&apos;re interested
              in refreshing your look or exploring wellness treatments, we&apos;d
              love to meet you.
            </p>
            <p className="mt-4 text-dg-text/70 leading-relaxed font-[family-name:var(--font-body)]">
              Start with a complimentary skin assessment and let Pam create a
              personalized treatment plan just for you.
            </p>
            <a
              href="tel:7605653990"
              className="mt-8 inline-flex items-center gap-2 text-dg-rose hover:text-dg-rose-hover transition-colors font-[family-name:var(--font-body)] text-lg"
            >
              Or call us: (760) 565-3990
            </a>
          </div>

          {/* Right column - Form */}
          <div className="bg-dg-cream/50 rounded-3xl p-8 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-dg-pink/20 flex items-center justify-center mb-6">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl text-dg-dark mb-3">
                  Thank You!
                </h3>
                <p className="text-dg-text/70 font-[family-name:var(--font-body)]">
                  Pam will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none transition-colors font-[family-name:var(--font-body)]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none transition-colors font-[family-name:var(--font-body)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none transition-colors font-[family-name:var(--font-body)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none transition-colors font-[family-name:var(--font-body)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
                  >
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={form.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none transition-colors font-[family-name:var(--font-body)]"
                  >
                    <option value="">Select a service...</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-dg-text/60 mb-1.5 font-[family-name:var(--font-body)]"
                  >
                    Message / Skincare Goals
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none transition-colors resize-none font-[family-name:var(--font-body)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-dg-pink text-white py-4 rounded-full text-sm uppercase tracking-widest hover:bg-dg-rose-hover transition-all duration-300 hover:shadow-lg font-[family-name:var(--font-body)]"
                >
                  Schedule My Assessment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

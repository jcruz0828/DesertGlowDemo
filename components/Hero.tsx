"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-dg-cream via-white to-dg-cream-mid/30">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c99b9d' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="animate-fade-in-up">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-dg-dark leading-tight">
              Rediscover Your Natural{" "}
              <span className="font-[family-name:var(--font-accent)] text-dg-rose italic">
                Glow
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-dg-text/70 font-[family-name:var(--font-body)] font-light max-w-lg">
              High-quality care, designed around you.
            </p>
            <a
              href="#book-now"
              className="mt-10 inline-block bg-dg-pink text-white px-8 py-4 rounded-full text-base uppercase tracking-widest hover:bg-dg-rose-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-[family-name:var(--font-body)]"
            >
              Schedule Your Free Consultation
            </a>
          </div>

          {/* Image placeholder - soft gradient */}
          <div className="animate-fade-in hidden lg:block">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-dg-pink/20 via-dg-cream to-dg-cream-mid" />
              <div className="absolute inset-0 bg-gradient-to-t from-dg-rose/10 to-transparent" />
              {/* Decorative circles */}
              <div className="absolute top-12 right-12 w-32 h-32 rounded-full bg-dg-pink/15 blur-2xl" />
              <div className="absolute bottom-20 left-8 w-48 h-48 rounded-full bg-dg-cream-mid/50 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <p className="font-[family-name:var(--font-accent)] text-dg-rose/40 text-2xl">
                  Photo Coming Soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-dg-cream-mid via-dg-cream to-dg-pink/20" />
            <div className="absolute top-16 left-16 w-40 h-40 rounded-full bg-dg-pink/10 blur-3xl" />
            <div className="absolute bottom-16 right-16 w-56 h-56 rounded-full bg-dg-cream-mid/60 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-[family-name:var(--font-accent)] text-dg-rose/40 text-2xl">
                Photo Coming Soon
              </p>
            </div>
          </div>

          {/* Text content */}
          <div>
            <p className="text-dg-pink uppercase tracking-[0.2em] text-sm font-[family-name:var(--font-body)] mb-4">
              Transformative Treatments, Naturally Beautiful Results
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl text-dg-dark leading-tight">
              Discover the Desert Glow{" "}
              <span className="font-[family-name:var(--font-accent)] text-dg-rose italic">
                Difference
              </span>
            </h2>
            <p className="mt-6 text-dg-text/70 leading-relaxed font-[family-name:var(--font-body)]">
              At Desert Glow Medical Aesthetics and Wellness, we believe that
              true beauty starts with healthy skin and a balanced body. Led by
              Pam, our boutique practice in Palm Desert offers personalized,
              one-on-one care in a warm and welcoming environment.
            </p>
            <p className="mt-4 text-dg-text/70 leading-relaxed font-[family-name:var(--font-body)]">
              We combine the latest in medical aesthetics with a holistic
              approach to wellness, ensuring every treatment plan is tailored to
              your unique goals. From advanced injectables to regenerative
              therapies, we&apos;re here to help you look and feel your absolute
              best.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#about"
                className="bg-dg-pink text-white px-8 py-3.5 rounded-full text-sm uppercase tracking-widest hover:bg-dg-rose-hover transition-all duration-300 text-center font-[family-name:var(--font-body)]"
              >
                Learn More
              </a>
              <a
                href="#book-now"
                className="border-2 border-dg-pink text-dg-rose px-8 py-3.5 rounded-full text-sm uppercase tracking-widest hover:bg-dg-pink hover:text-white transition-all duration-300 text-center font-[family-name:var(--font-body)]"
              >
                Our Payment Plans
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

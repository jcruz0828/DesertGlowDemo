"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "My skin has never been better thanks to Desert Glow. For the past year I've been rotating RF micro-needling and peels and it's improved my skin texture a lot.",
    author: "Casey K.",
  },
  {
    quote:
      "Desert Glow Medical Aesthetics is highly recommended! Pam is extremely professional and has a vast understanding of what is best for each individual client.",
    author: "Mindy M.",
  },
  {
    quote:
      "I highly recommend Pam for anyone. She put me at ease and let me know it could help, and sure enough it worked.",
    author: "Randall B.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-20 sm:py-28 bg-dg-cream-mid/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl text-dg-dark mb-14">
          Glowing Reviews for Desert Glow
        </h2>

        <div className="relative min-h-[200px] flex items-center">
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-0 sm:-left-4 z-10 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-dg-rose" />
          </button>

          {/* Testimonial */}
          <div key={current} className="px-12 sm:px-16 animate-fade-testimonial">
            <blockquote className="font-[family-name:var(--font-body)] text-lg sm:text-xl text-dg-text/80 italic leading-relaxed">
              &ldquo;{testimonials[current].quote}&rdquo;
            </blockquote>
            <p className="mt-6 font-[family-name:var(--font-heading)] text-dg-rose text-lg">
              &mdash; {testimonials[current].author}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-0 sm:-right-4 z-10 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-dg-rose" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? "bg-dg-rose" : "bg-dg-pink/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Sun } from "lucide-react";

const leftServices = [
  "Signature Offerings",
  "Botox",
  "Regenerative Injectibles",
  "Dermal Fillers",
  "PDO Threads",
  "Microneedling",
];

const rightServices = [
  "RF Microneedling",
  "Chemical Peels",
  "Laser Treatments",
  "Weight Loss Injections",
  "IV Hydration",
  "Body Sculpting",
];

function ServiceItem({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <Sun className="w-5 h-5 text-dg-pink flex-shrink-0" />
      <span className="text-dg-text/80 font-[family-name:var(--font-body)] text-base sm:text-lg">
        {name}
      </span>
    </li>
  );
}

export default function ServicesList() {
  return (
    <section id="wellness" className="py-20 sm:py-28 bg-gradient-to-b from-white to-dg-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl text-dg-dark text-center mb-14">
          Explore Our Available Services
        </h2>

        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-1">
          <ul>
            {leftServices.map((s) => (
              <ServiceItem key={s} name={s} />
            ))}
          </ul>
          <ul>
            {rightServices.map((s) => (
              <ServiceItem key={s} name={s} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

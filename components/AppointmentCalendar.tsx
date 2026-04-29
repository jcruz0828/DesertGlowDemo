"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import { Clock, CalendarDays, Sparkles } from "lucide-react";
import { getAvailableSlots, formatTime12h } from "@/lib/appointments";

const serviceOptions = [
  "Complimentary Skin Assessment",
  "Botox",
  "Dermal Fillers",
  "Microneedling",
  "RF Microneedling",
  "Chemical Peels",
  "Laser Hair Removal",
  "IPL Photofacial",
  "Tattoo Removal",
  "PDO Threads",
  "Weight Loss Consultation",
  "IV Hydration",
  "Body Sculpting",
  "Peptide Therapy",
  "HRT Consultation",
  "Other",
];

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    window.addEventListener("appointments-updated", triggerRefresh);
    return () => window.removeEventListener("appointments-updated", triggerRefresh);
  }, [triggerRefresh]);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setAvailableSlots(getAvailableSlots(dateStr));
      setSelectedTime(null);
    }
  }, [selectedDate, refreshKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("APPOINTMENT INQUIRY:", {
      ...form,
      preferredDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
      preferredTime: selectedTime,
    });
    setSubmitted(true);
  };

  const today = startOfDay(new Date());

  return (
    <section id="appointments" className="py-20 sm:py-28 bg-gradient-to-b from-dg-cream/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-dg-pink uppercase tracking-[0.2em] text-sm font-[family-name:var(--font-body)] mb-4">
            Schedule Your Visit
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl text-dg-dark">
            Request an{" "}
            <span className="font-[family-name:var(--font-accent)] text-dg-rose italic">
              Appointment
            </span>
          </h2>
          <p className="mt-4 text-dg-text/50 font-[family-name:var(--font-body)] max-w-xl mx-auto">
            Pick a preferred date and time below, and we&apos;ll confirm your
            appointment within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: today }}
              classNames={{
                root: "font-[family-name:var(--font-body)]",
                month_caption:
                  "font-[family-name:var(--font-heading)] text-lg text-dg-dark mb-2 flex justify-center",
                weekday:
                  "text-xs text-dg-text/40 uppercase tracking-wider font-[family-name:var(--font-body)]",
                day: "text-sm",
                day_button:
                  "w-10 h-10 rounded-full transition-all hover:bg-dg-pink/20 font-[family-name:var(--font-body)]",
                selected: "!bg-dg-pink !text-white rounded-full",
                today: "font-bold text-dg-rose",
                disabled: "text-dg-text/20 cursor-not-allowed",
                nav: "flex items-center justify-between mb-2",
                button_previous:
                  "p-1.5 rounded-full hover:bg-dg-cream transition-colors",
                button_next:
                  "p-1.5 rounded-full hover:bg-dg-cream transition-colors",
                chevron: "w-4 h-4 text-dg-rose",
              }}
            />
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-dg-rose" />
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-dg-dark">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d")
                  : "Select a Date"}
              </h3>
            </div>

            {!selectedDate && (
              <div className="flex flex-col items-center justify-center h-48 text-dg-text/40">
                <CalendarDays className="w-10 h-10 mb-3" />
                <p className="font-[family-name:var(--font-body)] text-sm">
                  Pick a date to see available times
                </p>
              </div>
            )}

            {selectedDate && availableSlots.length === 0 && (
              <p className="text-dg-text/50 font-[family-name:var(--font-body)] text-sm">
                No available slots on this date. Please try another day.
              </p>
            )}

            {selectedDate && availableSlots.length > 0 && (
              <div className="grid grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-2 rounded-xl text-sm transition-all font-[family-name:var(--font-body)] ${
                      selectedTime === slot
                        ? "bg-dg-pink text-white shadow-md"
                        : "bg-dg-cream/60 text-dg-text hover:bg-dg-pink/20 hover:text-dg-rose"
                    }`}
                  >
                    {formatTime12h(slot)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-dg-rose" />
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-dg-dark">
                Your Information
              </h3>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-14 h-14 rounded-full bg-dg-pink/15 flex items-center justify-center mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="font-[family-name:var(--font-heading)] text-xl text-dg-dark mb-2">
                  Request Received!
                </h4>
                <p className="text-sm text-dg-text/50 font-[family-name:var(--font-body)]">
                  Pam will be in touch within 24 hours to confirm your appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedDate && selectedTime && (
                  <p className="text-sm text-dg-pink font-medium font-[family-name:var(--font-body)]">
                    Preferred: {format(selectedDate, "MMMM d")} at{" "}
                    {formatTime12h(selectedTime)}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, firstName: e.target.value }))
                    }
                    className="px-3 py-2.5 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, lastName: e.target.value }))
                    }
                    className="px-3 py-2.5 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                />

                <select
                  required
                  value={form.service}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, service: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
                >
                  <option value="">Select a service...</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Questions or skincare goals (optional)"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-dg-cream/30 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm resize-none font-[family-name:var(--font-body)]"
                />

                <button
                  type="submit"
                  className="w-full bg-dg-pink text-white py-3 rounded-full text-sm uppercase tracking-widest hover:bg-dg-rose-hover transition-all duration-300 hover:shadow-lg font-[family-name:var(--font-body)]"
                >
                  Request Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

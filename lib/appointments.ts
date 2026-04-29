export interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  service: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = "desert-glow-appointments";

function generateId(): string {
  return `dg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getAllAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(appointments: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  window.dispatchEvent(new Event("appointments-updated"));
}

// Business hours: Mon-Tue 9-5, Wed 9-8, Thu-Sun 9-5
// 30-minute slots
export function getBusinessHours(date: string): { open: number; close: number } | null {
  const d = new Date(date + "T12:00:00");
  const day = d.getDay(); // 0=Sun, 3=Wed
  if (day === 3) return { open: 9, close: 20 }; // Wednesday 9am-8pm
  return { open: 9, close: 17 }; // All other days 9am-5pm
}

export function getTimeSlots(date: string): string[] {
  const hours = getBusinessHours(date);
  if (!hours) return [];
  const slots: string[] = [];
  for (let h = hours.open; h < hours.close; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
}

export function getAvailableSlots(date: string): string[] {
  const all = getTimeSlots(date);
  const booked = getAllAppointments()
    .filter((a) => a.date === date)
    .map((a) => a.time);
  return all.filter((slot) => !booked.includes(slot));
}

export function createAppointment(
  data: Omit<Appointment, "id" | "createdAt">
): Appointment {
  const appointments = getAllAppointments();
  const existing = appointments.find(
    (a) => a.date === data.date && a.time === data.time
  );
  if (existing) {
    throw new Error(`Time slot ${data.time} on ${data.date} is already booked.`);
  }
  const appointment: Appointment = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  save(appointments);
  return appointment;
}

export function getAppointmentById(id: string): Appointment | null {
  return getAllAppointments().find((a) => a.id === id) || null;
}

export function findAppointments(query: {
  email?: string;
  phone?: string;
  name?: string;
  date?: string;
}): Appointment[] {
  return getAllAppointments().filter((a) => {
    if (query.email && a.email.toLowerCase() !== query.email.toLowerCase())
      return false;
    if (query.phone && a.phone.replace(/\D/g, "") !== query.phone.replace(/\D/g, ""))
      return false;
    if (
      query.name &&
      !`${a.firstName} ${a.lastName}`
        .toLowerCase()
        .includes(query.name.toLowerCase())
    )
      return false;
    if (query.date && a.date !== query.date) return false;
    return true;
  });
}

export function updateAppointment(
  id: string,
  updates: Partial<Pick<Appointment, "date" | "time" | "service" | "notes">>
): Appointment {
  const appointments = getAllAppointments();
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error(`Appointment ${id} not found.`);

  if (updates.date || updates.time) {
    const newDate = updates.date || appointments[idx].date;
    const newTime = updates.time || appointments[idx].time;
    const conflict = appointments.find(
      (a, i) => i !== idx && a.date === newDate && a.time === newTime
    );
    if (conflict) {
      throw new Error(`Time slot ${newTime} on ${newDate} is already booked.`);
    }
  }

  appointments[idx] = { ...appointments[idx], ...updates };
  save(appointments);
  return appointments[idx];
}

export function cancelAppointment(id: string): boolean {
  const appointments = getAllAppointments();
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error(`Appointment ${id} not found.`);
  appointments.splice(idx, 1);
  save(appointments);
  return true;
}

export function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

import {
  getAvailableSlots,
  createAppointment,
  findAppointments,
  updateAppointment,
  cancelAppointment,
  formatTime12h,
} from "./appointments";
import { saveLead } from "./leads";

// OpenAI-compatible tool definitions for the LLM
export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "check_availability",
      description:
        "Check available appointment time slots for a specific date at Desert Glow. Returns a list of open 30-minute slots.",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "The date to check in YYYY-MM-DD format",
          },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "book_appointment",
      description:
        "Book a new appointment at Desert Glow. Requires client name, contact info, date, time, and service.",
      parameters: {
        type: "object",
        properties: {
          firstName: { type: "string", description: "Client's first name" },
          lastName: { type: "string", description: "Client's last name" },
          email: { type: "string", description: "Client's email address" },
          phone: { type: "string", description: "Client's phone number" },
          date: {
            type: "string",
            description: "Appointment date in YYYY-MM-DD format",
          },
          time: {
            type: "string",
            description: "Appointment time in HH:MM 24-hour format (e.g. 14:00)",
          },
          service: {
            type: "string",
            description: "Service requested (e.g. Botox, Dermal Fillers, Microneedling)",
          },
          notes: {
            type: "string",
            description: "Any additional notes or goals from the client",
          },
        },
        required: ["firstName", "lastName", "email", "phone", "date", "time", "service"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "find_appointments",
      description:
        "Look up existing appointments by client email, phone, name, or date.",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "Client's email address" },
          phone: { type: "string", description: "Client's phone number" },
          name: { type: "string", description: "Client's name (first, last, or full)" },
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "reschedule_appointment",
      description:
        "Reschedule an existing appointment to a new date and/or time.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: {
            type: "string",
            description: "The appointment ID to reschedule",
          },
          new_date: {
            type: "string",
            description: "New date in YYYY-MM-DD format",
          },
          new_time: {
            type: "string",
            description: "New time in HH:MM 24-hour format",
          },
        },
        required: ["appointment_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "cancel_appointment",
      description: "Cancel an existing appointment by its ID.",
      parameters: {
        type: "object",
        properties: {
          appointment_id: {
            type: "string",
            description: "The appointment ID to cancel",
          },
        },
        required: ["appointment_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "capture_lead",
      description:
        "Save a potential client as a lead when they show genuine interest in services but aren't ready to book right now. Use this when a visitor asks to be contacted later, says they'll think about it, or shares contact info without completing a booking. Only captures service interests and voluntarily shared contact info — never store health conditions or diagnoses.",
      parameters: {
        type: "object",
        properties: {
          firstName: { type: "string", description: "Client's first name if shared" },
          lastName: { type: "string", description: "Client's last name if shared" },
          email: { type: "string", description: "Client's email address if shared" },
          phone: { type: "string", description: "Client's phone number if shared" },
          interestedServices: {
            type: "string",
            description: "Comma-separated list of services the client expressed interest in (e.g. 'Botox, RF Microneedling')",
          },
          summary: {
            type: "string",
            description: "1-2 sentence summary of what the client is looking for. Service interests and goals only — no health conditions or diagnoses.",
          },
        },
        required: ["summary"],
      },
    },
  },
];

// Execute a tool call locally and return the result string
export function executeTool(name: string, args: Record<string, string>): string {
  try {
    switch (name) {
      case "check_availability": {
        const slots = getAvailableSlots(args.date);
        if (slots.length === 0) {
          return `No available slots on ${args.date}. The day may be fully booked.`;
        }
        const formatted = slots.map((s) => formatTime12h(s)).join(", ");
        return `Available slots on ${args.date}: ${formatted} (${slots.length} slots open)`;
      }

      case "book_appointment": {
        const appt = createAppointment({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phone: args.phone,
          date: args.date,
          time: args.time,
          service: args.service,
          notes: args.notes || "",
        });
        console.log("LEAD CAPTURED:", {
          name: `${appt.firstName} ${appt.lastName}`,
          email: appt.email,
          phone: appt.phone,
          serviceInterest: appt.service,
        });
        return `Appointment booked successfully! ID: ${appt.id}. ${appt.firstName} ${appt.lastName} is scheduled for ${appt.service} on ${appt.date} at ${formatTime12h(appt.time)}.`;
      }

      case "find_appointments": {
        const results = findAppointments(args);
        if (results.length === 0) {
          return "No appointments found matching that criteria.";
        }
        return results
          .map(
            (a) =>
              `ID: ${a.id} | ${a.firstName} ${a.lastName} | ${a.service} | ${a.date} at ${formatTime12h(a.time)} | ${a.email} | ${a.phone}`
          )
          .join("\n");
      }

      case "reschedule_appointment": {
        const updates: Record<string, string> = {};
        if (args.new_date) updates.date = args.new_date;
        if (args.new_time) updates.time = args.new_time;
        const updated = updateAppointment(args.appointment_id, updates);
        return `Appointment ${updated.id} rescheduled to ${updated.date} at ${formatTime12h(updated.time)}.`;
      }

      case "cancel_appointment": {
        cancelAppointment(args.appointment_id);
        return `Appointment ${args.appointment_id} has been cancelled.`;
      }

      case "capture_lead": {
        const services = args.interestedServices
          ? args.interestedServices.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        const lead = saveLead({
          firstName: args.firstName || undefined,
          lastName: args.lastName || undefined,
          email: args.email || undefined,
          phone: args.phone || undefined,
          interestedServices: services,
          summary: args.summary,
        });
        return `Lead captured successfully (ID: ${lead.id}). The team will follow up${args.firstName ? ` with ${args.firstName}` : ""} about ${services.length > 0 ? services.join(", ") : "their service interests"}.`;
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (err) {
    return `Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

import type { Appointment } from "./appointments";
import type { Lead } from "./leads";

function relativeDate(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

// Creates a full ISO timestamp at a specific local time, N days ago
function timestampAt(daysAgo: number, hour: number, minute: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function seedDemoData() {
  const appointments: Appointment[] = [
    {
      id: "dg-demo-001",
      firstName: "Ashley",
      lastName: "Monroe",
      email: "ashley.monroe@gmail.com",
      phone: "(760) 321-4455",
      date: relativeDate(0),
      time: "10:00",
      service: "Botox",
      notes: "First-time client. Interested in forehead lines and crow's feet. Wants a natural result.",
      createdAt: timestampAt(1, 22, 32), // Sofia booked at 10:32 PM last night
    },
    {
      id: "dg-demo-002",
      firstName: "Rachel",
      lastName: "Kim",
      email: "rkim@outlook.com",
      phone: "(760) 888-2231",
      date: relativeDate(0),
      time: "13:30",
      service: "RF Microneedling",
      notes: "Has had microneedling before, wants to try RF upgrade.",
      createdAt: timestampAt(5, 14, 15),
    },
    {
      id: "dg-demo-003",
      firstName: "Danielle",
      lastName: "Torres",
      email: "dtorres@yahoo.com",
      phone: "(760) 554-9901",
      date: relativeDate(0),
      time: "15:00",
      service: "Complimentary Skin Assessment",
      notes: "",
      createdAt: timestampAt(1, 10, 30),
    },
    {
      id: "dg-demo-004",
      firstName: "Marcus",
      lastName: "Webb",
      email: "mwebb@icloud.com",
      phone: "(760) 204-7723",
      date: relativeDate(1),
      time: "11:00",
      service: "HRT for Men",
      notes: "Referred by a friend. Has questions about the intake process.",
      createdAt: timestampAt(1, 21, 58), // Sofia booked at 9:58 PM last night
    },
    {
      id: "dg-demo-005",
      firstName: "Jennifer",
      lastName: "Castillo",
      email: "jen.castillo@gmail.com",
      phone: "(760) 412-6680",
      date: relativeDate(2),
      time: "09:30",
      service: "Dermal Fillers — Lip Fillers",
      notes: "Wants natural-looking results. First time with fillers.",
      createdAt: timestampAt(4, 23, 14),
    },
    {
      id: "dg-demo-006",
      firstName: "Stephanie",
      lastName: "Park",
      email: "spark@gmail.com",
      phone: "(760) 330-1192",
      date: relativeDate(4),
      time: "14:00",
      service: "Semaglutide Weight Loss",
      notes: "Interested in the full program. Wants to discuss goals with Paige.",
      createdAt: timestampAt(6, 15, 0),
    },
    {
      id: "dg-demo-007",
      firstName: "Linda",
      lastName: "Nguyen",
      email: "linda.nguyen@hotmail.com",
      phone: "(760) 771-3345",
      date: relativeDate(7),
      time: "10:30",
      service: "Chemical Peel",
      notes: "Sun damage from years in the desert. Lives here year-round.",
      createdAt: timestampAt(2, 11, 45),
    },
    {
      id: "dg-demo-008",
      firstName: "Carlos",
      lastName: "Rivera",
      email: "carlos.r@gmail.com",
      phone: "(760) 990-5512",
      date: relativeDate(10),
      time: "09:00",
      service: "IV Hydration",
      notes: "Athlete. Wants to set up monthly IV therapy sessions.",
      createdAt: timestampAt(1, 9, 15),
    },
  ];

  const leads: Lead[] = [
    {
      id: "lead-demo-001",
      firstName: "Beverly",
      lastName: "Chen",
      email: "beverly.chen@gmail.com",
      phone: "(312) 554-8801",
      interestedServices: ["Tirzepatide Weight Loss"],
      summary:
        "Beverly is visiting from Chicago for the winter and wants to start a weight loss program before heading home in April. She's heard about tirzepatide from a friend who had great results and wants to understand what the program involves before committing. Very warm and engaged — mentioned she found Desert Glow through Google reviews.",
      status: "new",
      createdAt: timestampAt(1, 22, 47),
      lastActivity: timestampAt(1, 22, 47),
    },
    {
      id: "lead-demo-002",
      firstName: "Sandra",
      lastName: "Reyes",
      email: "sandyreyes@icloud.com",
      phone: "(760) 883-4421",
      interestedServices: ["Botox"],
      summary:
        "Sandra is researching Botox for the first time and is nervous about looking unnatural. She wants to soften her forehead lines but is worried about looking 'frozen.' Asked several thoughtful questions about Pam's approach and mentioned she's comparing a few practices. Wants a callback before deciding.",
      status: "new",
      createdAt: timestampAt(1, 23, 14),
      lastActivity: timestampAt(1, 23, 14),
    },
    {
      id: "lead-demo-003",
      firstName: "Diane",
      lastName: "Winters",
      email: "diane.winters@yahoo.com",
      phone: "(760) 441-7823",
      interestedServices: ["RF Microneedling", "Chemical Peel"],
      summary:
        "Diane has significant sun damage from years living in the desert and is exploring RF microneedling and a peel series. Her daughter's wedding is six months away and she wants to start a treatment plan now. Asked about package pricing and how many sessions are typically recommended.",
      status: "new",
      createdAt: timestampAt(1, 21, 41),
      lastActivity: timestampAt(1, 21, 41),
    },
    {
      id: "lead-demo-004",
      firstName: "Robert",
      lastName: "Hahn",
      email: "rhahn@gmail.com",
      phone: "(760) 209-6634",
      interestedServices: ["HRT for Men", "Peptide Therapy"],
      summary:
        "Robert is 52 and experiencing fatigue and low motivation. He's researching testosterone replacement and peptide therapy and wants to understand the process before coming in. Found Desert Glow through Google reviews and specifically mentioned Pam's medical credentials as the reason he reached out.",
      status: "converted",
      createdAt: timestampAt(3, 22, 5),
      lastActivity: timestampAt(1, 10, 30),
    },
    {
      id: "lead-demo-005",
      firstName: "Patricia",
      lastName: "Walsh",
      email: "",
      phone: "(760) 553-8821",
      interestedServices: ["PDO Threads", "Liquid Facelift"],
      summary:
        "Patricia is turning 60 and wants a non-surgical lift as a gift to herself. She asked thoughtful questions about PDO threads versus a liquid facelift, recovery time, and how long results last. Prefers a phone call — said she doesn't check email often.",
      status: "contacted",
      createdAt: timestampAt(2, 22, 58),
      lastActivity: timestampAt(1, 14, 0),
    },
  ];

  localStorage.setItem("desert-glow-appointments", JSON.stringify(appointments));
  localStorage.setItem("desert-glow-leads", JSON.stringify(leads));

  window.dispatchEvent(new CustomEvent("appointments-updated"));
  window.dispatchEvent(new CustomEvent("leads-updated"));
}

export function clearDemoData() {
  localStorage.removeItem("desert-glow-appointments");
  localStorage.removeItem("desert-glow-leads");
  window.dispatchEvent(new CustomEvent("appointments-updated"));
  window.dispatchEvent(new CustomEvent("leads-updated"));
}

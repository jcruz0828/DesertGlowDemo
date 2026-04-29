export interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  interestedServices: string[];
  summary: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: string;
  lastActivity: string;
}

const STORAGE_KEY = "desert-glow-leads";

export function getAllLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function persistLeads(leads: Lead[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  window.dispatchEvent(new CustomEvent("leads-updated"));
}

export function saveLead(
  data: Omit<Lead, "id" | "createdAt" | "lastActivity" | "status">
): Lead {
  const leads = getAllLeads();
  const now = new Date().toISOString();
  const lead: Lead = {
    ...data,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "new",
    createdAt: now,
    lastActivity: now,
  };
  persistLeads([...leads, lead]);
  return lead;
}

export function updateLeadStatus(id: string, status: Lead["status"]): void {
  const leads = getAllLeads();
  persistLeads(
    leads.map((l) =>
      l.id === id ? { ...l, status, lastActivity: new Date().toISOString() } : l
    )
  );
}

export function deleteLead(id: string): void {
  persistLeads(getAllLeads().filter((l) => l.id !== id));
}

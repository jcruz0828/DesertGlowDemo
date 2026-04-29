"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  Sparkles,
  Trash2,
  LogOut,
  ChevronRight,
  Search,
  Users,
  TrendingUp,
  UserPlus,
  Copy,
  Check,
  Wand2,
  ShieldCheck,
  Database,
  RotateCcw,
} from "lucide-react";
import {
  getAllAppointments,
  cancelAppointment,
  formatTime12h,
  type Appointment,
} from "@/lib/appointments";
import {
  getAllLeads,
  updateLeadStatus,
  deleteLead,
  type Lead,
} from "@/lib/leads";
import { seedDemoData, clearDemoData } from "@/lib/seed";
import type { AdminUser } from "@/lib/auth";

interface Props {
  user: AdminUser;
  onLogout: () => void;
}

type View = "today" | "calendar" | "all" | "leads";

function isAfterHours(isoString: string): boolean {
  const hour = new Date(isoString).getHours();
  return hour < 9 || hour >= 17;
}

const STATUS_STYLES: Record<Lead["status"], string> = {
  new: "bg-dg-pink/10 text-dg-rose",
  contacted: "bg-blue-50 text-blue-600",
  converted: "bg-green-50 text-green-600",
  closed: "bg-gray-100 text-gray-400",
};

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

export default function AdminDashboard({ user, onLogout }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<View>("today");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [followUpMessages, setFollowUpMessages] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setAppointments(getAllAppointments());
    setLeads(getAllLeads());
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("appointments-updated", handler);
    window.addEventListener("leads-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("appointments-updated", handler);
      window.removeEventListener("leads-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const today = format(new Date(), "yyyy-MM-dd");

  const todayAppointments = appointments
    .filter((a) => a.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const calendarDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const calendarAppointments = calendarDateStr
    ? appointments
        .filter((a) => a.date === calendarDateStr)
        .sort((a, b) => a.time.localeCompare(b.time))
    : [];

  const filteredAppointments = searchQuery
    ? appointments.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.phone.includes(searchQuery) ||
          a.service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appointments;

  const allSorted = filteredAppointments.sort(
    (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
  );

  const handleCancel = (id: string) => {
    if (confirm("Cancel this appointment? This cannot be undone.")) {
      cancelAppointment(id);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Remove this lead? This cannot be undone.")) {
      deleteLead(id);
    }
  };

  const handleGenerateFollowUp = async (lead: Lead) => {
    setGeneratingId(lead.id);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead }),
      });
      const data = await res.json();
      if (data.message) {
        setFollowUpMessages((prev) => ({ ...prev, [lead.id]: data.message }));
        updateLeadStatus(lead.id, lead.status === "new" ? "contacted" : lead.status);
      }
    } finally {
      setGeneratingId(null);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const bookedDates = appointments.map((a) => new Date(a.date + "T12:00:00"));
  const uniqueEmails = new Set(appointments.map((a) => a.email.toLowerCase()));
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const weekEndStr = format(weekEnd, "yyyy-MM-dd");
  const thisWeekCount = appointments.filter(
    (a) => a.date >= weekStartStr && a.date <= weekEndStr
  ).length;

  // Overnight captures — anything after-hours in the last 36 hours
  const window36h = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const overnightLeads = leads.filter(
    (l) => l.createdAt >= window36h && isAfterHours(l.createdAt)
  );
  const overnightAppts = appointments.filter(
    (a) => a.createdAt >= window36h && isAfterHours(a.createdAt)
  );
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  function AppointmentCard({ appt }: { appt: Appointment }) {
    const isExpanded = expandedId === appt.id;
    return (
      <div className="bg-white rounded-2xl border border-dg-cream-mid/40 overflow-hidden transition-shadow hover:shadow-md">
        <button
          onClick={() => setExpandedId(isExpanded ? null : appt.id)}
          className="w-full px-5 py-4 flex items-center gap-4 text-left"
        >
          <div className="flex-shrink-0 w-16 text-center">
            <p className="text-sm font-semibold text-dg-rose font-[family-name:var(--font-body)]">
              {formatTime12h(appt.time)}
            </p>
            {view !== "today" && (
              <p className="text-[10px] text-dg-text/40 mt-0.5 font-[family-name:var(--font-body)]">
                {format(new Date(appt.date + "T12:00:00"), "MMM d")}
              </p>
            )}
          </div>
          <div className="h-8 w-px bg-dg-cream-mid/60 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-dg-dark text-sm truncate font-[family-name:var(--font-body)]">
              {appt.firstName} {appt.lastName}
            </p>
            <p className="text-xs text-dg-text/50 font-[family-name:var(--font-body)]">
              {appt.service}
            </p>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-dg-text/30 transition-transform flex-shrink-0 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="px-5 pb-4 pt-0 border-t border-dg-cream/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-2 text-sm text-dg-text/60">
                <Mail className="w-3.5 h-3.5" />
                <a
                  href={`mailto:${appt.email}`}
                  className="hover:text-dg-rose transition-colors font-[family-name:var(--font-body)]"
                >
                  {appt.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-dg-text/60">
                <Phone className="w-3.5 h-3.5" />
                <a
                  href={`tel:${appt.phone}`}
                  className="hover:text-dg-rose transition-colors font-[family-name:var(--font-body)]"
                >
                  {appt.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-dg-text/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-[family-name:var(--font-body)]">{appt.service}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dg-text/60">
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="font-[family-name:var(--font-body)]">
                  {format(new Date(appt.date + "T12:00:00"), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            </div>
            {appt.notes && (
              <p className="mt-3 text-sm text-dg-text/50 italic bg-dg-cream/30 rounded-xl p-3 font-[family-name:var(--font-body)]">
                {appt.notes}
              </p>
            )}
            {isAfterHours(appt.createdAt) && (
              <div className="mt-3 flex items-center gap-2 text-xs bg-dg-pink/8 text-dg-rose rounded-xl px-3 py-2 font-[family-name:var(--font-body)]">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Booked by Sofia at {format(new Date(appt.createdAt), "h:mm a")} — after hours</span>
              </div>
            )}
            <div className="mt-3 flex justify-between items-center">
              <p className="text-[10px] text-dg-text/30 font-[family-name:var(--font-body)]">
                ID: {appt.id} &middot; Booked{" "}
                {format(new Date(appt.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
              <button
                onClick={() => handleCancel(appt.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 font-[family-name:var(--font-body)]"
              >
                <Trash2 className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function LeadCard({ lead }: { lead: Lead }) {
    const isExpanded = expandedLeadId === lead.id;
    const followUpMessage = followUpMessages[lead.id];
    const isGenerating = generatingId === lead.id;
    const isCopied = copiedId === lead.id;
    const displayName =
      [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Anonymous Visitor";

    return (
      <div className="bg-white rounded-2xl border border-dg-cream-mid/40 overflow-hidden transition-shadow hover:shadow-md">
        <button
          onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
          className="w-full px-5 py-4 flex items-center gap-4 text-left"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-dg-pink/10 flex items-center justify-center">
              <User className="w-4 h-4 text-dg-rose" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-dg-dark text-sm font-[family-name:var(--font-body)]">
                {displayName}
              </p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium font-[family-name:var(--font-body)] ${
                  STATUS_STYLES[lead.status]
                }`}
              >
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
            {lead.interestedServices.length > 0 && (
              <p className="text-xs text-dg-text/50 truncate font-[family-name:var(--font-body)]">
                {lead.interestedServices.join(", ")}
              </p>
            )}
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-[10px] text-dg-text/30 font-[family-name:var(--font-body)]">
              {format(new Date(lead.createdAt), "MMM d, h:mm a")}
            </p>
            {isAfterHours(lead.createdAt) && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-dg-pink/10 text-dg-rose font-medium block text-right mt-0.5 font-[family-name:var(--font-body)]">
                After Hours
              </span>
            )}
          </div>

          <ChevronRight
            className={`w-4 h-4 text-dg-text/30 transition-transform flex-shrink-0 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="px-5 pb-5 pt-0 border-t border-dg-cream/60 space-y-4">
            {/* Summary */}
            <div className="mt-4">
              <p className="text-xs font-medium text-dg-text/40 uppercase tracking-wider mb-1.5 font-[family-name:var(--font-body)]">
                Conversation Summary
              </p>
              <p className="text-sm text-dg-text/70 bg-dg-cream/40 rounded-xl px-4 py-3 font-[family-name:var(--font-body)] leading-relaxed">
                {lead.summary}
              </p>
            </div>

            {/* Contact info */}
            {(lead.email || lead.phone) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm text-dg-text/60">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-dg-rose transition-colors font-[family-name:var(--font-body)] truncate"
                    >
                      {lead.email}
                    </a>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2 text-sm text-dg-text/60">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-dg-rose transition-colors font-[family-name:var(--font-body)]"
                    >
                      {lead.phone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Services tags */}
            {lead.interestedServices.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {lead.interestedServices.map((svc) => (
                  <span
                    key={svc}
                    className="text-xs bg-dg-pink/8 text-dg-rose px-2.5 py-1 rounded-full font-[family-name:var(--font-body)]"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            )}

            {/* Follow-up message area */}
            <div>
              {!followUpMessage ? (
                <button
                  onClick={() => handleGenerateFollowUp(lead)}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dg-pink text-white text-sm font-[family-name:var(--font-body)] hover:bg-dg-rose-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      Generate Follow-up Message
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-dg-text/40 uppercase tracking-wider font-[family-name:var(--font-body)]">
                      AI-Crafted Follow-up
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateFollowUp(lead)}
                        disabled={isGenerating}
                        className="text-xs text-dg-text/40 hover:text-dg-rose transition-colors font-[family-name:var(--font-body)] flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        Regenerate
                      </button>
                      <button
                        onClick={() => handleCopy(lead.id, followUpMessage)}
                        className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-dg-cream text-dg-text/60 hover:text-dg-rose transition-colors font-[family-name:var(--font-body)]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bg-dg-cream/40 border border-dg-cream-mid/40 rounded-xl px-4 py-3">
                    <p className="text-sm text-dg-text/70 font-[family-name:var(--font-body)] leading-relaxed whitespace-pre-wrap">
                      {followUpMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status actions + delete */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5 flex-wrap">
                {(["new", "contacted", "converted", "closed"] as Lead["status"][]).map(
                  (s) =>
                    s !== lead.status && (
                      <button
                        key={s}
                        onClick={() => updateLeadStatus(lead.id, s)}
                        className="text-xs px-3 py-1 rounded-lg bg-dg-cream text-dg-text/50 hover:text-dg-rose hover:bg-dg-pink/10 transition-colors font-[family-name:var(--font-body)]"
                      >
                        Mark {STATUS_LABELS[s]}
                      </button>
                    )
                )}
              </div>
              <button
                onClick={() => handleDeleteLead(lead.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 font-[family-name:var(--font-body)]"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dg-cream/40">
      {/* Top bar */}
      <header className="bg-white border-b border-dg-cream-mid/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="font-[family-name:var(--font-heading)] text-xl text-dg-dark"
            >
              Desert Glow
            </a>
            <span className="text-[10px] bg-dg-pink/10 text-dg-rose px-2 py-0.5 rounded-full uppercase tracking-wider font-[family-name:var(--font-body)]">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Demo data controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { seedDemoData(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dg-text/50 hover:text-dg-rose hover:bg-dg-pink/8 transition-colors font-[family-name:var(--font-body)]"
                title="Load demo data"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Load Demo</span>
              </button>
              <button
                onClick={() => { clearDemoData(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dg-text/40 hover:text-red-400 hover:bg-red-50 transition-colors font-[family-name:var(--font-body)]"
                title="Clear all data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>

            <div className="w-px h-5 bg-dg-cream-mid/60" />

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-dg-pink/20 flex items-center justify-center">
                <User className="w-4 h-4 text-dg-rose" />
              </div>
              <span className="text-sm text-dg-text/70 font-[family-name:var(--font-body)]">
                {user.name}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-dg-text/40 hover:text-dg-rose transition-colors p-2"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dg-pink/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-dg-rose" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-dg-dark font-[family-name:var(--font-body)]">
                  {todayAppointments.length}
                </p>
                <p className="text-xs text-dg-text/40 font-[family-name:var(--font-body)]">Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dg-pink/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-dg-rose" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-dg-dark font-[family-name:var(--font-body)]">
                  {thisWeekCount}
                </p>
                <p className="text-xs text-dg-text/40 font-[family-name:var(--font-body)]">This Week</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dg-pink/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-dg-rose" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-dg-dark font-[family-name:var(--font-body)]">
                  {upcomingAppointments.length}
                </p>
                <p className="text-xs text-dg-text/40 font-[family-name:var(--font-body)]">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dg-pink/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-dg-rose" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-dg-dark font-[family-name:var(--font-body)]">
                  {uniqueEmails.size}
                </p>
                <p className="text-xs text-dg-text/40 font-[family-name:var(--font-body)]">Clients</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dg-pink/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-dg-rose" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-dg-dark font-[family-name:var(--font-body)]">
                  {newLeadsCount}
                </p>
                <p className="text-xs text-dg-text/40 font-[family-name:var(--font-body)]">New Leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit flex-wrap">
          {(
            [
              { key: "today", label: "Today" },
              { key: "calendar", label: "Calendar" },
              { key: "all", label: "All Appointments" },
              {
                key: "leads",
                label: `Leads${leads.length > 0 ? ` (${leads.length})` : ""}`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm transition-all font-[family-name:var(--font-body)] ${
                view === tab.key
                  ? "bg-dg-pink text-white shadow-sm"
                  : "text-dg-text/50 hover:text-dg-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Today view */}
        {view === "today" && (
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl text-dg-dark mb-4">
              {format(new Date(), "EEEE, MMMM d")}
            </h2>

            {/* Morning briefing — only shown when there's overnight activity to report */}
            {(overnightLeads.length > 0 || overnightAppts.length > 0) && (
              <div className="bg-gradient-to-r from-dg-pink/8 via-dg-cream/60 to-transparent rounded-2xl border border-dg-pink/15 p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dg-pink/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-dg-rose" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-heading)] text-dg-dark text-lg leading-tight">
                      {greeting}, Pam.
                    </h3>
                    <p className="text-sm text-dg-text/60 mt-1 font-[family-name:var(--font-body)]">
                      {[
                        overnightLeads.length > 0 &&
                          `Sofia captured ${overnightLeads.length} ${overnightLeads.length === 1 ? "lead" : "leads"}`,
                        overnightAppts.length > 0 &&
                          `booked ${overnightAppts.length} ${overnightAppts.length === 1 ? "appointment" : "appointments"}`,
                      ]
                        .filter(Boolean)
                        .join(" and ")}{" "}
                      after hours while you were away.
                    </p>
                    {overnightLeads.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {overnightLeads.map((lead) => (
                          <li key={lead.id} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-dg-rose/40 flex-shrink-0" />
                            <p className="text-xs text-dg-text/60 font-[family-name:var(--font-body)]">
                              <span className="font-medium text-dg-dark">
                                {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Anonymous"}
                              </span>
                              {lead.interestedServices.length > 0 && (
                                <span className="text-dg-text/40"> — {lead.interestedServices[0]}</span>
                              )}
                              <span className="text-dg-text/30 ml-2">
                                {format(new Date(lead.createdAt), "h:mm a")}
                              </span>
                            </p>
                          </li>
                        ))}
                        {overnightAppts.map((appt) => (
                          <li key={appt.id} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-dg-pink/60 flex-shrink-0" />
                            <p className="text-xs text-dg-text/60 font-[family-name:var(--font-body)]">
                              <span className="font-medium text-dg-dark">
                                {appt.firstName} {appt.lastName}
                              </span>
                              <span className="text-dg-text/40"> — {appt.service}</span>
                              <span className="text-dg-text/30 ml-2">
                                {format(new Date(appt.createdAt), "h:mm a")}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {appointments.length === 0 && leads.length === 0 ? (
              <div className="bg-white rounded-2xl p-14 text-center shadow-sm border border-dg-cream-mid/40">
                <div className="w-14 h-14 rounded-2xl bg-dg-pink/10 flex items-center justify-center mx-auto mb-5">
                  <Database className="w-7 h-7 text-dg-rose/50" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl text-dg-dark mb-2">
                  No data yet
                </h3>
                <p className="text-dg-text/40 font-[family-name:var(--font-body)] text-sm max-w-xs mx-auto mb-6">
                  Load the demo dataset to see what the dashboard looks like with real appointments and overnight leads.
                </p>
                <button
                  onClick={() => seedDemoData()}
                  className="inline-flex items-center gap-2 bg-dg-pink text-white px-6 py-3 rounded-full text-sm hover:bg-dg-rose-hover transition-colors font-[family-name:var(--font-body)]"
                >
                  <Database className="w-4 h-4" />
                  Load Demo Data
                </button>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <CalendarDays className="w-12 h-12 text-dg-text/20 mx-auto mb-4" />
                <p className="text-dg-text/40 font-[family-name:var(--font-body)]">
                  No appointments scheduled for today.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((a) => (
                  <AppointmentCard key={a.id} appt={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar view */}
        {view === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{ booked: "rdp-day--booked" }}
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
                  nav: "flex items-center justify-between mb-2",
                  button_previous:
                    "p-1.5 rounded-full hover:bg-dg-cream transition-colors",
                  button_next:
                    "p-1.5 rounded-full hover:bg-dg-cream transition-colors",
                  chevron: "w-4 h-4 text-dg-rose",
                }}
              />
              <style jsx global>{`
                .rdp-day--booked .rdp-day_button::after {
                  content: "";
                  display: block;
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background: #c99b9d;
                  margin: -2px auto 0;
                }
              `}</style>
            </div>

            <div className="lg:col-span-2">
              {!selectedDate ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <CalendarDays className="w-12 h-12 text-dg-text/20 mx-auto mb-4" />
                  <p className="text-dg-text/40 font-[family-name:var(--font-body)]">
                    Select a date to view appointments.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl text-dg-dark mb-4">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h3>
                  {calendarAppointments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                      <p className="text-dg-text/40 font-[family-name:var(--font-body)]">
                        No appointments on this date.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {calendarAppointments.map((a) => (
                        <AppointmentCard key={a.id} appt={a} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All appointments view */}
        {view === "all" && (
          <div>
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dg-text/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, or service..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm shadow-sm font-[family-name:var(--font-body)]"
              />
            </div>

            {allSorted.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <CalendarDays className="w-12 h-12 text-dg-text/20 mx-auto mb-4" />
                <p className="text-dg-text/40 font-[family-name:var(--font-body)]">
                  {searchQuery
                    ? "No appointments match your search."
                    : "No appointments yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allSorted.map((a) => (
                  <AppointmentCard key={a.id} appt={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leads view */}
        {view === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl text-dg-dark">
                  Potential Leads
                </h2>
                <p className="text-sm text-dg-text/50 mt-1 font-[family-name:var(--font-body)]">
                  Visitors who showed interest via the AI chat assistant
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-dg-text/40 bg-white rounded-xl px-3 py-2 shadow-sm font-[family-name:var(--font-body)]">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                Contact info &amp; service interests only — no PHI stored
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <UserPlus className="w-12 h-12 text-dg-text/20 mx-auto mb-4" />
                <p className="text-dg-text/40 font-[family-name:var(--font-body)]">
                  No leads yet. They appear here when the chat assistant captures a
                  potential client.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...leads]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )
                  .map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

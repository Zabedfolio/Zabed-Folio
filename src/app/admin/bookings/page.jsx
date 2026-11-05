"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineVideoCamera,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineExternalLink,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineChatAlt2,
} from "react-icons/hi";

function formatDateTimeDhaka(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

function formatTimeOnlyDhaka(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return "";
  }
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  // State
  const [stats, setStats] = useState({ upcoming: 0, today: 0, total: 0, cancelled: 0 });
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [filter, setFilter] = useState("upcoming");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings/stats");
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch booking stats:", err);
    }
  }, [router]);

  // Fetch bookings list
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        filter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();

      const list = Array.isArray(data.bookings)
        ? data.bookings
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setBookings(list);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total ?? (data.total ?? list.length),
        totalPages: data.pagination?.totalPages ?? (data.totalPages ?? 1),
      }));
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page, pagination.limit, searchTerm, router]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Sync with Cal.com API
  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/bookings/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setSyncMessage({ type: "success", text: data.message || "Synced successfully!" });
      await Promise.all([fetchStats(), fetchBookings()]);
    } catch (err) {
      setSyncMessage({ type: "error", text: err.message || "Sync failed" });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const statusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "confirmed" || s === "accepted") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Confirmed
        </span>
      );
    }
    if (s === "rescheduled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Rescheduled
        </span>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-700 border border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Cancelled
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-700 border border-gray-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/5 text-black/70 border border-black/10">
        {status || "Unknown"}
      </span>
    );
  };

  // Helper to extract "What is this meeting about?" from payload or document
  const getMeetingPurpose = (booking) => {
    if (!booking) return "";
    return (
      booking.meetingAbout ||
      booking.rawPayload?.bookingFieldsResponses?.title ||
      booking.rawPayload?.responses?.title?.value ||
      booking.rawPayload?.responses?.title ||
      booking.rawPayload?.responses?.["what-is-this-meeting-about"]?.value ||
      booking.rawPayload?.responses?.["what-is-this-meeting-about"] ||
      ""
    );
  };

  const getAdditionalNotes = (booking) => {
    if (!booking) return "";
    return (
      booking.notes ||
      booking.rawPayload?.bookingFieldsResponses?.notes ||
      booking.rawPayload?.responses?.notes?.value ||
      booking.rawPayload?.responses?.notes ||
      booking.rawPayload?.additionalNotes ||
      ""
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              Bookings & Meetings
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#12A36B]/10 text-[#12A36B] border border-[#12A36B]/20">
              Cal.com Live
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-black/50">
            Real-time appointments, automated sync, and attendee details. Displaying in Asia/Dhaka time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://cal.com/zabed-mahmud/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-black/10 bg-white hover:bg-black/4 text-xs font-semibold text-black/70 hover:text-[#1a1a1a] shadow-sm transition"
          >
            <span>Open Cal.com</span>
            <HiOutlineExternalLink className="text-sm" />
          </a>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#12A36B] hover:bg-[#0f8c5b] text-white text-xs font-bold shadow-sm shadow-[#12A36B]/20 transition disabled:opacity-50"
          >
            <HiOutlineRefresh className={`text-sm ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Cal.com"}</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      {syncMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium border flex items-center justify-between ${
            syncMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
              : "bg-red-500/10 text-red-800 border-red-500/20"
          }`}
        >
          <span>{syncMessage.text}</span>
          <button onClick={() => setSyncMessage(null)} className="text-sm font-bold opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Upcoming</span>
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <HiOutlineCalendar className="text-lg" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">{stats.upcoming}</span>
            <p className="text-[11px] text-black/40 mt-0.5">Scheduled from now</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Today</span>
            <span className="p-2.5 rounded-2xl bg-[#12A36B]/10 text-[#12A36B]">
              <HiOutlineClock className="text-lg" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">{stats.today}</span>
            <p className="text-[11px] text-black/40 mt-0.5">Dhaka time window</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Total Booked</span>
            <span className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600">
              <HiOutlineCheckCircle className="text-lg" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">{stats.total}</span>
            <p className="text-[11px] text-black/40 mt-0.5">All-time appointments</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Cancelled</span>
            <span className="p-2.5 rounded-2xl bg-red-500/10 text-red-600">
              <HiOutlineXCircle className="text-lg" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">{stats.cancelled}</span>
            <p className="text-[11px] text-black/40 mt-0.5">Cancelled or rejected</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-3xl border border-black/8 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar: Filter Tabs & Search */}
        <div className="p-4 md:p-6 border-b border-black/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/4 border border-black/5 overflow-x-auto">
            {[
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
              { id: "cancelled", label: "Cancelled" },
              { id: "all", label: "All" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-white text-[#1a1a1a] shadow-sm"
                    : "text-black/50 hover:text-[#1a1a1a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-black/10 bg-black/2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12A36B]/30 text-xs font-medium placeholder:text-black/40 transition"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-black/4 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-600">
              <HiOutlineExclamation className="text-2xl" />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a]">{error}</p>
            <button
              onClick={fetchBookings}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-[#1a1a1a] transition"
            >
              <HiOutlineRefresh className="text-sm" />
              <span>Retry</span>
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="inline-flex p-4 rounded-3xl bg-black/4 text-black/40">
              <HiOutlineCalendar className="text-3xl" />
            </div>
            <h3 className="text-base font-bold text-[#1a1a1a]">No bookings found</h3>
            <p className="text-xs text-black/50 max-w-sm mx-auto">
              {searchTerm
                ? `No bookings matched "${searchTerm}". Try another search term.`
                : filter === "upcoming"
                ? "No upcoming bookings scheduled right now."
                : `No bookings found in the ${filter} filter.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/6 bg-black/2 text-[11px] font-bold text-black/50 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Attendee</th>
                    <th className="py-3.5 px-6">Meeting Time (Dhaka)</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6 text-xs">
                  {bookings.map((booking) => {
                    const startTimeDhaka = formatDateTimeDhaka(booking.startTime);
                    const endTimeDhaka = formatTimeOnlyDhaka(booking.endTime);

                    return (
                      <tr
                        key={booking.uid || booking._id}
                        className="hover:bg-black/2 transition-colors duration-150"
                      >
                        {/* Attendee */}
                        <td className="py-4 px-6 align-top">
                          <div className="font-bold text-[#1a1a1a] text-sm">{booking.attendeeName || "Guest"}</div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-black/60 font-mono">
                            <HiOutlineMail className="text-sm text-black/40 flex-shrink-0" />
                            <a href={`mailto:${booking.attendeeEmail}`} className="hover:underline">
                              {booking.attendeeEmail || "No email"}
                            </a>
                          </div>
                          {booking.attendeePhone && (
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-black/60 font-mono">
                              <HiOutlinePhone className="text-sm text-black/40 flex-shrink-0" />
                              <a href={`tel:${booking.attendeePhone}`} className="hover:underline">
                                {booking.attendeePhone}
                              </a>
                            </div>
                          )}
                        </td>

                        {/* Meeting Time */}
                        <td className="py-4 px-6 align-top whitespace-nowrap">
                          <div className="font-semibold text-sm text-[#1a1a1a]">
                            {startTimeDhaka}
                            {endTimeDhaka && <span className="text-black/40"> - {endTimeDhaka}</span>}
                          </div>
                          <div className="text-xs text-black/40 font-mono mt-1">
                            Attendee timezone: {booking.attendeeTimeZone || "Unknown"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 align-top text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {booking.meetingUrl &&
                              booking.status !== "cancelled" &&
                              booking.status !== "canceled" && (
                                <a
                                  href={booking.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12A36B]/10 hover:bg-[#12A36B]/20 text-[#12A36B] font-bold text-xs transition"
                                  title="Join Google Meet / Video call"
                                >
                                  <HiOutlineVideoCamera className="text-sm" />
                                  <span>Join</span>
                                </a>
                              )}
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 hover:bg-black/5 text-black/70 hover:text-[#1a1a1a] font-semibold text-xs transition"
                            >
                              <HiOutlineInformationCircle className="text-sm" />
                              <span>Details</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards View (Shown on screens < 768px) */}
            <div className="md:hidden divide-y divide-black/6 p-3 sm:p-4 space-y-3">
              {bookings.map((booking) => {
                const startTimeDhaka = formatDateTimeDhaka(booking.startTime);
                const endTimeDhaka = formatTimeOnlyDhaka(booking.endTime);
                const purpose = getMeetingPurpose(booking);

                return (
                  <div
                    key={booking.uid || booking._id}
                    className="p-4 rounded-2xl bg-black/2 border border-black/5 space-y-3"
                  >
                    {/* Header: Name & Time */}
                    <div className="space-y-1">
                      <div className="font-bold text-[#1a1a1a] text-sm">
                        {booking.attendeeName || "Guest"}
                      </div>
                      <div className="text-xs font-semibold text-black/80 flex items-center gap-1">
                        <HiOutlineCalendar className="text-sm text-[#12A36B] flex-shrink-0" />
                        <span>{startTimeDhaka}{endTimeDhaka ? ` - ${endTimeDhaka}` : ""}</span>
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="space-y-1 text-xs text-black/60 font-mono">
                      <div className="flex items-center gap-1.5 truncate">
                        <HiOutlineMail className="text-sm text-black/40 flex-shrink-0" />
                        <a href={`mailto:${booking.attendeeEmail}`} className="hover:underline truncate">
                          {booking.attendeeEmail}
                        </a>
                      </div>
                      {booking.attendeePhone && (
                        <div className="flex items-center gap-1.5">
                          <HiOutlinePhone className="text-sm text-black/40 flex-shrink-0" />
                          <a href={`tel:${booking.attendeePhone}`} className="hover:underline">
                            {booking.attendeePhone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Quick Topic preview if available */}
                    {purpose && (
                      <p className="text-xs text-black/60 italic line-clamp-1 bg-white/60 p-2 rounded-xl border border-black/5">
                        &quot;{purpose}&quot;
                      </p>
                    )}

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 pt-1">
                      {booking.meetingUrl &&
                        booking.status !== "cancelled" &&
                        booking.status !== "canceled" && (
                          <a
                            href={booking.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#12A36B] hover:bg-[#0f8c5b] text-white font-bold text-xs shadow-sm transition"
                          >
                            <HiOutlineVideoCamera className="text-sm" />
                            <span>Join Meeting</span>
                          </a>
                        )}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-[#1a1a1a] font-semibold text-xs transition"
                      >
                        <HiOutlineInformationCircle className="text-sm" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Footer */}
        {!loading && bookings.length > 0 && (
          <div className="p-4 md:px-6 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-black/50">
            <div>
              Showing <span className="font-bold text-[#1a1a1a]">{bookings.length}</span> of{" "}
              <span className="font-bold text-[#1a1a1a]">{pagination.total}</span> bookings
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl border border-black/10 bg-white hover:bg-black/4 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <HiOutlineChevronLeft className="text-sm" />
              </button>
              <span className="font-mono text-xs font-semibold px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-xl border border-black/10 bg-white hover:bg-black/4 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <HiOutlineChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-black/10 p-6 md:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-black/8 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#1a1a1a]">Booking Details</h3>
                  {statusBadge(selectedBooking.status)}
                </div>
                <p className="text-xs text-black/40 font-mono mt-1">UID: {selectedBooking.uid}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-2xl bg-black/4 hover:bg-black/8 text-black/60 hover:text-[#1a1a1a] transition"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-xs">
              {/* Meeting What is this about? (Topic / Purpose) */}
              <div className="p-4 rounded-2xl bg-[#12A36B]/5 border border-[#12A36B]/20 space-y-1.5">
                <div className="flex items-center gap-2 text-[#12A36B] font-bold text-xs uppercase tracking-wider">
                  <HiOutlineChatAlt2 className="text-base" />
                  <span>What is this meeting about?</span>
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a] whitespace-pre-wrap leading-relaxed pl-6">
                  {getMeetingPurpose(selectedBooking) || "Not specified by attendee"}
                </p>
              </div>

              {/* Time & Duration */}
              <div className="p-4 rounded-2xl bg-black/2 border border-black/5 space-y-2.5">
                <div className="font-bold text-sm text-[#1a1a1a]">{selectedBooking.title}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-black/70">
                  <div>
                    <span className="text-black/40 block">Time (Dhaka):</span>
                    <span className="font-semibold text-[#1a1a1a]">
                      {formatDateTimeDhaka(selectedBooking.startTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-black/40 block">Attendee Timezone:</span>
                    <span className="font-semibold text-[#1a1a1a]">
                      {selectedBooking.attendeeTimeZone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/2 border border-black/5">
                  <span className="text-black/40 block mb-1">Attendee Name</span>
                  <span className="text-sm font-bold text-[#1a1a1a]">
                    {selectedBooking.attendeeName || "Guest"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-black/2 border border-black/5">
                  <span className="text-black/40 block mb-1">Attendee Email</span>
                  <a
                    href={`mailto:${selectedBooking.attendeeEmail}`}
                    className="text-sm font-semibold text-[#12A36B] hover:underline"
                  >
                    {selectedBooking.attendeeEmail}
                  </a>
                </div>
                <div className="p-4 rounded-2xl bg-black/2 border border-black/5">
                  <span className="text-black/40 block mb-1">Phone Number</span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    {selectedBooking.attendeePhone || "Not provided"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-black/2 border border-black/5">
                  <span className="text-black/40 block mb-1">Cal.com Booking ID</span>
                  <span className="text-sm font-mono font-semibold text-[#1a1a1a]">
                    {selectedBooking.calBookingId || "N/A"}
                  </span>
                </div>
              </div>

              {/* Meeting Link & Location */}
              {selectedBooking.meetingUrl && (
                <div className="p-4 rounded-2xl bg-[#12A36B]/5 border border-[#12A36B]/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-[#12A36B]/10 text-[#12A36B]">
                      <HiOutlineVideoCamera className="text-xl" />
                    </span>
                    <div>
                      <div className="font-bold text-[#1a1a1a]">Google Meet / Video Link</div>
                      <a
                        href={selectedBooking.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#12A36B] hover:underline font-mono truncate block max-w-sm"
                      >
                        {selectedBooking.meetingUrl}
                      </a>
                    </div>
                  </div>
                  <a
                    href={selectedBooking.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#12A36B] hover:bg-[#0f8c5b] text-white font-bold text-xs transition"
                  >
                    Join Call
                  </a>
                </div>
              )}

              {/* Additional Notes (if provided and different from purpose) */}
              {getAdditionalNotes(selectedBooking) &&
                getAdditionalNotes(selectedBooking) !== getMeetingPurpose(selectedBooking) && (
                  <div className="p-4 rounded-2xl bg-black/2 border border-black/5 space-y-1">
                    <span className="text-black/40 font-semibold uppercase tracking-wider text-[10px]">
                      Additional Notes
                    </span>
                    <p className="text-black/80 whitespace-pre-wrap leading-relaxed">
                      {getAdditionalNotes(selectedBooking)}
                    </p>
                  </div>
                )}

              {/* Cancellation Reason if cancelled */}
              {selectedBooking.cancellationReason && (
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-1">
                  <span className="text-red-700 font-semibold uppercase tracking-wider text-[10px]">
                    Cancellation Reason
                  </span>
                  <p className="text-red-900 leading-relaxed">
                    {selectedBooking.cancellationReason}
                  </p>
                </div>
              )}

              {/* Raw JSON Debug (Collapsible) */}
              {selectedBooking.rawPayload && (
                <details className="p-4 rounded-2xl bg-black/2 border border-black/5 group">
                  <summary className="font-semibold text-black/50 cursor-pointer hover:text-[#1a1a1a] transition">
                    View Raw Webhook Payload
                  </summary>
                  <pre className="mt-3 p-3 rounded-xl bg-black/5 overflow-x-auto text-[10px] font-mono text-black/70 max-h-48">
                    {JSON.stringify(selectedBooking.rawPayload, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/8">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl border border-black/10 bg-white hover:bg-black/4 text-xs font-semibold text-black/70 hover:text-[#1a1a1a] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

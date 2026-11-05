import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "CAL_API_KEY is not configured on the server. Please add it to your environment variables." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://api.cal.com/v2/bookings", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Cal.com API sync failed:", response.status, errText);
      return NextResponse.json(
        { error: `Cal.com API returned ${response.status}: ${errText}` },
        { status: response.status }
      );
    }

    const json = await response.json();
    const bookingsList = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.bookings)
      ? json.bookings
      : Array.isArray(json)
      ? json
      : [];

    const db = await getDb();
    const col = db.collection("bookings");

    let syncedCount = 0;

    for (const b of bookingsList) {
      const uid = b.uid || String(b.id);
      if (!uid) continue;

      const attendees = Array.isArray(b.attendees) ? b.attendees : [];
      const primaryAttendee = attendees[0] || {};
      const responses = b.responses || {};
      const bookingFieldsResponses = b.bookingFieldsResponses || {};

      const attendeeName =
        primaryAttendee.name ||
        bookingFieldsResponses.name ||
        responses.name?.value ||
        responses.name ||
        b.name ||
        "Guest";

      const attendeeEmail =
        primaryAttendee.email ||
        bookingFieldsResponses.email ||
        responses.email?.value ||
        responses.email ||
        b.email ||
        "";

      const attendeePhone =
        primaryAttendee.phoneNumber ||
        bookingFieldsResponses.phone ||
        responses.phone?.value ||
        responses.phone ||
        responses.phoneNumber?.value ||
        responses.phoneNumber ||
        "";

      const attendeeTimeZone =
        primaryAttendee.timeZone ||
        b.timeZone ||
        "Asia/Dhaka";

      const meetingAbout =
        bookingFieldsResponses.title ||
        responses.title?.value ||
        responses.title ||
        bookingFieldsResponses["what-is-this-meeting-about"] ||
        responses["what-is-this-meeting-about"]?.value ||
        responses["what-is-this-meeting-about"] ||
        responses["What is this meeting about?"]?.value ||
        responses["What is this meeting about?"] ||
        "";

      const notes =
        b.additionalNotes ||
        bookingFieldsResponses.notes ||
        responses.notes?.value ||
        responses.notes ||
        responses["additional-notes"]?.value ||
        responses["additional-notes"] ||
        responses["Project details"]?.value ||
        responses["Project details"] ||
        b.description ||
        "";

      const meetingUrl =
        b.metadata?.videoCallUrl ||
        b.videoCallData?.url ||
        (typeof b.location === "string" && b.location.startsWith("http") ? b.location : "");

      const startTime = b.startTime ? new Date(b.startTime) : b.start ? new Date(b.start) : new Date();
      const endTime = b.endTime ? new Date(b.endTime) : b.end ? new Date(b.end) : new Date(startTime.getTime() + 30 * 60000);

      const statusMap = {
        accepted: "confirmed",
        confirmed: "confirmed",
        rescheduled: "rescheduled",
        cancelled: "cancelled",
        canceled: "cancelled",
        rejected: "rejected",
      };
      const rawStatus = (b.status || "confirmed").toLowerCase();
      const status = statusMap[rawStatus] || "confirmed";

      await col.findOneAndUpdate(
        { uid },
        {
          $set: {
            uid,
            calBookingId: b.id ? Number(b.id) : null,
            title: b.title || "30min Consultation",
            meetingAbout: String(meetingAbout).trim(),
            status,
            startTime,
            endTime,
            attendeeName: String(attendeeName).trim(),
            attendeeEmail: String(attendeeEmail).trim().toLowerCase(),
            attendeePhone: String(attendeePhone).trim(),
            attendeeTimeZone: String(attendeeTimeZone).trim(),
            notes: String(notes).trim(),
            meetingUrl: meetingUrl || "",
            location: b.location || "Google Meet",
            updatedAt: new Date(),
            rawPayload: b,
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      syncedCount++;
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      totalFetched: bookingsList.length,
    });
  } catch (err) {
    console.error("POST /api/admin/bookings/sync error:", err);
    return NextResponse.json({ error: "Failed to sync bookings from Cal.com" }, { status: 500 });
  }
}


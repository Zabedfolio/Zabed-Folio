import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * Ensures required indexes exist on the 'bookings' collection.
 * Runs once per server instance or lazily on first webhook invocation.
 */
let indexesCreated = false;
async function ensureBookingIndexes(db) {
  if (indexesCreated) return;
  try {
    const col = db.collection("bookings");
    await Promise.all([
      col.createIndex({ uid: 1 }, { unique: true }),
      col.createIndex({ startTime: 1 }),
      col.createIndex({ attendeeEmail: 1 }),
      col.createIndex({ status: 1 }),
      col.createIndex({ createdAt: -1 }),
      col.createIndex({ attendeeName: "text", attendeeEmail: "text", notes: "text" }),
    ]);
    indexesCreated = true;
  } catch (err) {
    console.error("Error creating booking collection indexes:", err.message);
  }
}

/**
 * Normalizes Cal.com webhook payload into our standard Booking schema.
 */
function extractBookingData(payload, statusOverride) {
  const attendees = Array.isArray(payload?.attendees) ? payload.attendees : [];
  const primaryAttendee = attendees[0] || {};
  const responses = payload?.responses || {};
  const bookingFieldsResponses = payload?.bookingFieldsResponses || {};

  const attendeeName =
    primaryAttendee.name ||
    bookingFieldsResponses.name ||
    responses.name?.value ||
    responses.name ||
    payload?.name ||
    "Guest";

  const attendeeEmail =
    primaryAttendee.email ||
    bookingFieldsResponses.email ||
    responses.email?.value ||
    responses.email ||
    payload?.email ||
    "";

  const attendeePhone =
    primaryAttendee.phoneNumber ||
    bookingFieldsResponses.phone ||
    responses.phone?.value ||
    responses.phone ||
    responses.phoneNumber?.value ||
    responses.phoneNumber ||
    payload?.phoneNumber ||
    "";

  const attendeeTimeZone =
    primaryAttendee.timeZone ||
    payload?.timeZone ||
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
    payload?.additionalNotes ||
    bookingFieldsResponses.notes ||
    responses.notes?.value ||
    responses.notes ||
    responses["additional-notes"]?.value ||
    responses["additional-notes"] ||
    responses["Project details"]?.value ||
    responses["Project details"] ||
    payload?.description ||
    "";

  // Resolution for Google Meet / meeting url
  let meetingUrl =
    payload?.metadata?.videoCallUrl ||
    payload?.videoCallData?.url ||
    null;

  if (!meetingUrl && typeof payload?.location === "string" && payload.location.startsWith("http")) {
    meetingUrl = payload.location;
  }

  const location = payload?.location || "Google Meet";

  const startTime = payload?.startTime ? new Date(payload.startTime) : new Date();
  const endTime = payload?.endTime ? new Date(payload.endTime) : new Date(startTime.getTime() + 30 * 60000);

  return {
    uid: String(payload?.uid || payload?.id),
    calBookingId: payload?.id ? Number(payload.id) : null,
    title: payload?.title || payload?.eventTitle || "30min Consultation",
    meetingAbout: String(meetingAbout).trim(),
    status: statusOverride,
    startTime,
    endTime,
    attendeeName: String(attendeeName).trim(),
    attendeeEmail: String(attendeeEmail).trim().toLowerCase(),
    attendeePhone: String(attendeePhone).trim(),
    attendeeTimeZone: String(attendeeTimeZone).trim(),
    notes: String(notes).trim(),
    meetingUrl: meetingUrl || "",
    location: String(location),
    rescheduleUid: payload?.rescheduleUid ? String(payload.rescheduleUid) : null,
    cancellationReason: payload?.cancellationReason || payload?.rejectionReason || null,
    updatedAt: new Date(),
  };
}

export async function POST(request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;

  if (!secret) {
    console.error("FATAL: CAL_WEBHOOK_SECRET is not configured in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error: CAL_WEBHOOK_SECRET is missing." },
      { status: 500 }
    );
  }

  // 1. Read raw body as text for HMAC verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-cal-signature-256");

  if (!signature) {
    console.warn("Cal.com webhook rejected: Missing x-cal-signature-256 header.");
    return NextResponse.json({ error: "Missing signature header." }, { status: 401 });
  }

  // 2. Compute HMAC-SHA256 signature and verify with timingSafeEqual
  try {
    const computedHmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const sigBuffer = Buffer.from(signature, "hex");
    const compBuffer = Buffer.from(computedHmac, "hex");

    if (sigBuffer.length !== compBuffer.length || !crypto.timingSafeEqual(sigBuffer, compBuffer)) {
      console.warn("Cal.com webhook rejected: Signature mismatch.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } catch (err) {
    console.error("Error during signature verification:", err.message);
    return NextResponse.json({ error: "Signature verification failed." }, { status: 401 });
  }

  // 3. Parse JSON payload
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (err) {
    console.error("Failed to parse Cal.com webhook JSON:", err.message);
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const triggerEvent = (data?.triggerEvent || "").toUpperCase();
  const payload = data?.payload || data;

  // Cal.com Ping Test / Unknown triggers
  if (!triggerEvent || triggerEvent === "PING") {
    return NextResponse.json({ received: true, message: "Ping verified." }, { status: 200 });
  }

  const db = await getDb();
  await ensureBookingIndexes(db);
  const bookingsCol = db.collection("bookings");

  const uid = payload?.uid ? String(payload.uid) : payload?.id ? String(payload.id) : null;
  if (!uid) {
    console.warn("Received Cal.com event without a booking UID:", triggerEvent);
    return NextResponse.json({ received: true, warning: "Missing booking UID." }, { status: 200 });
  }

  try {
    switch (triggerEvent) {
      case "BOOKING_CREATED": {
        const bookingData = extractBookingData(payload, "confirmed");
        await bookingsCol.findOneAndUpdate(
          { uid },
          {
            $set: { ...bookingData, rawPayload: payload },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true, returnDocument: "after" }
        );
        break;
      }

      case "BOOKING_RESCHEDULED": {
        const newBookingData = extractBookingData(payload, "confirmed");
        // Upsert the new booking slot
        await bookingsCol.findOneAndUpdate(
          { uid },
          {
            $set: { ...newBookingData, rawPayload: payload },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true, returnDocument: "after" }
        );

        // If rescheduleUid is provided, update previous booking to 'rescheduled'
        if (payload?.rescheduleUid) {
          await bookingsCol.updateOne(
            { uid: String(payload.rescheduleUid) },
            {
              $set: {
                status: "rescheduled",
                updatedAt: new Date(),
              },
            }
          );
        }
        break;
      }

      case "BOOKING_CANCELLED":
      case "BOOKING_CANCELED": {
        const reason = payload?.cancellationReason || "No cancellation reason provided";
        await bookingsCol.updateOne(
          { uid },
          {
            $set: {
              status: "cancelled",
              cancellationReason: reason,
              updatedAt: new Date(),
            },
          }
        );
        break;
      }

      case "BOOKING_REJECTED": {
        const reason = payload?.rejectionReason || "No rejection reason provided";
        await bookingsCol.updateOne(
          { uid },
          {
            $set: {
              status: "rejected",
              cancellationReason: reason,
              updatedAt: new Date(),
            },
          }
        );
        break;
      }

      default:
        console.log(`Cal.com webhook: Ignored unhandled trigger [${triggerEvent}]`);
        break;
    }

    return NextResponse.json({ received: true, triggerEvent, uid }, { status: 200 });
  } catch (err) {
    console.error(`Database error handling Cal.com trigger [${triggerEvent}]:`, err.message);
    // Return 200 to acknowledge webhook so Cal.com doesn't needlessly spam retries on non-fatal DB errors
    return NextResponse.json({ received: true, error: err.message }, { status: 200 });
  }
}


import { NextResponse } from "next/server";
import db from "../../../../db.json";

const JSON_SERVER_URL = process.env.PROJECTS_API_URL || "http://127.0.0.1:4000/projects";
const REQUEST_TIMEOUT_MS = 3500;

async function fetchProjectsFromJsonServer() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(JSON_SERVER_URL, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Bad response from json-server");
    return await response.json();
  } catch {
    return null; // ← always return null on any failure
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const projects = await fetchProjectsFromJsonServer();
  // If json-server failed for ANY reason, use the static fallback
  return NextResponse.json(projects ?? db.projects);
}
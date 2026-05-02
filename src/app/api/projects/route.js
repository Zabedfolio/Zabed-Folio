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
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Failed to read from json-server");
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    const projects = await fetchProjectsFromJsonServer();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(db.projects);
  }
}
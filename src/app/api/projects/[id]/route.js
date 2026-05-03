import { NextResponse } from "next/server";
import db from "../../../../../db.json";

const JSON_SERVER_URL = process.env.PROJECTS_API_URL || "http://127.0.0.1:4000/projects";
const REQUEST_TIMEOUT_MS = 3500;

async function fetchProjectFromJsonServer(id) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${JSON_SERVER_URL}?id=${encodeURIComponent(id)}`, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Bad response from json-server");
    const projects = await response.json();
    return projects[0] ?? null;
  } catch {
    return null; // ← always return null on any failure
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(_request, { params }) {
  const { id } = await params;
  const normalizedId = decodeURIComponent(id || "").toLowerCase();
  const project =
    (await fetchProjectFromJsonServer(normalizedId)) ??
    db.projects.find((p) => String(p.id).toLowerCase() === normalizedId) ??
    null;

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}
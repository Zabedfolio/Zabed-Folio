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
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Failed to read from json-server");
    }

    const projects = await response.json();
    return projects[0] || null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(_request, { params }) {
  const normalizedId = decodeURIComponent(params.id || "").toLowerCase();

  try {
    const project = await fetchProjectFromJsonServer(normalizedId);

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch {
    const fallbackProject = db.projects.find(
      (project) => String(project.id).toLowerCase() === normalizedId
    );

    if (!fallbackProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(fallbackProject);
  }
}
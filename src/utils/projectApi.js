const REQUEST_TIMEOUT_MS = 5000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to fetch project data.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out while loading projects.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchProjects() {
  return fetchWithTimeout("/api/projects");
}

export async function fetchProjectById(id) {
  const normalizedId = encodeURIComponent(String(id || "").trim().toLowerCase());
  return fetchWithTimeout(`/api/projects/${normalizedId}`);
}

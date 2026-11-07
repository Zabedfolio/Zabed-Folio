import { getDb } from "@/lib/mongodb";
import { fallbackProjects } from "@/data/fallbackProjects";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zabedmahmud.com";
  const now = new Date();

  // Static core routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/30-min`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/case-study/neighbornotes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic project routes
  let projectRoutes = [];
  try {
    const db = await getDb();
    const projects = await db
      .collection("projects")
      .find({})
      .toArray();

    const list = projects && projects.length > 0 ? projects : fallbackProjects;
    projectRoutes = list.map((p) => ({
      url: `${baseUrl}/projects/${p.id || p._id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.75,
    }));
  } catch {
    projectRoutes = fallbackProjects.map((p) => ({
      url: `${baseUrl}/projects/${p.id || p._id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    }));
  }

  return [...staticRoutes, ...projectRoutes];
}

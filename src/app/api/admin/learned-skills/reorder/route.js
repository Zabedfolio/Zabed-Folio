import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("learnedSkills");

export async function PUT(request) {
  return REORDER(request);
}

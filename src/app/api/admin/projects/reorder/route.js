import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("projects");

export async function PUT(request) {
  return REORDER(request);
}

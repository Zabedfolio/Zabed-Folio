import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("experience");

export async function PUT(request) {
  return REORDER(request);
}

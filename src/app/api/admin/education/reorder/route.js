import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("education");

export async function PUT(request) {
  return REORDER(request);
}

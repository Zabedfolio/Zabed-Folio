import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("process");

export async function PUT(request) {
  return REORDER(request);
}

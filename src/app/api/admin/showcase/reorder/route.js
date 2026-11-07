import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("showcase");

export async function PUT(request) {
  return REORDER(request);
}


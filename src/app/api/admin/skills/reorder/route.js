import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("skills");

export async function PUT(request) {
  return REORDER(request);
}

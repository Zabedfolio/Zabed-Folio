import { createAdminRoutes } from "@/lib/admin-route-factory";

const { REORDER } = createAdminRoutes("caseStudies");

export async function PUT(request) {
  return REORDER(request);
}

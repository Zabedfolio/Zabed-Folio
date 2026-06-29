import { createAdminRoutes } from "@/lib/admin-route-factory";

const { GET, POST } = createAdminRoutes("experience");
export { GET, POST };

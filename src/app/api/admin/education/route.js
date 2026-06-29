import { createAdminRoutes } from "@/lib/admin-route-factory";

const { GET, POST } = createAdminRoutes("education");
export { GET, POST };

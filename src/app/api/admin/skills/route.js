import { createAdminRoutes } from "@/lib/admin-route-factory";

const { GET, POST } = createAdminRoutes("skills");
export { GET, POST };

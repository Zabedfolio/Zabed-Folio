import { createAdminRoutes } from "@/lib/admin-route-factory";

const { GET, POST } = createAdminRoutes("processSteps");
export { GET, POST };

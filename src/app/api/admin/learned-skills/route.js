import { createAdminRoutes } from "@/lib/admin-route-factory";

const { GET, POST } = createAdminRoutes("learnedSkills");
export { GET, POST };

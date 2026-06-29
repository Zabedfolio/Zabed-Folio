import { createAdminRoutes } from "@/lib/admin-route-factory";

const { PUT_ONE, DELETE_ONE } = createAdminRoutes("processSteps");

export async function PUT(request, { params }) {
  const { id } = await params;
  return PUT_ONE(request, id);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  return DELETE_ONE(request, id);
}

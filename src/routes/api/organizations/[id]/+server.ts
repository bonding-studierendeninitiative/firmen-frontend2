import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	validateRequestSignature(event);

	const organizationId = event.params.id; // This is to ensure the route is correctly set up for the organization ID

	const db = new PrismaClient();

	const organization = await db.organization.findUnique({
		where: { id: organizationId }
	});

	return json({ organization }, { status: 200 });
}

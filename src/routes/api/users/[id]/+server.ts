import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	validateRequestSignature(event);

	const userId = event.params.id; // This is to ensure the route is correctly set up for the user ID

	const db = new PrismaClient();

	const user = await db.user.findUnique({
		where: { id: userId }
	});

	return json({ user }, { status: 200 });
}

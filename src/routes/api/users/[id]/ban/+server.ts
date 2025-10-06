import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	validateRequestSignature(event);

	const userId = event.params.id; // This is to ensure the route is correctly set up for the user ID

	const { reason } = await event.request.json();

	const db = new PrismaClient();

	const user = await db.user.update({
		where: { id: userId },
		data: {
			banned: true,
			banReason: reason
		}
	});

	return json({ user }, { status: 200 });
}

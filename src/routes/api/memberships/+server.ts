import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	validateRequestSignature(event);

	const request = event.url.searchParams;

	const userId = request.get('userId');

	if (!userId) throw error(400, 'No userId provided!');

	const db = new PrismaClient();

	const memberships = await db.member.findMany({
		where: {
			userId
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
					id: true,
					image: true
				}
			},
			organization: {
				select: {
					id: true,
					name: true,
					logo: true
				}
			}
		}
	});

	return json({ memberships }, { status: 200 });
}

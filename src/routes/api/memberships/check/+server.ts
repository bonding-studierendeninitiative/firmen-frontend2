import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	validateRequestSignature(event);

	const request = await event.request.json();

	const { userId, organizationId } = request;

	if (!userId) throw error(400, 'No userId provided!');

	const db = new PrismaClient();

	const membership = await db.member.findFirst({
		where: {
			userId,
			organizationId
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
					logo: true,
					slug: true
				}
			}
		}
	});

	if (!membership) {
		throw error(404, 'Membership not found for the provided userId and organizationId');
	}

	return json({ membership }, { status: 200 });
}

import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { json } from '@sveltejs/kit';

export async function GET(event) {
	// 1. Authenticate the webhook
	validateRequestSignature(event);

	const db = new PrismaClient();

	const organizations = await db.organization.findMany();

	return json({ organizations }, { status: 200 });
}

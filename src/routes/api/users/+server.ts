import { validateRequestSignature } from '@/utils/signature';
import { PrismaClient } from '@prisma-app/client/client';
import { json } from '@sveltejs/kit';

export async function GET(event) {
	validateRequestSignature(event);

	const db = new PrismaClient();

	const users = await db.user.findMany();

	return json({ users }, { status: 200 });
}

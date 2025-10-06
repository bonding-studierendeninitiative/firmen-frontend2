import { PrismaClient } from '@prisma-app/client';
const prisma = new PrismaClient();
async function main() {
	const bondingOrg = await prisma.organization.upsert({
		where: { id: 'bonding' },
		update: {},
		create: {
			id: 'bonding',
			name: 'bonding-studierendeninitiative e. V.',
			slug: 'bonding',
			metadata: JSON.stringify({
				public: {
					name: 'bonding-studierendeninitiative e. V.',
					slug: 'bonding'
				}
			}),
			createdAt: new Date()
		}
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

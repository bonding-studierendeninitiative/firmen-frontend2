import { query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { string } from 'valibot';

export const getOrgMemberships = query(string(), async (userId) => {
	const ctx = await createAdminContext();
	return await ctx.db.member.findMany({
		where: {
			userId
		},
		include: {
			organization: true
		}
	});
});

export type GetOrgMembershipsResponse = Awaited<ReturnType<typeof getOrgMemberships>>;

export const getUser = query(string(), async (userId) => {
	const ctx = await createAdminContext();
	return await ctx.db.user.findUnique({
		where: {
			id: userId
		}
	});
});

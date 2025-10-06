import { query } from '$app/server';
import { object, string, number, boolean, union, literal, nullish } from 'valibot';
import { createAdminContext } from '@/trpc/server';

export const getUsers = query(
	object({
		query: string(),
		page: nullish(number(), 0),
		limit: nullish(number(), 10),
		includeMembers: nullish(boolean(), false),
		sortBy: nullish(
			union([
				literal('name'),
				literal('createdAt'),
				literal('members'),
				literal('role'),
				literal('email')
			]),
			'name'
		),
		sortDirection: nullish(union([literal('asc'), literal('desc')]), 'asc')
	}),
	async ({ includeMembers, limit, page, sortBy, query, sortDirection }) => {
		const ctx = await createAdminContext();
		const users = await ctx.db.user.findMany({
			where: {
				name: {
					contains: query
				}
			},
			include: {
				members: includeMembers
					? {
							select: {
								id: true,
								organizationId: true,
								userId: true,
								role: true
							}
						}
					: false
			},
			orderBy: {
				[sortBy]: sortDirection
			},
			skip: page * limit,
			take: limit
		});
		return {
			data: users,
			totalCount: users.length,
			page: page,
			limit: limit
		};
	}
);

export type UsersResponse = Awaited<ReturnType<typeof getUsers>>;

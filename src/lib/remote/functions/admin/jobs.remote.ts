import { query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { literal, object, string, union } from 'valibot';

export const getJobs = query(
	object(
		{
			stateName: union([
				literal('SUCCEEDED'),
				literal('FAILED'),
				literal('PROCESSING'),
				literal('ENQUEUED'),
				literal('SCHEDULED'),
				literal('DELETED')
			]),
			limit: string(),
			offset: string()
		},
		'Invalid input'
	),
	async (input) => {
		const ctx = await createAdminContext();
		return await ctx.adminApi.get('/api/v2/admin/jobs', {
			query: {
				stateName: input.stateName,
				limit: Number(input.limit),
				offset: Number(input.offset)
			}
		});
	}
);

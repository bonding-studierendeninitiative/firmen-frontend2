import { command, query } from '$app/server';
import { createAdminContext } from '@/trpc/server';
import { error } from '@sveltejs/kit';
import { number, object, optional, string } from 'valibot';

export const getAllExports = query(
	object({
		eventId: string(),
		page: optional(number(), 0),
		limit: optional(number(), 10)
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get('/api/v2/admin/events/{eventId}/exports', {
			path: {
				eventId: input.eventId
			},
			query: {
				limit: input.limit,
				page: input.page
			}
		});
		return response;
	}
);

export const deleteExport = command(
	object({
		eventId: string(),
		exportId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/events/{eventId}/exports/{exportId}',
			{
				path: {
					eventId: input.eventId,
					exportId: input.exportId
				}
			}
		);

		if (response.status !== 204) {
			error(500, 'The export could not be deleted');
		}

		getAllExports({ eventId: input.eventId }).refresh();
	}
);
export const generateDownloadLink = query(
	object({
		exportId: string(),
		eventId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'get',
			'/api/v2/admin/events/{eventId}/exports/{exportId}/download',
			{
				path: {
					eventId: input.eventId,
					exportId: input.exportId
				}
			}
		);

		if (response.status !== 204) {
			error(500, 'Export could not be downloaded');
		}

		return response.headers.get('location');
	}
);

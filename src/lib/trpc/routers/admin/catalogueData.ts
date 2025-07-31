import { ExportCatalogueDataRequest } from '@schema';
import { adminProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import { TRPCError } from '@trpc/server';

export const adminCatalogueDataRouter = router({
	export: adminProcedure
		.input((input) => parse(ExportCatalogueDataRequest, input))
		.mutation(async ({ ctx, input }) => {
			const endpoints = {
				advert: '/api/v2/admin/jobs/export/advertisements',
				logo: '/api/v2/admin/jobs/export/logos',
				portrait: '/api/v2/admin/jobs/export/portraits'
			} as const;
			const path = endpoints[input.documentType];
			const response = await ctx.adminApi.request('post', path, { body: input });

			if (response.status !== 200) {
				throw new TRPCError({
					message: 'The export could not be started',
					code: 'INTERNAL_SERVER_ERROR'
				});
			}

			const data = (await response.json()) as { jobId: string };

			return data.jobId;
		})
});

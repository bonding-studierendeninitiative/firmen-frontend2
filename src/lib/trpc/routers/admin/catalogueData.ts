import { ExportCatalogueDataRequest, ReviewAdvertisementRequest, ReviewLogoRequest } from '@schema';
import { adminProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { TRPCError } from '@trpc/server';
import type { ExportAdvertisementsEnqueuedResponse, ExportLogosEnqueuedResponse } from '@api/admin-client';

export const adminCatalogueDataRouter = router({
	export: adminProcedure
		.input((input) => parse(ExportCatalogueDataRequest, input))
		.mutation(async ({ ctx, input }) => {
			if (input.documentType === 'advert') {
				const response = await ctx.adminApi.request("post", "/api/v2/admin/jobs/export/advertisements", {
					body: input
				});

				if (response.status !== 200) {
					throw new TRPCError({ message: 'The export could not be started', code: "INTERNAL_SERVER_ERROR" });
				}

				const data = await response.json() as ExportAdvertisementsEnqueuedResponse;

				return data.jobId;
			} else {
				const response = await ctx.adminApi.request("post", "/api/v2/admin/jobs/export/logos", {
					body: input
				});

				if (response.status !== 200) {
					throw new TRPCError({ message: 'The export could not be started', code: "INTERNAL_SERVER_ERROR" });
				}

				const data = await response.json() as ExportLogosEnqueuedResponse;

				return data.jobId;
			}
		}),
	advertisements: router({
		reviewForm: adminProcedure.query(async () => {
			return await superValidate(valibot(ReviewAdvertisementRequest), {
				id: 'reviewAdvertisementForm'
			});
		})
	}),
	logos: router({
		reviewForm: adminProcedure.query(async () => {
			return await superValidate(valibot(ReviewLogoRequest), {
				id: 'reviewLogoForm'
			});
		})
	})
});

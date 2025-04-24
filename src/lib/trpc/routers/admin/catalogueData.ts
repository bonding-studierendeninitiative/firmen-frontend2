import { ExportCatalogueDataRequest, ReviewAdvertisementRequest, ReviewLogoRequest } from '@schema';
import { adminProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { exportAdvertisements, exportLogos } from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const adminCatalogueDataRouter = router({
	export: adminProcedure
		.input((input) => parse(ExportCatalogueDataRequest, input))
		.mutation(async ({ ctx, input }) => {
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

			if (input.documentType === 'advert') {
				await exportAdvertisements({
					accessToken: token.jwt,
					data: input
				});
			} else {
				await exportLogos({
					accessToken: token.jwt,
					data: input
				});
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

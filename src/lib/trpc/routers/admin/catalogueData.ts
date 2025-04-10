import { ExportCatalogueDataRequest } from '@schema';
import { publicProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { exportAdvertisements, exportLogos } from '@/services';
import { TRPCError } from '@trpc/server';

export const adminCatalogueDataRouter = router({
	export: publicProcedure
		.input((input) => parse(ExportCatalogueDataRequest, input))
		.mutation(async ({ ctx, input }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

			let jobId: string;
			if (input.documentType === 'advert') {
				jobId = await exportAdvertisements({
					accessToken: token.jwt,
					data: input
				});
			} else {
				jobId = await exportLogos({
					accessToken: token.jwt,
					data: input
				});
			}
			console.log(jobId);
		})
});

import { adminProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { API } from '@api';

export const adminExportsRouter = router({
	getAll: adminProcedure.query(() => {}),
	generateDownloadLink: adminProcedure
		.input((input) =>
			parse(
				object({
					exportId: string(),
					eventId: string()
				}),
				input
			)
		)
		.output((output) => parse(string(), output))
		.mutation(async ({ ctx, input }) => {
			const response = await API.get<string>({
				route: `/admin/events/${input.eventId}/exports/${input.exportId}/download`,
				token: ctx.token.jwt
			});
			return await response.text();
		})
});

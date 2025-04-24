import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { getUnregisteredEvents } from '@/services';

export const eventRouter = router({
	unregisteredEvents: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					cursor: string(),
					limit: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			return await getUnregisteredEvents({
				accessToken: ctx.token.jwt,
				organizationId: ctx.session.orgId,
				limit: input.limit,
				page: input.cursor
			});
		})
});

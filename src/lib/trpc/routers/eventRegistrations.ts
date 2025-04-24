import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { array, nullish, object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import { API } from '@api';
import { getEventRegistrationsForOrganization } from '@/services';

export const eventRegistrationsRouter = router({
	changeContactPeople: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					eventRegistrationId: string(),
					contactPeople: array(string())
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const result = await API.post({
				route: `/event-registration/${input.eventRegistrationId}/change-contact-people`,
				token: ctx.token.jwt,
				data: {
					contactPeople: input.contactPeople
				}
			});

			if (!result.ok) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
			}

			return result;
		}),
	forOrganization: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					cursor: nullish(string(), '0'),
					limit: nullish(string(), '10')
				}),
				input
			)
		)
		.query(async ({ ctx, input: { cursor: page, limit } }) => {
			return await getEventRegistrationsForOrganization({
				accessToken: ctx.token.jwt,
				organizationId: ctx.session.orgId,
				limit,
				page
			});
		})
});

import { publicProcedure, router } from '@/trpc/server';
import { array, object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import { clerkClient } from 'svelte-clerk/server';
import { API } from '@api';

export const eventRegistrationsRouter = router({
	changeContactPeople: publicProcedure
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
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

			const result = await API.post({
				route: `/event-registration/${input.eventRegistrationId}/change-contact-people`,
				token: token.jwt,
				data: {
					contactPeople: input.contactPeople
				}
			});

			if (!result.ok) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
			}

			return result;
		})
});

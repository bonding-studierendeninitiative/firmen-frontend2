import { publicProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import {
	ConfirmEventRegistrationSchema,
	DeleteEventRegistrationSchema,
	RejectEventRegistrationSchema
} from '@schema';
import { TRPCError } from '@trpc/server';
import { clerkClient } from 'svelte-clerk/server';
import {
	confirmEventRegistration,
	deleteEventRegistration,
	rejectEventRegistration
} from '@/services';

export const adminEventRegistrationsRouter = router({
	confirm: publicProcedure
		.input((input) => parse(ConfirmEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

			await confirmEventRegistration({
				accessToken: token.jwt,
				eventRegistrationId
			});
		}),
	reject: publicProcedure
		.input((input) => parse(RejectEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

			await rejectEventRegistration({
				accessToken: token.jwt,
				eventRegistrationId
			});
		}),
	delete: publicProcedure
		.input((input) => parse(DeleteEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

			await deleteEventRegistration({
				accessToken: token.jwt,
				eventRegistrationId
			});
		})
});

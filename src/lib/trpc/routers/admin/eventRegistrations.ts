import { adminProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import {
	AdminRegisterOrganizationToEventSchema,
	ConfirmEventRegistrationSchema,
	DeleteEventRegistrationSchema,
	RejectEventRegistrationSchema
} from '@schema';
import {
	adminCreateRegistration,
	confirmEventRegistration,
	deleteEventRegistration,
	rejectEventRegistration
} from '@/services';

export const adminEventRegistrationsRouter = router({
	confirm: adminProcedure
		.input((input) => parse(ConfirmEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			await confirmEventRegistration({
				accessToken: ctx.token.jwt,
				eventRegistrationId
			});
		}),
	reject: adminProcedure
		.input((input) => parse(RejectEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			await rejectEventRegistration({
				accessToken: ctx.token.jwt,
				eventRegistrationId
			});
		}),
	delete: adminProcedure
		.input((input) => parse(DeleteEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			await deleteEventRegistration({
				accessToken: ctx.token.jwt,
				eventRegistrationId
			});
		}),
	create: adminProcedure
		.input((input) => parse(AdminRegisterOrganizationToEventSchema, input))
		.mutation(async ({ ctx, input }) => {
			await adminCreateRegistration({
				accessToken: ctx.token.jwt,
				data: input
			});
		})
});

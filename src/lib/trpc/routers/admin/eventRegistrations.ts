import { adminProcedure, router } from '@/trpc/server';
import { parse } from 'valibot';
import {
	AdminRegisterOrganizationToEventSchema,
	ConfirmEventRegistrationSchema,
	DeleteEventRegistrationSchema,
	RejectEventRegistrationSchema
} from '@schema';
import { TRPCError } from '@trpc/server';

export const adminEventRegistrationsRouter = router({
	confirm: adminProcedure
		.input((input) => parse(ConfirmEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			const response = await ctx.adminApi.request("post", "/api/v2/admin/event-registration/{eventRegistrationId}/confirm",{
				path: {eventRegistrationId},
			});
		
			if (response.status !== 204) {
				throw new TRPCError({message: 'The registration could not be confirmed', code: "INTERNAL_SERVER_ERROR"});
			}
		}),
	reject: adminProcedure
		.input((input) => parse(RejectEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			const response = await ctx.adminApi.request("post", "/api/v2/admin/event-registration/{eventRegistrationId}/reject",{
				path: {eventRegistrationId},
			});
		
			if (response.status !== 204) {
				throw new TRPCError({message: 'The registration could not be rejected', code: "INTERNAL_SERVER_ERROR"});
			}
		}),
	delete: adminProcedure
		.input((input) => parse(DeleteEventRegistrationSchema, input))
		.mutation(async ({ ctx, input: { eventRegistrationId } }) => {
			const response = await ctx.adminApi.request("delete", "/api/v2/admin/event-registration/{eventRegistrationId}",{
				path: {eventRegistrationId},
			});
		
			if (response.status !== 200) {
				throw new TRPCError({message: 'The registration could not be deleted', code: "INTERNAL_SERVER_ERROR"});
			}
		}),
	create: adminProcedure
		.input((input) => parse(AdminRegisterOrganizationToEventSchema, input))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.request("post", "/api/v2/admin/event-registration",{
				body: input,
			});
		
			if (response.status === 409) {
				throw new TRPCError({message: 'The organization is already registered for this event', code: "CONFLICT"});
			}
		
			if (response.status !== 201) {
				throw new TRPCError({message: 'The registration could not be created', code: "INTERNAL_SERVER_ERROR"});
			}
		})
});

import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { array, nullish, number, object, parse, safeParse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import {
	GetEventRegistrationsForOrganizationOutput,
	RegisterOrganizationToEventInput,
	SubmitPortraitInput
} from '@api/client';
import { CreateEventRegistrationResponse, SubmitPortraitRequest } from '@schema';
import { superValidate, type Infer } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

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
			const result = await ctx.api.request(
				'post',
				'/api/v2/event-registration/{eventRegistrationId}/change-contact-people',
				{
					path: {
						eventRegistrationId: input.eventRegistrationId
					},
					body: {
						contactPeople: input.contactPeople
					}
				}
			);

			if (!result.ok) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
			}

			return await result.json();
		}),
	forOrganization: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					orgId: string(),
					cursor: nullish(number(), 0),
					limit: nullish(number(), 10)
				}),
				input
			)
		)
		.query(async ({ ctx, input: { cursor: page, limit, orgId } }) => {
			const response = await ctx.api.get('/api/v2/event-registration', {
				query: {
					organizationId: orgId,
					limit,
					page
				}
			});
			const result = safeParse(GetEventRegistrationsForOrganizationOutput, response);
			if (!result.success) {
				console.error(JSON.stringify(result.issues));
				return {
					eventRegistrations: [],
					totalElements: 0,
					totalPagea: 0
				};
			}
			return {
				...result,
				eventRegistrations: await Promise.all(
					result.output.eventRegistrations?.map(async (eventRegistration) => {
						return {
							...eventRegistration,
							contactPeople: await Promise.all(
								eventRegistration.contactPeople?.map(async (contactPersonId) => {
									const user = await ctx.db.user.findFirstOrThrow({
										where: { id: contactPersonId }
									});

									return {
										...user
									};
								}) ?? []
							)
						};
					}) ?? []
				)
			};
		}),
	submitPortrait: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					eventRegistrationId: string(),
					data: SubmitPortraitInput
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'post',
				'/api/v2/event-registration/{eventRegistrationId}/portrait/submit',
				{
					path: { eventRegistrationId: input.eventRegistrationId },
					body: input.data
				}
			);

			if (response.status !== 204) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'The portrait could not be submitted!'
				});
			}
		}),
	submitPortraitForm: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					eventRegistrationId: string()
				}),
				input
			)
		)
		.query(async ({ input }) => {
			const submitPortraitForm = await superValidate<Infer<SubmitPortraitRequest>>(
				{
					eventRegistrationId: input.eventRegistrationId
				},
				valibot(SubmitPortraitRequest),
				{
					errors: false
				}
			);

			return submitPortraitForm;
		}),
	registerContactPersonToEvent: authorizedOrgMemberProcedure
		.input((input) => parse(RegisterOrganizationToEventInput, input))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.api.request('post', '/api/v2/event-registration', {
				body: input
			});

			if (response.status === 409) {
				throw new TRPCError({
					message: 'A registration to this event already exists for your organization!',
					code: 'CONFLICT'
				});
			}
			if (response.status != 201) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'The registration could not be completed'
				});
			}

			const data = await response.json();

			return parse(CreateEventRegistrationResponse, data);
		})
});

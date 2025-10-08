import { query, form } from '$app/server';
import { array, nullish, number, object, string, safeParse } from 'valibot';
import { error } from '@sveltejs/kit';
import { createOrgMemberContext } from '@/remote/context';
import {
	GetEventRegistrationsForOrganizationOutput,
	RegisterOrganizationToEventInput,
	SubmitPortraitInput
} from '@api/client';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { SubmitPortraitRequest } from '@schema';
import { orgMemberCommand, orgMemberQuery } from '../auth-guards';

export const changeContactPeople = orgMemberCommand(
	object({ eventRegistrationId: string(), contactPeople: array(string()) }),
	async ({ input, ctx }) => {
		const result = await ctx.api.request(
			'post',
			'/api/v2/event-registration/{eventRegistrationId}/change-contact-people',
			{ path: input, body: { contactPeople: input.contactPeople } }
		);
		if (!result.ok) {
			error(500, 'Something went wrong');
		}
		return await result.json();
	}
);

export const forOrganization = orgMemberQuery(
	object({ orgId: string(), cursor: nullish(number(), 0), limit: nullish(number(), 10) }),
	async ({ input, ctx }) => {
		const response = await ctx.api.get('/api/v2/event-registration', {
			query: { organizationId: input.orgId, limit: input.limit, page: input.cursor }
		});

		// Validate and enrich response to match UI expectations
		const parsed = safeParse(GetEventRegistrationsForOrganizationOutput, response);
		if (!parsed.success) {
			console.error('Failed to parse event registrations for organization', parsed.issues);
			return {
				eventRegistrations: [],
				totalElements: 0,
				totalPages: 0,
				pageNumber: 0,
				pageSize: input.limit ?? 10
			};
		}

		const output = parsed.output;
		const enriched = await Promise.all(
			(output.eventRegistrations ?? []).map(async (eventRegistration) => {
				const contactPeopleIds = (eventRegistration.contactPeople ?? []) as unknown as string[];
				const contactPeople = await Promise.all(
					contactPeopleIds.map(async (contactPersonId) => {
						const user = await ctx.db.user.findFirst({ where: { id: contactPersonId } });
						// Gracefully handle missing users
						return user
							? {
									id: user.id,
									name: user.name,
									email: user.email ?? '',
									image: user.image ?? ''
								}
							: { id: contactPersonId, name: '', email: '', image: '' };
					})
				);
				return {
					...eventRegistration,
					contactPeople
				};
			})
		);

		return {
			...output,
			eventRegistrations: enriched
		};
	}
);

export type EventRegistrationsOutput = Awaited<ReturnType<typeof forOrganization>>;

export const submitPortrait = orgMemberCommand(
	object({ eventRegistrationId: string(), data: SubmitPortraitInput }),
	async ({ input: { eventRegistrationId, data }, ctx }) => {
		const response = await ctx.api.request(
			'post',
			'/api/v2/event-registration/{eventRegistrationId}/portrait/submit',
			{ path: { eventRegistrationId }, body: data }
		);
		if (response.status !== 204) {
			error(400, 'The portrait could not be submitted!');
		}
	}
);

export const registerOrganizationToEvent = orgMemberCommand(
	RegisterOrganizationToEventInput,
	async ({ input, ctx }) => {
		const response = await ctx.api.request('post', '/api/v2/event-registration', { body: input });
		if (response.status === 409) {
			error(409, 'A registration to this event already exists for your organization!');
		}
		if (response.status !== 201) {
			error(500, 'The registration could not be completed');
		}
		const data = await response.json();
		return data;
	}
);

// Form helper for portrait submission
export const submitPortraitForm = query(
	object({ eventRegistrationId: string() }),
	async ({ eventRegistrationId }) => {
		const submitForm = await superValidate(
			{ eventRegistrationId },
			valibot(SubmitPortraitRequest),
			{ errors: false }
		);
		return submitForm;
	}
);

// Optional: submit portrait via form remote for SPA forms
export const submitPortraitAction = form('unchecked', async (formData) => {
	const ctx = await createOrgMemberContext();
	const data = Object.fromEntries(formData.entries());
	// Rely on server-side validation via schema
	const response = await ctx.api.request(
		'post',
		'/api/v2/event-registration/{eventRegistrationId}/portrait/submit',
		{
			path: { eventRegistrationId: String(data['eventRegistrationId'] ?? '') },
			body: Object.fromEntries(Object.entries(data).filter(([k]) => k !== 'eventRegistrationId'))
		}
	);
	if (response.status !== 204) {
		error(400, 'The portrait could not be submitted!');
	}
	return { success: true };
});

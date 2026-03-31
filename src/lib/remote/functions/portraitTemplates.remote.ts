import { form } from '$app/server';
import { object, string, number, partial } from 'valibot';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema, UpdatePortraitTemplateRequestSchema } from '@schema';
import { error } from '@sveltejs/kit';
import { createOrgMemberContext } from '@/remote/context';
import type { Problem } from '@api/client';
import { orgMemberCommand, orgMemberQuery } from '../auth-guards';

export const getAllPortraitTemplates = orgMemberQuery(
	object({ page: number(), query: string() }),
	async ({ input, ctx }) => {
		try {
			const organizationId = ctx.session.activeOrganizationId;
			const response = await ctx.api.get('/api/v2/portrait-template', {
				query: { organizationId, page: input.page, limit: 9 }
			});
			return response;
		} catch (error) {
			console.error(error);
			return { portraitTemplates: [], totalElements: 0, totalPages: 0, pageNumber: 0 };
		}
	}
);

export const getPortraitTemplate = orgMemberQuery(
	string(),
	async ({ input: portraitTemplateId, ctx }) => {
		const response = await ctx.api.get('/api/v2/portrait-template/{portraitTemplateId}', {
			path: { portraitTemplateId },
			query: { organizationId: ctx.session.activeOrganizationId }
		});
		return response;
	}
);

export type GetPortraitTemplateSchema = Awaited<ReturnType<typeof getPortraitTemplate>>;

export const editPortraitTemplateForm = orgMemberQuery(
	string(),
	async ({ input: portraitTemplateId, ctx }) => {
		const response = await ctx.api.get('/api/v2/portrait-template/{portraitTemplateId}', {
			path: { portraitTemplateId },
			query: { organizationId: ctx.session.activeOrganizationId }
		});
		return await superValidate(response, valibot(UpdatePortraitTemplateRequestSchema));
	}
);

export const createPortraitTemplate = form(PortraitTemplateSchema, async (input) => {
	const ctx = await createOrgMemberContext();

	const response = await ctx.api.request('post', '/api/v2/portrait-template', {
		query: { organizationId: ctx.session.activeOrganizationId },
		body: input
	});

	if (!response.ok) {
		const problem = (await response.json()) as Problem;
		error(response.status, problem.detail || 'Portrait template could not be created');
	}
	return await response.json();
});

export const deletePortraitTemplate = orgMemberCommand(string(), async ({ input: id, ctx }) => {
	const response = await ctx.api.request(
		'delete',
		'/api/v2/portrait-template/{portraitTemplateId}',
		{
			path: { portraitTemplateId: id },
			query: { organizationId: ctx.session.activeOrganizationId }
		}
	);
	if (response.status !== 204) {
		error(404, 'Portrait template not found');
	}
});

export const updatePortraitTemplate = form(
	object({ id: string(), data: partial(UpdatePortraitTemplateRequestSchema) }),
	async ({ id, data }) => {
		const ctx = await createOrgMemberContext();

		const response = await ctx.api.put('/api/v2/portrait-template/{portraitTemplateId}', {
			path: { portraitTemplateId: id },
			body: data
		});
		return response;
	}
);

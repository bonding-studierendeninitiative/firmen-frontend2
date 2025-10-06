import { query, command } from '$app/server';
import { object, string, number, partial } from 'valibot';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema, UpdatePortraitTemplateRequestSchema } from '@schema';
import { error } from '@sveltejs/kit';
import { createOrgMemberContext } from '@/remote/context';
import type { Problem } from '@api/client';

export const getAllPortraitTemplates = query(
	object({ page: number(), query: string() }),
	async (input) => {
		try {
			const ctx = await createOrgMemberContext();

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

export const getPortraitTemplate = query(string(), async (portraitTemplateId) => {
	const ctx = await createOrgMemberContext();

	const response = await ctx.api.get('/api/v2/portrait-template/{portraitTemplateId}', {
		path: { portraitTemplateId },
		query: { organizationId: ctx.session.activeOrganizationId }
	});
	return response;
});

export type GetPortraitTemplateSchema = Awaited<ReturnType<typeof getPortraitTemplate>>;

export const editPortraitTemplateForm = query(string(), async (portraitTemplateId) => {
	const ctx = await createOrgMemberContext();
	const response = await ctx.api.get('/api/v2/portrait-template/{portraitTemplateId}', {
		path: { portraitTemplateId },
		query: { organizationId: ctx.session.activeOrganizationId }
	});
	return await superValidate(response, valibot(UpdatePortraitTemplateRequestSchema));
});

export const createPortraitTemplate = command(PortraitTemplateSchema, async (input) => {
	const ctx = await createOrgMemberContext();

	const response = await ctx.api.request('post', '/api/v2/portrait-template', {
		query: { organizationId: ctx.session.activeOrganizationId },
		body: input
	});

	if (response.status != 201) {
		const problem = (await response.json()) as Problem;
		error(response.status, problem.detail || 'Portrait template could not be created');
	}
	return await response.json();
});

export const deletePortraitTemplate = command(string(), async (id) => {
	const ctx = await createOrgMemberContext();

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

export const updatePortraitTemplate = command(
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

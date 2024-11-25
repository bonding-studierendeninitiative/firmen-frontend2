import type { PageServerLoad } from './$types';
import {
	createPortraitTemplate,
	getPortraitTemplates,
	deletePortraitTemplate
} from '@/services/portraitTemplates';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema, DeletePortraitTemplateRequestSchema } from '@schema';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const form = await superValidate(valibot(PortraitTemplateSchema));
	const deleteForm = await superValidate(valibot(DeletePortraitTemplateRequestSchema));

	const page = Number(url.searchParams.get('page')) || 0;

	const result = await getPortraitTemplates({
		accessToken: session?.accessToken,
		org: params.organizationSlug,
		page
	});

	return {
		form,
		deleteForm,
		portraitTemplates: result.portraitTemplates ?? [],
		portraitTemplatePageCount: result.totalPages,
		portraitTemplatePage: result.pageNumber
	};
};

export const actions: Actions = {
	createPortrait: async ({ locals, request, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(PortraitTemplateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await createPortraitTemplate({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			org: params.organizationSlug,
			data: form.data
		});
		return {
			form
		};
	},
	deletePortrait: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(DeletePortraitTemplateRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await deletePortraitTemplate({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			data: form.data
		});
		return {
			deleteForm: form
		};
	}
};

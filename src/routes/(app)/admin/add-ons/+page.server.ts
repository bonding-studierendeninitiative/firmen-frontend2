import type { PageServerLoad } from './$types';
import {
	createAddonPackageTemplate,
	deleteAddonPackageTemplate,
	getAddonPackageTemplates
} from '$lib/services';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateAddonPackageTemplateSchema } from '@schema/addonPackageTemplates';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const form = await superValidate(valibot(CreateAddonPackageTemplateSchema));

	const getAddonPackageTemplatesResponse = await getAddonPackageTemplates({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		page: Number(url.searchParams.get('page'))
	});
	return {
		form,
		addonPackageTemplates: getAddonPackageTemplatesResponse.addonPackageTemplates,
		addonPackageTemplatesPageCount: getAddonPackageTemplatesResponse.totalPages,
		addonPackageTemplatesPage: getAddonPackageTemplatesResponse.pageNumber
	};
};

export const actions = {
	createAddonPackage: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateAddonPackageTemplateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await createAddonPackageTemplate({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken, data: form.data
		});
		return {
			form
		};
	},
	deleteAddonPackage: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateAddonPackageTemplateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await deleteAddonPackageTemplate({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken, data: form.data
		});
		return {
			form
		};
	}
} satisfies Actions;
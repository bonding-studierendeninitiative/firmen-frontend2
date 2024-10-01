import type { PageServerLoad } from '../../../../../../../../../.svelte-kit/types/src/routes';
import {
	getPortraitTemplate,
	PortraitCompanyDetailsSchema,
	PortraitContactInfoSchema,
	updatePortraitDetails
} from '@/services/portraitTemplates';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { type Actions, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const portraitTemplate = await getPortraitTemplate({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		portraitTemplateId: params.portraitTemplateId
	});

	const updatePortraitCompanyDetailsForm = await superValidate(
		portraitTemplate,
		valibot(PortraitCompanyDetailsSchema)
	);
	const updatePortraitContactInfoForm = await superValidate(
		portraitTemplate,
		valibot(PortraitContactInfoSchema)
	);

	return {
		portraitTemplate,
		updatePortraitCompanyDetailsForm,
		updatePortraitContactInfoForm
	};
};

export const actions = {
	updatePortraitCompanyDetails: async ({ request, locals, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const updatePortraitCompanyDetailsForm = await superValidate(
			request,
			valibot(PortraitCompanyDetailsSchema)
		);
		if (!updatePortraitCompanyDetailsForm.valid) {
			return fail(400, { updatePortraitCompanyDetailsForm });
		}
		await updatePortraitDetails({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			id: params.portraitTemplateId as string,
			data: updatePortraitCompanyDetailsForm.data
		});
		return {
			updatePortraitCompanyDetailsForm
		};
	},
	updatePortraitContactInfo: async ({ request, locals, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const updatePortraitContactInfoForm = await superValidate(
			request,
			valibot(PortraitContactInfoSchema)
		);
		if (!updatePortraitContactInfoForm.valid) {
			return fail(400, { updatePortraitContactInfoForm });
		}
		await updatePortraitDetails({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			id: params.portraitTemplateId as string,
			data: updatePortraitContactInfoForm.data
		});
		return {
			updatePortraitContactInfoForm
		};
	}
} satisfies Actions;

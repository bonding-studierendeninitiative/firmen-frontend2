import { submitPortrait } from '@/remote/functions/eventRegistrations.remote.js';
import { SubmitPortraitRequest } from '@schema';
import { fail, superValidate, type Infer } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
	const { session, eventRegistration } = await parent();
	if (!session?.id) return;

	const submitPortraitForm = await superValidate<Infer<SubmitPortraitRequest>>(
		{
			eventRegistrationId: eventRegistration?.id
		},
		valibot(SubmitPortraitRequest),
		{
			errors: false
		}
	);

	return {
		submitPortraitForm
	};
};

export const actions = {
	submitPortrait: async (event) => {
		const form = await superValidate(event.request, valibot(SubmitPortraitRequest), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, { form });
		}

		await submitPortrait({
			eventRegistrationId: form.data.eventRegistrationId,
			data: form.data
		});
	}
};

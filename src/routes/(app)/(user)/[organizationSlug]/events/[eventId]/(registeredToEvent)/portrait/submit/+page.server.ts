import { createCaller } from '@/trpc/router';
import { SubmitPortraitRequest } from '@schema';
import { fail, superValidate, type Infer } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
    const { initialState, eventRegistration } = await parent();
    if (!initialState.sessionId) return;

    const submitPortraitForm = await superValidate<Infer<SubmitPortraitRequest>>({
        eventRegistrationId: eventRegistration?.id
    },valibot(SubmitPortraitRequest), {
        errors: false
    });

    return {
        submitPortraitForm
    };
}

export const actions = {
	submitPortrait: async (event) => {

		const form = await superValidate(event.request, valibot(SubmitPortraitRequest), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event)

		await api.eventRegistrations.submitPortrait({
			eventRegistrationId: form.data.eventRegistrationId,
			data: form.data,
		});
	}
}
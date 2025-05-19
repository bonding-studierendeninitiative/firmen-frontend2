import { createCaller } from '@/trpc/router';


export const load = async (event) => {

	const api = await createCaller(event)


	async function loadEventRegistrationData(slug: string) {

		const { eventRegistrations } = await api.eventRegistrations.forOrganization();

		return {
			eventRegistrations
		}
	}

	return {
		eventRegistrationData: event.isDataRequest ? loadEventRegistrationData(event.params.id) : await loadEventRegistrationData(event.params.id)
	}
}
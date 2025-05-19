import type { PageServerLoad } from './$types';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const api = await createCaller(event)

	async function loadPortraitData() {
		const { portraitTemplates } = await api.portraitTemplates.getAll({
			page: 0,
			query: ""
		});

		return {
			portraitTemplates
		};
	}

	return {
		portraitData: event.isDataRequest ? loadPortraitData() : await loadPortraitData()
	};
};

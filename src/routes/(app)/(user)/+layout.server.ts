import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {

	const api = await createCaller(event)

	return { user: await api.user.get() };
};

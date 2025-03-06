import { getUser } from '@/services';

export const load = async ({ parent }) => {
	const {
		initialState: { userId }
	} = await parent();

	if (!userId) return;

	const user = await getUser({ userId });

	return { user };
};

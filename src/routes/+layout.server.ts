// src/+layout.server.ts
import { auth } from '@/auth';

export const load = async ({ locals, request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	return {
		...session
	};
};

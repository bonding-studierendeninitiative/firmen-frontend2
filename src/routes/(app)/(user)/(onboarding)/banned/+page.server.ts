import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const { user } = await event.parent();
	if (!user?.banned) {
		redirect(302, '/');
	}
}

import { command, query } from '$app/server';
import { object, string } from 'valibot';
import { makeSerializable } from '@/utils';
import { error } from '@sveltejs/kit';
import { createAuthenticatedContext } from '@/remote/context';

const updateUserDetailsSchema = object({ phone: string(), title: string(), position: string() });

export const updateMetadata = command(updateUserDetailsSchema, async (input) => {
	try {
		const ctx = await createAuthenticatedContext();
		await ctx.auth.updateUser({
			body: {
				metadata: JSON.stringify({
					public: { phone: input.phone, title: input.title, position: input.position }
				})
			},
			headers: { Authorization: `Bearer ${ctx.session?.token}` }
		});
		return { ok: true };
	} catch (e) {
		console.error('Error updating user metadata:', e);
		error(500, 'Error updating user metadata');
	}
});

export const getUser = query(object({}), async () => {
	try {
		const ctx = await createAuthenticatedContext();
		const user = await ctx.db.user.findFirst({ where: { id: ctx.session.userId } });
		return makeSerializable(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
});

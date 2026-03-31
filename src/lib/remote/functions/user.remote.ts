import { form, query } from '$app/server';
import { minLength, object, pipe, string } from 'valibot';
import { error } from '@sveltejs/kit';
import { createAuthenticatedContext } from '@/remote/context';

const updateUserDetailsSchema = object({
	phone: pipe(string(), minLength(3)),
	title: pipe(string(), minLength(3)),
	position: pipe(string(), minLength(3))
});

export const updateMetadataForm = form(updateUserDetailsSchema, async (input) => {
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

export const getUser = query('unchecked', async () => {
	try {
		const ctx = await createAuthenticatedContext();
		return await ctx.db.user.findFirst({ where: { id: ctx.session.userId } });
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
});

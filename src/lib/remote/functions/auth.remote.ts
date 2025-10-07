import { command, form } from '$app/server';
import { createContext } from '@/remote/context';
import { getRequestEvent } from '$app/server';
import { email, minLength, object, optional, pipe, string, transform } from 'valibot';
import { error } from '@sveltejs/kit';

export const signIn = command(object({ email: string() }), async (input) => {
	const { email } = input;

	const ctx = await createContext(getRequestEvent());

	if (email.endsWith('@bonding.de')) {
		console.log(ctx.session);

		const response = await ctx.auth.signInSSO({
			body: {
				email,
				providerId: 'entra',
				providerType: 'oidc',
				callbackURL: `${process.env.PUBLIC_APP_URL}/dashboard`
			}
		});

		console.log(response);
		return response;
	} else {
		await ctx.auth.signInMagicLink({
			body: {
				email,
				callbackURL: `${process.env.PUBLIC_APP_URL}`
			},
			headers: {
				Authorization: `Bearer ${process.env.BETTER_AUTH_SECRET}`
			}
		});
		return { ok: true };
	}
});

export const signUp = form(
	object({
		callbackURL: optional(string()),
		email: pipe(
			string('E-Mail-Adresse ist erforderlich'),
			transform((email) => email.trim().toLowerCase()),
			email('Keine gültige E-Mail-Adresse')
		),
		name: pipe(
			string('Name ist erforderlich'),
			transform((name) => name.trim()),
			minLength(2, 'Name muss mindestens 2 Zeichen lang sein')
		)
	}),
	async (input) => {
		const { email, name, callbackURL } = input;

		const ctx = await createContext(getRequestEvent());

		try {
			await ctx.db.user.create({
				data: {
					email,
					name,
					createdAt: new Date(),
					updatedAt: new Date(),
					id: crypto.randomUUID(),
					emailVerified: false,
					role: 'user'
				}
			});
		} catch (e) {
			console.error('Error during sign up:', e);
			error(500, e instanceof Error ? e.message : 'Failed to sign up user');
		}

		try {
			await ctx.auth.signInMagicLink({
				body: {
					email,
					callbackURL: `${process.env.PUBLIC_APP_URL}` + (callbackURL ? callbackURL : '')
				},
				headers: {
					Authorization: `Bearer ${process.env.BETTER_AUTH_SECRET}`
				}
			});
			return { ok: true };
		} catch (e) {
			console.error('Error sending magic link after sign up:', e);
			error(500, e instanceof Error ? e.message : 'Failed to send magic link');
		}
	}
);

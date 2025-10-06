import { publicProcedure, router } from '@/trpc/server';
import { TRPCError } from '@trpc/server';
import { object, parse, string } from 'valibot';

export const authRouter = router({
	signIn: publicProcedure
		.input((input) => parse(object({ email: string() }), input))
		.mutation(async ({ ctx, input }) => {
			const { email } = input;

			if (!email) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Email is required' });
			}

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
			}
		})
});

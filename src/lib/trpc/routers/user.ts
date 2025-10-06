import { authorizedProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { makeSerializable } from '@/utils';

const updateUserDetailsSchema = object({
	phone: string(),
	title: string(),
	position: string()
});

export const userRouter = router({
	updateMetadata: authorizedProcedure
		.input((input) => parse(updateUserDetailsSchema, input))
		.mutation(async ({ ctx, input }) => {
			try {
				const abc = await ctx.auth.updateUser({
					body: {
						metadata: JSON.stringify({
							public: {
								phone: input.phone,
								title: input.title,
								position: input.position
							}
						})
					},
					headers: {
						Authorization: `Bearer ${ctx.session.token}`
					}
				});
				console.log('User metadata updated successfully:', abc.status);
			} catch (error) {
				console.error('Error updating user metadata:', error);
			}
		}),

	get: authorizedProcedure.query(async ({ ctx }) => {
		try {
			console.log('Fetching user with ID:', ctx.session.userId);
			const user = await ctx.db.user.findFirst({
				where: {
					id: ctx.session.userId
				}
			});
			return makeSerializable(user);
		} catch (error) {
			console.error('Error fetching user:', error);
			return null;
		}
	})
});

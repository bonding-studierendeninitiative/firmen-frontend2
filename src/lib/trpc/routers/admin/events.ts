import { adminProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import { getActiveBuyOption, publishEvent } from '@/services';

export const adminEventsRouter = router({
	publish: adminProcedure
		.input((input) => {
			return parse(
				object({
					eventId: string()
				}),
				input
			);
		})
		.mutation(async ({ ctx, input: { eventId } }) => {
			const buyOption = await getActiveBuyOption({
				accessToken: ctx.token.jwt,
				eventId
			});

			if (buyOption === null) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: 'No active buy option found'
				});
			}

			await publishEvent({
				accessToken: ctx.token.jwt,
				eventId
			});
		})
});

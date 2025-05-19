import { authorizedProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { makeSerializable } from '@/utils';

const updateUserDetailsSchema = object({
    phone: string(),
    title: string(),
    position: string()
});

export const userRouter = router({
    updateMetadata: authorizedProcedure
        .input((input) => parse(
            updateUserDetailsSchema,
            input
        ))
        .mutation(async ({ ctx, input }) => {
            await clerkClient.users.updateUserMetadata(ctx.session.userId, {
                publicMetadata: input
            });
        }),
    
    get: authorizedProcedure
        .query(async ({ ctx }) => {
            const user = await clerkClient.users.getUser(ctx.session.userId);
            return makeSerializable(user);
        })
}); 
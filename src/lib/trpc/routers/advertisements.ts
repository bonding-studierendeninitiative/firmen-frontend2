import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { file, object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import type { UploadAdvertisementRequest } from '@schema';
import { createLogger } from 'vite';

const logger = createLogger();

export const advertisementsRouter = router({
    upload: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                title: string(),
                file: file(), // Base64 encoded file
                orgId: string()
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            try {
                const response = await ctx.api.request("post", "/api/v2/organization/{organizationId}/advertisement/request-upload-url", {
                    path: { organizationId: input.orgId },
                    body: {
                        title: input.title
                    }
                });

                if (!response.ok) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'The upload could not be completed'
                    });
                }

                const { url } = await response.json();

                const uploadResponse = await fetch(url, {
                    method: 'PUT',
                    body: input.file,
                    headers: {
                        'x-amz-meta-title': btoa(input.title)
                    }
                });

                if (!uploadResponse.ok) {
                    logger.error(`The upload could not be completed: ${await uploadResponse.text()}`);
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'The upload could not be completed'
                    });
                }
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e instanceof Error ? e.message : 'Failed to upload advertisement'
                });
            }
        })
}); 
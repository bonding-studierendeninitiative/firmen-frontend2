import { adminProcedure, router } from '@/trpc/server';
import { TRPCError } from '@trpc/server';
import { nullable, number, object, optional, parse, string, type InferInput } from 'valibot';

export const adminExportsRouter = router({
	getAll: adminProcedure
		.input((input) => parse(object({
			eventId: string(),
			page: optional(number(), 0),
			limit: optional(number(), 10)
		}), input))
		.query(async ({ ctx, input }) => {
			const response = await ctx.adminApi.get("/api/v2/admin/events/{eventId}/exports", {
				path: {
					eventId: input.eventId
				},
				query: {
					limit: input.limit,
					page: input.page
				}
			});
			return response
		}),
	delete: adminProcedure
		.input((input) => parse(object({
			eventId: string(),
			exportId: string()
		}), input))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.request("delete", "/api/v2/admin/events/{eventId}/exports/{exportId}", {
				path: {
					eventId: input.eventId,
					exportId: input.exportId
				}
			});

			if (response.status !== 204) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "The export could not be deleted"
				})
			}
		}),
	generateDownloadLink: adminProcedure
		.input((input) =>
			parse(
				object({
					exportId: string(),
					eventId: string()
				}),
				input
			)
		)
		.output((output) => parse(nullable(string()), output))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.request("get", "/api/v2/admin/events/{eventId}/exports/{exportId}/download", {
				path: {
					eventId: input.eventId,
					exportId: input.exportId
				},
			});

			if (response.status !== 204) {
				throw new TRPCError({ message: "Export could not be downloaded", code: "INTERNAL_SERVER_ERROR" })
			}

			return response.headers.get("location");
		})
});

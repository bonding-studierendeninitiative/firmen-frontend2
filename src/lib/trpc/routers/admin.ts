import { adminProcedure, router } from '@/trpc/server';
import { boolean, literal, number, object, optional, parse, string, union } from 'valibot';
import { JobsSchema } from '@schema';
import { clerkClient } from 'svelte-clerk/server';
import { getJobs } from '@/services';
import { adminEventRegistrationsRouter } from '@/trpc/routers/admin/eventRegistrations';
import { adminCatalogueDataRouter } from '@/trpc/routers/admin/catalogueData';
import { adminEventsRouter } from '@/trpc/routers/admin/events';
import { adminExportsRouter } from '@/trpc/routers/admin/exports';
import { adminOrgsRouter } from '@/trpc/routers/admin/orgs';

export const adminRouter = router({
	events: adminEventsRouter,
	export: adminExportsRouter,
	eventRegistrations: adminEventRegistrationsRouter,
	catalogueData: adminCatalogueDataRouter,
	orgs: adminOrgsRouter,
	jobs: adminProcedure
		.input((input) => {
			console.log(input);
			return parse(
				object(
					{
						stateName: union([
							literal('SUCCEEDED'),
							literal('FAILED'),
							literal('PROCESSING'),
							literal('ENQUEUED'),
							literal('SCHEDULED'),
							literal('DELETED')
						]),
						limit: string(),
						offset: string()
					},
					'Invalid input'
				),
				input
			);
		})
		.output((output) => {
			const result = parse(JobsSchema, output);
			console.log('Jobs result:', result);
			return result;
		})
		.query(async ({ ctx, input }) => {
			return await getJobs({
				accessToken: ctx.token.jwt,
				stateName: input.stateName,
				limit: input.limit,
				offset: input.offset
			});
		})
});

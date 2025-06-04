import { adminProcedure, router } from '@/trpc/server';
import { literal, object, parse, string, union } from 'valibot';
import { adminEventRegistrationsRouter } from '@/trpc/routers/admin/eventRegistrations';
import { adminCatalogueDataRouter } from '@/trpc/routers/admin/catalogueData';
import { adminEventsRouter } from '@/trpc/routers/admin/events';
import { adminExportsRouter } from '@/trpc/routers/admin/exports';
import { adminOrgsRouter } from '@/trpc/routers/admin/orgs';
import { adminLegacyOrganizationsRouter } from './legacyOrganizations';
import { PagedJobOutput } from '@api/admin-client';
import { adminDocumentsRouter } from './documents';
import { adminUsersRouter } from './users';

export const adminRouter = router({
	events: adminEventsRouter,
	export: adminExportsRouter,
	eventRegistrations: adminEventRegistrationsRouter,
	catalogueData: adminCatalogueDataRouter,
	orgs: adminOrgsRouter,
	legacyOrgs: adminLegacyOrganizationsRouter,
	documents: adminDocumentsRouter,
	users: adminUsersRouter,
	jobs: adminProcedure
		.input((input) => {
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
		.output((output) => parse(PagedJobOutput, output))
		.query(async ({ ctx, input }) => {
			return await ctx.adminApi.get("/api/v2/admin/jobs", { query: { stateName: input.stateName, limit: Number(input.limit), offset: Number(input.offset) } })

		})
});

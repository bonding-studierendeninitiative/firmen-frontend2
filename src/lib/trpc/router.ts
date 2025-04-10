import { createContext } from '$lib/trpc/context';
import { createCallerFactory, router } from '@/trpc/server';
import { type RequestEvent } from '@sveltejs/kit';
import { adminRouter } from '@/trpc/routers/admin';
import { catalogueDataRouter } from '@/trpc/routers/catalogueData';
import { orgMembersRouter } from '@/trpc/routers/orgMembers';
import { eventRegistrationsRouter } from '@/trpc/routers/eventRegistrations';

export const mainRouter = router({
	admin: adminRouter,
	catalogueData: catalogueDataRouter,
	orgMembers: orgMembersRouter,
	eventRegistrations: eventRegistrationsRouter
});

const factory = createCallerFactory(mainRouter);
export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};

export type Router = typeof mainRouter;

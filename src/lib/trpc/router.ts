import { createContext } from '$lib/trpc/context';
import { createCallerFactory, router } from '@/trpc/server';
import { type RequestEvent } from '@sveltejs/kit';
import { adminRouter } from '@/trpc/routers/admin';
import { catalogueDataRouter } from '@/trpc/routers/catalogueData';
import { orgMembersRouter } from '@/trpc/routers/orgMembers';
import { eventRegistrationsRouter } from '@/trpc/routers/eventRegistrations';
import { eventRouter } from '@/trpc/routers/events';
import { billingAddressTemplateRouter } from './routers/billingAddressTemplates';
import { userRouter } from './routers/user';
import { portraitTemplatesRouter } from './routers/portraitTemplates';
import { advertisementsRouter } from './routers/advertisements';
import { organizationsRouter } from './routers/organizations';
import { logosRouter } from './routers/logos';


export const mainRouter = router({
	admin: adminRouter,
	catalogueData: catalogueDataRouter,
	orgMembers: orgMembersRouter,
	eventRegistrations: eventRegistrationsRouter,
	events: eventRouter,
	billingAddressTemplates: billingAddressTemplateRouter,
	user: userRouter,
	portraitTemplates: portraitTemplatesRouter,
	advertisements: advertisementsRouter,
	logos: logosRouter,
	organizations: organizationsRouter
});

const factory = createCallerFactory(mainRouter);
export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};

export type Router = typeof mainRouter;

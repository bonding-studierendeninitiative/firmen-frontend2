import { createContext } from '$lib/trpc/context';
import { createCallerFactory, router } from '@/trpc/server';
import { type RequestEvent } from '@sveltejs/kit';
import { catalogueDataRouter } from '@/trpc/routers/catalogueData';
import { orgMembersRouter } from '@/trpc/routers/orgMembers';
import { eventRegistrationsRouter } from '@/trpc/routers/eventRegistrations';
import { eventRouter } from '@/trpc/routers/events';
import { billingAddressTemplateRouter } from './routers/billingAddressTemplates';
import { userRouter } from './routers/user';
import { portraitTemplatesRouter } from './routers/portraitTemplates';
import { organizationsRouter } from './routers/organizations';
import { authRouter } from './routers/auth';

export const mainRouter = router({
	auth: authRouter,
	catalogueData: catalogueDataRouter,
	orgMembers: orgMembersRouter,
	eventRegistrations: eventRegistrationsRouter,
	events: eventRouter,
	billingAddressTemplates: billingAddressTemplateRouter,
	user: userRouter,
	portraitTemplates: portraitTemplatesRouter,
	organizations: organizationsRouter
});

const factory = createCallerFactory(mainRouter);
export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};

export type Router = typeof mainRouter;

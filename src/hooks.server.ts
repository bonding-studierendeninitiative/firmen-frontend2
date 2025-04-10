import * as Sentry from '@sentry/sveltekit';
import { handle as handleAuth } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

// hooks.server.ts
import { createContext } from '$lib/trpc/context';
import { createTRPCHandle } from 'trpc-sveltekit';
import { mainRouter } from '@/trpc/router';

Sentry.init({
	dsn: 'https://f1933902b8f781edc8b707ee9d75ea53@o4508733953540096.ingest.de.sentry.io/4508733955571792',
	tracesSampleRate: 1,
	environment: process.env.NODE_ENV
});

export const handle = sequence(
	Sentry.sentryHandle(),
	handleAuth,
	createTRPCHandle({
		router: mainRouter,
		createContext,
		onError: (error) =>
			console.error(
				`Encountered error while trying to process ${error.type} @ ${error.path}:`,
				error
			)
	})
);
export const handleError = Sentry.handleErrorWithSentry();

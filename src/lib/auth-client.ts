import { createAuthClient } from 'better-auth/svelte';
import {
	adminClient,
	inferAdditionalFields,
	jwtClient,
	magicLinkClient,
	organizationClient,
	ssoClient
} from 'better-auth/client/plugins';
import type { auth } from './auth';
export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: 'http://localhost:5173',
	plugins: [
		adminClient(),
		jwtClient(),
		inferAdditionalFields<typeof auth>(),
		magicLinkClient(),
		organizationClient({}),
		ssoClient()
	]
});

// Export with both names for compatibility
export const client = authClient;
export default authClient;

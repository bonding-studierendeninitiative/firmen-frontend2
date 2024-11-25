import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0 from '@auth/sveltekit/providers/auth0';
import {
	ADMIN_AUTH0_CLIENT_ID,
	ADMIN_AUTH0_CLIENT_SECRET,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	AUTH0_DOMAIN
} from '$env/static/private';

export const { handle } = SvelteKitAuth({
	trustHost: true,
	providers: [
		Auth0({
			id: 'auth0',
			name: 'Login by Auth0',
			clientId: AUTH0_CLIENT_ID,
			clientSecret: AUTH0_CLIENT_SECRET,
			issuer: AUTH0_DOMAIN,
			authorization: {
				params: {
					scope: 'openid profile email',
					audience: 'https://dev-bonding-firmen-backend'
				}
			}
		}),
		Auth0({
			id: 'auth0-admin',
			name: 'Admin Login by Auth0',
			clientId: ADMIN_AUTH0_CLIENT_ID,
			clientSecret: ADMIN_AUTH0_CLIENT_SECRET,
			issuer: AUTH0_DOMAIN,
			authorization: {
				params: {
					scope: 'openid profile email',
					audience: 'https://dev-bonding-firmen-backend'
				}
			},
			profile(profile) {
				return {
					...profile
				};
			}
		})
	],
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && account.access_token) {
				token.accessToken = account.access_token;
				const tokenPayload = JSON.parse(atob(account.access_token?.split('.')[1]));
				token.role = tokenPayload['https://dev-bonding-firmen/roles'][0] || 'user';
				token.externalUserId = account.providerAccountId;
				token.expires_at = account.expires_at;
			} else if (Number(token?.expires_at || 0) < Date.now() / 1000) {
				throw new Error('Token expired');
			}
			if (profile) {
				token.nickname = profile.nickname;
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.accessToken,
				externalUserId: token.externalUserId,
				user: {
					...session.user,
					nickname: token.nickname,
					role: token.role
				}
			};
		}
	}
});

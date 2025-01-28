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
					scope: 'openid profile email offline_access',
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
				const tokenPayload = JSON.parse(atob(account.access_token?.split('.')[1]));
				return {
					...token,
					access_token: account.access_token,
					refresh_token: account.refresh_token,
					expires_at: account.expires_at,
					externalUserId: account.providerAccountId,
					role: tokenPayload['https://dev-bonding-firmen/roles'][0] || 'User',
					nickname: profile?.nickname ?? undefined
				};
			} else if (Date.now() < Number(token.expires_at || 0) * 1000) {
				return token;
			} else if (account) {
				// Subsequent logins, but the `access_token` has expired, try to refresh it
				if (!token.refresh_token) throw new TypeError('Missing refresh_token');

				try {
					// The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
					// at their `/.well-known/openid-configuration` endpoint.
					const response = await fetch(`${AUTH0_DOMAIN}/oauth/token`, {
						method: 'POST',
						body: new URLSearchParams({
							client_id: AUTH0_CLIENT_ID,
							client_secret: AUTH0_CLIENT_SECRET,
							grant_type: 'refresh_token',
							refresh_token: token.refresh_token
						}),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});

					const tokensOrError = await response.json();

					if (!response.ok) throw tokensOrError;

					const newTokens = tokensOrError as {
						access_token: string;
						expires_in: number;
						refresh_token?: string;
					};

					token.access_token = newTokens.access_token;
					token.expires_at = Math.floor(Date.now() / 1000 + newTokens.expires_in);
					// Some providers only issue refresh tokens once, so preserve if we did not get a new one
					if (newTokens.refresh_token) token.refresh_token = newTokens.refresh_token;
					return token;
				} catch (error) {
					console.error('Error refreshing access_token', error);
					// If we fail to refresh the token, return an error so we can handle it on the page
					token.error = 'RefreshTokenError';
					return token;
				}
			}
		},
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.access_token,
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

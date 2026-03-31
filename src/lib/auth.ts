import { betterAuth } from 'better-auth';
import {
	jwt,
	organization,
	admin,
	magicLink,
	openAPI,
	bearer,
	createAuthMiddleware,
	oidcProvider
} from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '@prisma-app/client'; // Adjust the import path if necessary
import { sso } from '@better-auth/sso';
import { createPublicContext } from './remote/context';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

const prisma = new PrismaClient();
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'sqlite' // or "mysql", "postgresql", ...etc,
		// Additional options for the adapter can be specified here,
	}),
	trustedOrigins: [process.env.PUBLIC_BACKEND_HOST ?? '', process.env.PUBLIC_APP_URL ?? ''],
	user: {
		additionalFields: {
			metadata: {
				type: 'string',
				defaultValue: '{}',
				transform: {
					input(value) {
						// console.log('Transforming input metadata:', value);
						// console.log('Type of value at input:', typeof value);
						if (value === null || value === undefined || typeof value === 'string') {
							return value;
						}
						return JSON.stringify(value);
					},
					output(value) {
						// console.log('Transforming output metadata:', value);
						// console.log('Type of value at output:', typeof value);
						if (value === null || value === undefined || typeof value === 'object') {
							return value;
						}
						return JSON.parse(value as string);
					}
				},
				input: true
			}
		}
	},
	socialProviders: {
		microsoft: {
			clientId: process.env.MICROSOFT_CLIENT_ID || '',
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
			tenantId: process.env.MICROSOFT_TENANT_ID || ''
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
			scope: ['read:user', 'user:email', 'read:org']
			// Optional: specify the scopes you need
		},
		linkedin: {
			clientId: process.env.LINKEDIN_CLIENT_ID || '',
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET || ''
		}
	},

	plugins: [
		// Add any plugins you need here
		organization({
			async sendInvitationEmail(data, request) {
				// Implement your email sending logic here
			}
		}),
		bearer({}),
		jwt({
			jwt: {
				audience: process.env.BETTER_AUTH_URL,
				issuer: process.env.BETTER_AUTH_URL,
				definePayload: ({ user, session }) => {
					return {
						email: user.email,
						role: user.role,
						name: user.name,
						banned: user.banned || false,
						...(user.metadata ? { metadata: user.metadata } : {}),
						activeOrganizationId: session.activeOrganizationId
					};
				},
				expirationTime: '3m'
			},
			jwks: {
				keyPairConfig: {
					alg: 'RS256'
				}
			}
		}),
		admin({
			// Optional: specify the admin role name
			adminRoles: 'admin'
		}),
		magicLink({
			disableSignUp: true,
			// Optional: specify the magic link settings
			sendMagicLink: async ({ email, token, url }, request) => {
				// Implement your email sending logic here
				const context = await createPublicContext({ request });
				const result = await context.api.request('post', '/api/auth/magic_link', {
					body: { email, link: url, locale: 'de' }
				});

				if (!result.ok) {
					console.error('Error sending magic link notification:', await result.text());
				} else {
					console.log(`Sent magic link notification to ${email}`);
				}

				// For demonstration purposes, we'll just log the magic link details
				console.log(`Sending magic link to ${email} with token ${token} to url ${url}`);
			}
		}),
		openAPI(),
		sso({
			async provisionUser({ provider, user, userInfo, token }) {
				// Implement your user provisioning logic here
				console.log('Provisioning user from SSO provider:');
				console.log({ provider, user, userInfo, token });
			}
		}),
		oidcProvider({
			loginPage: '/sign-in',
			useJWTPlugin: true,
			trustedClients: [
				{
					clientId: 'spring-boot-client',
					clientSecret: 'your-client-secret',
					type: 'web',
					skipConsent: true,
					name: 'Spring Boot Client',
					disabled: false,
					metadata: {
						internal: true
					},
					redirectURLs: [`${process.env.PUBLIC_BACKEND_URL}/api/auth/callback/blerk`]
				}
			]
		}),
		sveltekitCookies(getRequestEvent)
	],
	secret: process.env.BETTER_AUTH_SECRET,
	hooks: {
		after: createAuthMiddleware(async ({ path, headers, params, context }) => {
			// This function runs after the authentication process
			if (path.includes('/callback/:id') && (params.id === 'github' || params.id === 'microsoft')) {
				// After the auth callback is processed, check the provider and perform organization/role adjustments
				try {
					// Ensure we always have a Headers instance (API expects Headers)
					const hdrs = headers ?? new Headers();
					hdrs.append('Authorization', `Bearer ${context.newSession?.session.token}`);

					const session = await auth.api.getSession({ headers: hdrs });

					if (session?.user) {
						const userId = session.user.id;

						if (params.id === 'github') {
							const userName = session.user.name;
							// Check if this user has a GitHub provider account and extract an access token
							const token = await auth.api.getAccessToken({
								body: { providerId: 'github' },
								headers: hdrs
							});

							const allowedOrg = process.env.PUBLIC_ALLOWED_GITHUB_ORG;
							if (!allowedOrg) {
								console.warn(
									'PUBLIC_ALLOWED_GITHUB_ORG is not set — skipping GitHub org membership check'
								);
							} else if (!token) {
								console.warn(
									'No GitHub access token found for user — cannot verify org membership'
								);
							} else {
								try {
									// Query GitHub for organizations the user belongs to
									const res = await fetch(
										`https://api.github.com/orgs/${allowedOrg}/members/${userName}`,
										{
											headers: {
												Authorization: `Bearer ${token.accessToken}`,
												Accept: 'application/vnd.github+json'
											}
										}
									);

									if (!res.ok) {
										console.warn(
											'User is not member of the necessary github org',
											res.status,
											await res.text()
										);
									} else {
										// Grant admin role in our DB
										try {
											await prisma.user.update({
												where: { id: userId },
												data: { role: 'admin' }
											});
										} catch (error) {
											console.error('Error setting GitHub user as admin', error);
										}

										// Optionally add to root organization as admin if configured
										const rootOrgId = process.env.PUBLIC_BONDING_ORG_ID;
										if (rootOrgId) {
											try {
												const orgMembers = await prisma.member.findFirst({
													where: {
														userId,
														organizationId: rootOrgId
													}
												});
												const isMemberOfRoot = orgMembers ? true : false;
												if (!isMemberOfRoot) {
													await auth.api.addMember({
														body: { organizationId: rootOrgId, userId, role: 'owner' }
													});
													console.log(
														`Added GitHub user ${session.user.email} as owner to root organization`
													);
												}
											} catch (error) {
												console.error('Error adding GitHub user to owner organization:', error);
											}
										}
									}
								} catch (error) {
									console.error('Error verifying GitHub org membership:', error);
								}
							}
						} else if (params.id === 'microsoft') {
							// Microsoft/Entra sign-in: add to root organization with manager role
							const rootOrgId = process.env.PUBLIC_BONDING_ORG_ID;
							if (!rootOrgId) {
								console.warn(
									'PUBLIC_BONDING_ORG_ID is not set — cannot add Microsoft user to root organization'
								);
							} else {
								try {
									const orgMembers = await auth.api.listMembers({
										query: { organizationId: rootOrgId, limit: 1000, offset: 0 },
										headers: hdrs
									});
									const isMember = orgMembers.members?.some((m: any) => m.userId === userId);
									if (!isMember) {
										// addMember expects a limited set of role values in types; cast payload to any so custom "manager" role can be used if supported by backend
										const payload: any = { organizationId: rootOrgId, userId, role: 'manager' };
										await auth.api.addMember({ body: payload, headers: hdrs });
										console.log(
											`Added Microsoft user ${session.user.email} as manager to root organization`
										);
									}
								} catch (error) {
									console.error('Error adding Microsoft user to root organization:', error);
								}
							}
						}
					}
				} catch (error) {
					console.error('Error checking provider authentication:', error);
				}
				return context.returned;
			}
			return context.returned;
		})
	}
});

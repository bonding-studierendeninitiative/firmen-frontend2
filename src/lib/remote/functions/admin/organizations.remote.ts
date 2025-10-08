import { command, form, query } from '$app/server';
import {
	object,
	string,
	number,
	optional,
	boolean,
	union,
	literal,
	array,
	nullish,
	pipe,
	nonEmpty,
	email
} from 'valibot';

import { error } from '@sveltejs/kit';
import { generateId } from 'better-auth';
import { createAdminContext } from '@/remote/context';

export const getOrgs = query(
	object({
		query: string(),
		page: nullish(number(), 0),
		limit: nullish(number(), 10),
		includeMembers: nullish(boolean(), true),
		orderBy: nullish(union([literal('name'), literal('createdAt'), literal('members')]), 'name'),
		sortDirection: nullish(union([literal('asc'), literal('desc')]), 'asc')
	}),
	async ({ includeMembers, limit, page, orderBy, query, sortDirection }) => {
		const ctx = await createAdminContext();
		const orgs = await ctx.db.organization.findMany({
			where: {
				name: {
					contains: query
				}
			},
			include: {
				members: includeMembers
					? {
							select: {
								id: true,
								organizationId: true,
								userId: true,
								role: true
							}
						}
					: false
			},
			orderBy: {
				...(orderBy !== 'members'
					? { [orderBy]: sortDirection }
					: {
							members: {
								_count: sortDirection
							}
						})
			},
			skip: page * limit,
			take: limit
		});
		return {
			data: orgs,
			totalCount: orgs.length,
			page: page,
			limit: limit
		};
	}
);

export type OrganizationsResponse = Exclude<ReturnType<typeof getOrgs>['current'], undefined>;

export const getLegacyOrgs = query(
	object({
		page: string(),
		size: string(),
		query: string()
	}),
	async ({ page, size, query }) => {
		const ctx = await createAdminContext();

		const response = await ctx.adminApi.get('/api/v2/admin/organization', {
			query: {
				page: Number(page),
				query: query,
				size: Number(size)
			}
		});
		return response;
	}
);

export const importLegacyOrg = command(
	object({
		legacyOrgId: string(),
		request: object({
			organizationName: optional(string()),
			contactPeople: optional(array(string())),
			adminContactPerson: optional(string()),
			createAddress: optional(boolean()),
			billingAddress: optional(
				object({
					street: string(),
					country: string(),
					zipCode: string(),
					city: string(),
					vat: string(),
					billingReference: string()
				})
			)
		})
	}),
	async ({ legacyOrgId, request }) => {
		const ctx = await createAdminContext();

		const legacyOrg = await ctx.adminApi.get('/api/v2/admin/organization/{id}', {
			path: {
				id: legacyOrgId
			}
		});

		if (Number(request.contactPeople?.length) < 1) {
			error(400, 'At least one contact person is required');
		}

		const adminContactPerson =
			Number(request.adminContactPerson?.length) > 0
				? request.adminContactPerson
				: request.contactPeople?.[0];

		const adminContact =
			legacyOrg.contactPeople?.find((contact) => contact.legacyId === adminContactPerson) ??
			legacyOrg.contactPeople?.[0];

		const nonAdminContactPeople =
			request.contactPeople
				?.filter((contactPerson) => contactPerson !== adminContact?.legacyId)
				.map((contactPerson) =>
					legacyOrg.contactPeople?.find((contact) => contact.legacyId === contactPerson)
				)
				.filter(Boolean) || [];

		const existingOrg = await ctx.db.organization.findFirst({
			where: {
				name: request.organizationName
			}
		});

		if (existingOrg) {
			error(409, 'Organization already exists');
		}

		const alreadyExistingUsers = await ctx.db.user.findMany({
			where: {
				email: {
					in: [
						...(adminContact ? [adminContact.email || ''] : []),
						...nonAdminContactPeople.map((contact) => contact?.email || '')
					].filter(Boolean)
				}
			}
		});

		if (alreadyExistingUsers.length > 0) {
			error(409, 'Some users already exist');
		}

		const availableOrgName = request.organizationName as string;

		await ctx.db.$transaction(async (tx) => {
			try {
				const org = await tx.organization.create({
					data: {
						name: availableOrgName,
						members: {
							create: [
								{
									role: 'owner',
									id: generateId(),
									createdAt: new Date(),
									user: {
										create: {
											name: adminContact?.firstName + ' ' + adminContact?.lastName || 'Admin',
											email: adminContact?.email || '',
											role: 'user',
											id: generateId(),
											emailVerified: true,
											createdAt: new Date(),
											updatedAt: new Date(),
											metadata: JSON.stringify({
												private: {
													legacyId: adminContactPerson
												}
											})
										}
									}
								},
								...(nonAdminContactPeople.map((contact) => ({
									role: 'member',
									id: generateId(),
									createdAt: new Date(),
									user: {
										create: {
											name: contact?.firstName + ' ' + contact?.lastName || 'User',
											email: contact?.email || '',
											role: 'user',
											emailVerified: true,
											id: generateId(),
											createdAt: new Date(),
											updatedAt: new Date(),
											metadata: JSON.stringify({
												private: {
													legacyId: contact?.legacyId
												}
											})
										}
									}
								})) ?? [])
							]
						},
						id: generateId(),
						slug:
							request.organizationName
								?.trim()
								.toLowerCase()
								.replace(/\s+/g, '-')
								.replace(/[^a-z0-9-]/g, '')
								.concat('-' + generateId(6)) || '',
						createdAt: new Date()
					}
				});

				if (request.createAddress) {
					await ctx.api.post('/api/v2/organization/{organizationId}/billing-address-template', {
						path: {
							organizationId: org?.id
						},
						body: {
							street: request.billingAddress?.street || '',
							country: request.billingAddress?.country || '',
							zipCode: request.billingAddress?.zipCode || '',
							city: request.billingAddress?.city || '',
							vat: request.billingAddress?.vat || '',
							billingReference: request.billingAddress?.billingReference || '',
							organizationName: request.organizationName || ''
						}
					});
				}

				/* const nonAdminContactPersonIds =
						request.contactPeople?.filter(
							(contactPersonId) => contactPersonId !== adminContactPerson
						) || [];
					for (const contactPersonId of nonAdminContactPersonIds) {
						const userContactPerson = legacyOrg.contactPeople?.find(
							(contact) => contact.legacyId === contactPersonId
						);
						await tx.member.create({
							data: {
								organization: {
									connect: {
										id: org.id
									}
								},
								role: 'member',
								id: generateId(),
								createdAt: new Date(),
								user: {
									create: {
										name:
											userContactPerson?.firstName + ' ' + userContactPerson?.lastName || 'User',
										email: userContactPerson?.email || '',
										role: 'user',
										emailVerified: true,
										id: generateId(),
										createdAt: new Date(),
										updatedAt: new Date(),
										metadata: JSON.stringify({
											private: {
												legacyId: contactPersonId
											}
										})
									}
								}
							}
						});
					}*/
				getOrgs({ query: '' }).refresh();
			} catch (e) {
				console.error('Error during organization import:', e);
				error(500, 'Failed to import organization');
			}
		});
	}
);

export const getLegacyOrgDetails = query(
	object({
		orgId: string()
	}),
	async ({ orgId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get('/api/v2/admin/organization/{id}', {
			path: {
				id: orgId
			}
		});
		return response;
	}
);

export const createOrganizationByAdminForm = form(
	object({
		name: pipe(string(), nonEmpty()),
		ownerMail: pipe(string(), nonEmpty('Please provide an email address'), email('Invalid email'))
	}),
	async (input) => {
		const ctx = await createAdminContext();

		await ctx.db.$transaction(
			async (tx) => {
				try {
					const organization = await tx.organization.create({
						data: {
							name: input.name,
							slug: input.name.toLowerCase().replace(/\s+/g, '-'),
							metadata: JSON.stringify({
								public: {
									name: input.name,
									slug: input.name.toLowerCase().replace(/\s+/g, '-')
								}
							}),
							id: generateId(),
							createdAt: new Date()
						}
					});

					if (!organization) {
						error(500, 'Could not create organization');
					}

					const owner = await tx.user.findUnique({ where: { email: input.ownerMail } });

					if (!owner) {
						error(404, { message: 'Owner not found' });
					}

					const session = ctx.session;
					const organizationId = organization.id;

					const alreadyMember = await ctx.db.member.findFirst({
						where: {
							user: {
								email: input.ownerMail
							},
							organizationId: organizationId
						}
					});
					if (alreadyMember) {
						error(400, { message: 'User is already a member of this organization' });
					}
					const alreadyInvited = await ctx.db.invitation.findMany({
						where: {
							AND: {
								email: input.ownerMail,
								organizationId: organizationId
							}
						}
					});

					// If there's an existing invitation, reuse it
					if (alreadyInvited.length) {
						const existingInvitation = alreadyInvited[0];

						// Update the invitation's expiration date using the same logic as createInvitation
						const defaultExpiration = 60 * 60 * 48; // 48 hours in seconds
						const newExpiresAt = new Date(Date.now() + defaultExpiration * 1000);

						await ctx.db.invitation.update({
							where: {
								id: existingInvitation.id
							},
							data: {
								expiresAt: newExpiresAt
							}
						});

						/*const updatedInvitation = {
							...existingInvitation,
							expiresAt: newExpiresAt
						};

						await ctx.api.post("/api/v2/notifications/org-member", {
					body: {
						adminId: ctx.session?.userId,
						id: updatedInvitation.id,
						role: updatedInvitation.role as string,
						email: updatedInvitation.email.toLowerCase(),
						organization: organization,
						inviter: {
							...member,
							user: session.user
						},
						invitation: updatedInvitation as unknown as Invitation
					},
					ctx.request
				);*/
					}

					const pendingInvitations = await ctx.db.invitation.findMany({
						where: {
							organizationId: organizationId,
							status: 'pending'
						}
					});

					if (pendingInvitations.length >= 100) {
						error(400, { message: 'Too many pending invitations' });
					}

					const invitationData = {
						role: 'owner',
						email: input.ownerMail.toLowerCase(),
						organizationId: organizationId
					};

					await ctx.db.invitation.create({
						data: {
							...invitationData,
							id: generateId(),
							expiresAt: new Date(Date.now() + 60 * 60 * 48 * 1000), // 48 hours from now,
							status: 'pending',
							inviterId: session!.userId
						}
					});

					/* await ctx.context.orgOptions.sendInvitationEmail?.(
				{
					id: invitation.id,
					role: invitation.role as string,
					email: invitation.email.toLowerCase(),
					organization: organization,
					inviter: {
						...member,
						user: session.user
					},
					//@ts-expect-error
					invitation
				},
				ctx.request
			); */
					getOrgs({
						query: ''
					}).refresh();
				} catch (error) {
					console.error(error);
				}
			},
			{
				timeout: 10000 // 10 seconds
			}
		);
	}
);

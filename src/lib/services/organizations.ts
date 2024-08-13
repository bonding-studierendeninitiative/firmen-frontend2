import { API } from '@api';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

const APIOrgMembership = v.object({
	organizationId: v.string(),
	organizationName: v.string(),
	membershipType: v.string(),
	organizationSlug: v.string()
});

export type OrgMembership = v.InferInput<typeof APIOrgMembership>;

const GetOrgMembershipsResponse = v.object({
	memberships: v.array(APIOrgMembership),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

const GetOrgDetailsResponse = v.object({
	'id': v.string(),
	'slug': v.string(),
	'name': v.string(),
	'organizationEmail': v.pipe(v.string(), v.email()),
	'organizationPhone': v.string(),
	'organizationWebsite': v.nullish(v.string()),
	'defaultBillingAddressId': v.nullable(v.string()),
	'organizationAddress': v.object({
		'street': v.string(),
		'country': v.pipe(v.string(), v.length(2, 'Must be 2 characters')),
		'zipCode': v.string(),
		'city': v.nullable(v.string())
	}),
	'createdAt': v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	'modifiedAt': v.pipe(v.string(), v.isoTimestamp())
});

export const CreateOrganizationRequestSchema = v.object({
	name: v.pipe(
		v.string('Name is required'),
		v.minLength(3, 'Name is required'),
		v.maxLength(30, 'Max 30 characters')
	),
	phone: v.string(),
	size: v.string(),
	email: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.email('Invalid email')
	),
	streetAddress: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.maxLength(30, 'Max 40 characters')
	),
	extendedAddress: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(150, 'Max 150 characters')
		)
	),
	zipCode: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.maxLength(10, 'Max 10 characters')
	),
	locality: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.maxLength(40, 'Max 40 characters')
	),
	type: v.string()
});

export type CreateOrganizationRequest = v.InferInput<typeof CreateOrganizationRequestSchema>;

const CreateOrganizationResponse = v.object({
	createdOrganization: v.object({
		id: v.string(),
		slug: v.string(),
		name: v.string(),
		organizationEmail: v.string(),
		organizationPhone: v.string(),
		organizationWebsite: v.optional(v.string()),
		defaultBillingAddressId: v.optional(v.string()),
		organizationAddress: v.object({
			street: v.string(),
			country: v.string(),
			zipCode: v.string(),
			city: v.optional(v.string())
		}),
		createdAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
		modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp()))
	}),
	creator: v.string()
});

export const getOrgMemberships = async ({ accessToken }: { accessToken: string }) => {
	try {
		const response = await API.get<v.InferInput<typeof GetOrgMembershipsResponse>>({
			route: '/contact-person/memberships?page=0&limit=4',
			token: accessToken
		});

		if (response.status === 204) {
			return [];
		}

		if (response.status === 404) {
			return [];
		}

		const data = await response.json();
		const responseJson = v.parse(GetOrgMembershipsResponse, data);
		return responseJson.memberships;
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const getOrganizationDetails = async ({ accessToken, slug }: { accessToken: string, slug: string }) => {
	const response = await API.get({
		route: `/organization/${slug}`,
		token: accessToken
	});

	if (response.status === 401) {
		error(401, 'Unauthorized');
	}

	if (response.status === 404) {
		error(404, 'Organization not found');
	}

	if (response.status === 422) {
		error(404, 'Organization not found');
	}

	const data = await response.json();
	return v.parse(GetOrgDetailsResponse, data);
};

export const createOrganization = async ({ accessToken, data }: {
	accessToken: string,
	data: CreateOrganizationRequest
}) => {
	try {
		const parsed = v.parse(CreateOrganizationRequestSchema, data);
		const response = await API.post({
			route: '/organization',
			token: accessToken,
			data: parsed
		});
		const responseData = await response.json();
		const responseJson = v.parse(CreateOrganizationResponse, responseData);
		return responseJson.createdOrganization;
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};
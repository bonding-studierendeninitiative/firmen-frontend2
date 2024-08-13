import { API } from '@api';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

const GetPortraitTemplatesResponse = v.object({
	portraitTemplates: v.array(v.object({
		id: v.string(),
		title: v.string(),
		displayName: v.string(),
		lastModifiedAt: v.nullish(v.pipe(v.string(), v.isoTimestamp()))
	})),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export const GetPortraitTemplateResponse = v.object({
	id: v.string(),
	title: v.string(),
	'comment': v.string(),
	'industry': v.string(),
	'products': v.string(),
	'locations_worldwide': v.string(),
	'locations_europe': v.string(),
	'locations_germany': v.string(),
	'revenue_worldwide': v.string(),
	'revenue_europe': v.string(),
	'revenue_germany': v.string(),
	'employees_worldwide': v.string(),
	'employees_europe': v.string(),
	'employees_germany': v.string(),
	'graduates': v.string(),
	'desiredDisciplines': v.string(),
	'entryOptions': v.string(),
	'offersThesis': v.boolean(),
	'offersOutOfCountryWork': v.boolean(),
	'offersInternships': v.boolean(),
	'contactAddress': v.string(),
	'contactPersonStudents': v.string(),
	'contactPersonGraduates': v.string(),
	'website': v.string(),
	'additionalInformation': v.string(),
	'displayName': v.string(),
	'modifiedAt': v.nullish(v.pipe(v.string(), v.isoTimestamp())),
	'createdAt': v.pipe(v.string(), v.isoTimestamp())
});

const hasMaxFiveLines = (input: string) => {
	const lines = input.split('\n');
	return lines.length <= 5;
};

export const CreatePortraitTemplateRequestSchema = v.object({
	title: v.pipe(v.string('Title is required'), v.minLength(1, 'Title is required')),
	comment: v.optional(v.string(), ''),
	industry: v.string(),
	products: v.optional(v.string(), ''),
	locations_worldwide: v.string(),
	locations_europe: v.string(),
	locations_germany: v.string(),
	revenue_worldwide: v.string(),
	revenue_europe: v.string(),
	revenue_germany: v.string(),
	employees_worldwide: v.string(),
	employees_europe: v.string(),
	employees_germany: v.string(),
	graduates: v.optional(v.string(), ''),
	desiredDisciplines: v.optional(v.string(), ''),
	entryOptions: v.optional(v.string(), ''),
	offersThesis: v.optional(v.boolean(), false),
	offersOutOfCountryWork: v.optional(v.boolean(), false),
	offersInternships: v.optional(v.boolean(), false),
	contactAddress: v.optional(v.string(), ''),
	contactPersonStudents: v.optional(v.pipe(v.string(), v.check(hasMaxFiveLines, 'This field can only have 5 lines.')), ''),
	contactPersonGraduates: v.optional(v.string(), ''),
	website: v.string(),
	additionalInformation: v.string(),
	displayName: v.string()
});

export const DeletePortraitTemplateRequestSchema = v.object({
	id: v.string()
});

export type CreatePortraitTemplateRequest = typeof CreatePortraitTemplateRequestSchema;
export type UpdatePortraitTemplateRequest = CreatePortraitTemplateRequest;

const CreatePortraitTemplateResponseSchema = v.union(
	[
		CreatePortraitTemplateRequestSchema,
		v.object({
			id: v.string()
		})
	]
);

type CreatePortraitTemplateResponse = typeof CreatePortraitTemplateResponseSchema;

export type PortraitCompanyDetails = Pick<v.InferInput<CreatePortraitTemplateRequest>, 'industry' | 'products' | 'employees_germany' | 'employees_europe' | 'employees_worldwide' | 'revenue_germany' | 'revenue_europe' | 'revenue_worldwide' | 'locations_germany' | 'locations_europe' | 'locations_worldwide' | 'title'>;
export const PortraitCompanyDetailsSchema = v.pick(CreatePortraitTemplateRequestSchema, ['industry', 'products', 'employees_germany', 'employees_europe', 'employees_worldwide', 'revenue_germany', 'revenue_europe', 'revenue_worldwide', 'locations_germany', 'locations_europe', 'locations_worldwide', 'title']);
export const PortraitContactInfoSchema = v.pick(CreatePortraitTemplateRequestSchema, ['website', 'contactPersonGraduates', 'contactPersonStudents', 'contactAddress']);
export const getPortraitTemplates = async ({ accessToken, org, page = 0 }: {
	accessToken: string,
	org: string,
	page?: number
}) => {
	const response = await API.get<v.InferInput<typeof GetPortraitTemplatesResponse>>({
		route: `/portrait-template?organizationId=${org}&status=PUBLISHED&page=${page}&limit=6`,
		token: accessToken
	});
	if (response.status === 401) {
		error(401, 'Unauthorized');
	}
	if (response.status === 403) {
		error(403, 'Forbidden');
	}
	if (response.status === 404) {
		error(404, 'Not Found');
	}
	const data = await response.json();
	return v.parse(GetPortraitTemplatesResponse, data);
};

export const getPortraitTemplate = async ({ accessToken, portraitTemplateId }: {
	accessToken: string,
	portraitTemplateId: string
}) => {
	const response = await API.get<v.InferInput<typeof GetPortraitTemplateResponse>>({
		route: `/portrait-template/${portraitTemplateId}`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetPortraitTemplateResponse, data);
};

export const createPortraitTemplate = async ({ accessToken, org, data: request }: {
	accessToken: string,
	org: string,
	data: v.InferInput<CreatePortraitTemplateRequest>
}) => {
	const response = await API.post<v.InferInput<CreatePortraitTemplateResponse>>({
		route: '/portrait-template?organizationId=' + org,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return v.parse(CreatePortraitTemplateResponseSchema, data);
};

export const deletePortraitTemplate = async ({ accessToken, data: { id } }: {
	accessToken: string,
	data: v.InferInput<typeof DeletePortraitTemplateRequestSchema>
}) => {
	const response = await API.delete({
		route: `/portrait-template/${id}`,
		token: accessToken
	});
	if (response.status !== 204) {
		error(404, 'Not Found');
	}
};

export const updatePortraitDetails = async ({ accessToken, id, data: request }: {
	accessToken: string,
	id: string,
	data: Partial<v.InferInput<UpdatePortraitTemplateRequest>>
}) => {
	const response = await API.put<PortraitCompanyDetails>({
		route: `/portrait-template/${id}`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return v.parse(CreatePortraitTemplateResponseSchema, data);
};
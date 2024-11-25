import * as v from 'valibot';
import { hasMaxFiveLines } from '@/utils/string';

export const GetPortraitTemplatesResponse = v.object({
	portraitTemplates: v.array(
		v.object({
			id: v.string(),
			title: v.string(),
			displayName: v.string(),
			lastModifiedAt: v.nullish(v.pipe(v.string(), v.isoTimestamp()))
		})
	),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetPortraitTemplatesResponse = typeof GetPortraitTemplatesResponse;

export const PortraitTemplateSchema = v.object({
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
	contactPersonStudents: v.optional(
		v.pipe(v.string(), v.check(hasMaxFiveLines, 'This field can only have 5 lines.')),
		''
	),
	contactPersonGraduates: v.optional(v.string(), ''),
	website: v.string(),
	additionalInformation: v.string(),
	displayName: v.string()
});

export const GetPortraitTemplateResponse = v.union([
	PortraitTemplateSchema,
	v.object({
		id: v.string()
	})
]);

export const DeletePortraitTemplateRequestSchema = v.object({
	id: v.string()
});

export type CreatePortraitTemplateRequest = typeof PortraitTemplateSchema;
export type UpdatePortraitTemplateRequest = CreatePortraitTemplateRequest;

export type CreatePortraitTemplateResponse = typeof GetPortraitTemplateResponse;

export type PortraitCompanyDetails = Pick<
	v.InferInput<CreatePortraitTemplateRequest>,
	| 'industry'
	| 'products'
	| 'employees_germany'
	| 'employees_europe'
	| 'employees_worldwide'
	| 'revenue_germany'
	| 'revenue_europe'
	| 'revenue_worldwide'
	| 'locations_germany'
	| 'locations_europe'
	| 'locations_worldwide'
	| 'title'
>;
export const PortraitCompanyDetailsSchema = v.pick(PortraitTemplateSchema, [
	'industry',
	'products',
	'employees_germany',
	'employees_europe',
	'employees_worldwide',
	'revenue_germany',
	'revenue_europe',
	'revenue_worldwide',
	'locations_germany',
	'locations_europe',
	'locations_worldwide',
	'title'
]);
export const PortraitContactInfoSchema = v.pick(PortraitTemplateSchema, [
	'website',
	'contactPersonGraduates',
	'contactPersonStudents',
	'contactAddress'
]);

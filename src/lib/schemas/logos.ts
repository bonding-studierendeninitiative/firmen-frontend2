import { array, number, isoTimestamp, object, pipe, string, nullish } from 'valibot';

export const OrgLogoSchema = object({
	name: string(),
	eventRegistration: object({
		createdAt: pipe(string(), isoTimestamp()),
		modifiedAt: nullish(pipe(string(), isoTimestamp())),
		status: string(),
		userId: string(),
		event: object({
			id: string(),
			name: string(),
			location: string(),
			projectHSG: string(),
			dateFrom: string(),
			dateTo: string()
		})
	}),
	status: string(),
	url: string()
});

export type OrgLogoSchema = typeof OrgLogoSchema;

export const OrgLogoResponse = object({
	logos: array(OrgLogoSchema),
	pageNumber: number(),
	pageSize: number(),
	totalPages: number(),
	totalElements: number()
});

export type OrgLogosResponse = typeof OrgLogoResponse;

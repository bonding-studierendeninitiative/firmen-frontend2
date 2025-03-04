import { array, number, isoTimestamp, object, pipe, string, nullish } from 'valibot';

export const OrgAdvertisementSchema = object({
	name: string(),
	eventRegistration: object({
		createdAt: pipe(string(), isoTimestamp()),
		modifiedAt: nullish(pipe(string(), isoTimestamp())),
		status: object({
			code: number(),
			text: string()
		}),
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
	status: object({
		code: number(),
		text: string()
	}),
	url: string()
});

export type OrgAdvertisementSchema = typeof OrgAdvertisementSchema;

export const OrgAdvertisementResponse = object({
	advertisements: array(OrgAdvertisementSchema),
	pageNumber: number(),
	pageSize: number(),
	totalPages: number(),
	totalElements: number()
});

export type OrgAdvertisementsResponse = typeof OrgAdvertisementResponse;

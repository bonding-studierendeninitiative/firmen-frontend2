import {
	number,
	object,
	string,
	nullish,
	pipe,
	nonEmpty,
	union,
	literal,
	check,
	array
} from 'valibot';
import { DocumentFeedbackSchema } from '@schema/catalogueData';

export const AdvertisementSchema = object({
	id: string(),
	title: string(),
	mimeType: string(),
	size: nullish(number()),
	status: string(),
	url: string(),
	createdAt: string(),
	modifiedAt: nullish(string()),
	modifiedBy: nullish(string()),
	createdBy: nullish(string()),
	history: nullish(array(DocumentFeedbackSchema))
});

export type AdvertisementSchema = typeof AdvertisementSchema;

export const OrgAdvertisementResponse = object({
	advertisements: array(AdvertisementSchema),
	pageNumber: number(),
	pageSize: number(),
	totalPages: number(),
	totalElements: number()
});

export type OrgAdvertisementsResponse = typeof OrgAdvertisementResponse;

export const PickAdvertisementRequest = object({
	advertisementId: string(),
	eventRegistrationId: string(),
	organizationId: string()
});

export type PickAdvertisementRequest = typeof PickAdvertisementRequest;

export const DeleteAdvertisementRequest = object({
	advertisementId: pipe(string(), nonEmpty()),
	organizationId: pipe(string(), nonEmpty())
});

export type DeleteAdvertisementRequest = typeof DeleteAdvertisementRequest;

export const ReviewAdvertisementRequest = pipe(
	object({
		advertisementId: pipe(string(), nonEmpty()),
		documentChangeType: union([
			literal('confirmation'),
			literal('change-request'),
			literal('rejection')
		]),
		feedback: string()
	}),
	check(({ documentChangeType, feedback }) => {
		if (documentChangeType === 'rejection' || documentChangeType === 'change-request') {
			return feedback.length > 0;
		} else {
			return true;
		}
	}, 'Message cannot be empty')
);

export type ReviewAdvertisementRequest = typeof ReviewAdvertisementRequest;

export const ExportAdvertisementsRequest = object({
	eventRegistrationIds: array(string())
});

export type ExportAdvertisementsRequest = typeof ExportAdvertisementsRequest;

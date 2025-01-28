import { object, string, union, intersect, literal, file } from 'valibot';

export const ReviewCatalogueDataRequest = object({
	feedback: string(),
	feedbackType: union([literal('confirmation'), literal('change-request'), literal('rejection')]),
	documentType: union([literal('advert'), literal('portrait'), literal('logo')])
});

export type ReviewCatalogueDataRequest = typeof ReviewCatalogueDataRequest;

export const ReviewCatalogueDataForm = intersect([
	ReviewCatalogueDataRequest,
	object({
		eventRegistrationId: string()
	})
]);

export type ReviewCatalogueDataForm = typeof ReviewCatalogueDataForm;

export const UploadCatalogueDataRequest = object({
	documentType: union([literal('advert'), literal('logo')]),
	file: file()
});

export type UploadCatalogueDataRequest = typeof UploadCatalogueDataRequest;

export const UploadCatalogueDataForm = intersect([
	UploadCatalogueDataRequest,
	object({
		eventRegistrationId: string()
	})
]);

export type UploadCatalogueDataForm = typeof UploadCatalogueDataForm;

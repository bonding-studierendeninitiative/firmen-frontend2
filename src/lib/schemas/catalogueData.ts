import { object, string, enum as valiEnum, union, intersect, literal, variant } from 'valibot';

export enum FeedbackType {
	CONFIRMATION = 'confirmation',
	CHANGE_REQUEST = 'change-request',
	REJECTION = 'rejection'
}

export const documentTypes = ['advert', 'portrait', 'logo'] as const;

export type DocumentType = (typeof documentTypes)[number];

export const ReviewCatalogueDataRequest = object({
	feedback: string(),
	feedbackType: valiEnum(FeedbackType),
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

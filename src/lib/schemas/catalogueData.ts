import {
	object,
	string,
	union,
	intersect,
	literal,
	file,
	nonEmpty,
	pipe,
	array,
	transform,
	nullable
} from 'valibot';

export const ExportCatalogueDataRequest = object({
	documentType: union([literal('advert'), literal('logo')]),
	eventRegistrationIds: array(string())
});

export type ExportCatalogueDataRequest = typeof ExportCatalogueDataRequest;

export const UploadCatalogueDataRequest = object({
	documentType: union([literal('advert'), literal('logo')]),
	orgId: pipe(string(), nonEmpty()),
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

export const UploadAdvertisementRequest = object({
	orgId: pipe(string(), nonEmpty()),
	title: pipe(string(), nonEmpty('Cannot be empty')),
	file: file()
});

export type UploadAdvertisementRequest = typeof UploadAdvertisementRequest;

export const UploadLogoRequest = object({
	orgId: pipe(string(), nonEmpty()),
	title: pipe(string(), nonEmpty('Cannot be empty')),
	file: file()
});

export type UploadLogoRequest = typeof UploadLogoRequest;

export const DocumentFeedbackSchema = object({
	message: nullable(string()),
	feedbackType: pipe(
		string(),
		transform((input) => input.toLowerCase().replace('_', '-')),
		union([
			literal('confirmation'),
			literal('change-request'),
			literal('rejection'),
			literal('upload')
		])
	)
});

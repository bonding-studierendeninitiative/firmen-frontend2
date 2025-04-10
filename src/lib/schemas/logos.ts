import {
	array,
	check,
	literal,
	nonEmpty,
	nullish,
	number,
	object,
	pipe,
	string,
	union
} from 'valibot';
import { DocumentFeedbackSchema } from '@schema/catalogueData';

export const LogoSchema = object({
	id: string(),
	name: string(),
	title: string(),
	mimeType: string(),
	size: nullish(number()),
	status: pipe(
		string(),
		union([
			literal('missing'),
			literal('confirmed'),
			literal('uploaded'),
			literal('rejected'),
			literal('changes-requested')
		])
	),
	url: string(),
	createdAt: string(),
	modifiedAt: string(),
	modifiedBy: nullish(string()),
	createdBy: nullish(string()),
	history: nullish(array(DocumentFeedbackSchema))
});

export type LogoSchema = typeof LogoSchema;

export const LogosResponse = object({
	logos: array(LogoSchema),
	pageNumber: number(),
	pageSize: number(),
	totalPages: number(),
	totalElements: number()
});

export type LogosResponse = typeof LogosResponse;

export const PickLogoRequest = object({
	logoId: pipe(string(), nonEmpty()),
	eventRegistrationId: pipe(string(), nonEmpty()),
	organizationId: pipe(string(), nonEmpty())
});

export type PickLogoRequest = typeof PickLogoRequest;

export const DeleteLogoRequest = object({
	logoId: pipe(string(), nonEmpty()),
	organizationId: pipe(string(), nonEmpty())
});

export type DeleteLogoRequest = typeof DeleteLogoRequest;

export const ReviewLogoRequest = pipe(
	object({
		logoId: pipe(string(), nonEmpty()),
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

export type ReviewLogoRequest = typeof ReviewLogoRequest;

export const ExportLogosRequest = object({
	eventRegistrationIds: array(string())
});

export type ExportLogosRequest = typeof ExportLogosRequest;

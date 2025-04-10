import { array, number, isoTimestamp, object, pipe, string, nullable } from 'valibot';
import { APIEvent } from '@schema/events';

export const ExportSchema = object({
	id: string(),
	objectKey: string(),
	type: string(),
	event: APIEvent,
	size: nullable(number()),
	files: nullable(number()),
	createdAt: pipe(string(), isoTimestamp())
});

export type Export = typeof ExportSchema;

export const ExportsResponse = object({
	exports: array(ExportSchema)
});

export type Exports = typeof ExportsResponse;

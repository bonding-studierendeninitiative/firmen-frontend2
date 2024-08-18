import * as v from 'valibot';

export const EventDetailsResponseSchema = v.object({
	id: v.string(),
	name: v.string(),
	status: v.string(),
	location: v.optional(v.string()),
	projectHSG: v.optional(v.string()),
	dateFrom: v.nullish(v.pipe(v.string(), v.isoDate())),
	dateTo: v.nullish(v.pipe(v.string(), v.isoDate())),
	timeFrom: v.nullish(v.pipe(v.string(), v.isoTimeSecond())),
	timeTo: v.nullish(v.pipe(v.string(), v.isoTimeSecond())),
	comment: v.nullish(v.string()),
	latestRegistration: v.nullish(v.pipe(v.string(), v.isoDate())),
	notesCategory: v.optional(v.string()),
	descriptionNotes: v.optional(v.string()),
	contactMail: v.nullish(v.string()),
	website: v.nullish(v.string()),
	additionalLink: v.nullish(v.string()),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullish(v.pipe(v.string(), v.isoTimestamp())),
	addons: v.array(v.object({})),
	packages: v.array(v.object({}))
});

export type EventDetailsResponse = typeof EventDetailsResponseSchema;

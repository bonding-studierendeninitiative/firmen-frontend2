import { ERROR_MESSAGE_KEYS } from '@constant';
import { z } from 'zod';
import * as v from 'valibot';

const { required, greaterStartDate, greaterStartTime } = ERROR_MESSAGE_KEYS;

const selectSchema = z.object({
	value: z.string(),
	label: z.string()
});

export const eventDetailSchema = z
	.object({
		eventName: z.string().min(1, required),
		city: selectSchema
			.nullable()
			.refine((city) => city !== null, {
				message: required,
				path: ['city']
			})
			.refine((city) => city !== undefined, {
				message: required,
				path: ['city']
			}),
		streetAndNumber: z.string().min(1, required),
		university: z.string().min(1, required),
		startDate: z.string().min(1, required),
		endDate: z.string().min(1, required),
		startTime: z.string().min(1, required),
		endTime: z.string().min(1, required),
		specialties: z.array(selectSchema).min(1, required),
		eventTemplate: selectSchema.nullable().optional(),
		addons: z.array(selectSchema).min(1, required),
		packages: z.array(selectSchema).min(1, required)
	})
	.refine(
		(data) => {
			const startDate = new Date(data.startDate);
			const endDate = new Date(data.endDate);
			if (!data.startDate || !data.endDate) return true;
			return startDate < endDate;
		},
		{
			message: greaterStartDate,
			path: ['startDate']
		}
	)
	.refine(
		(data) => {
			const startTime = new Date(data.startTime);
			const endTime = new Date(data.endTime);
			if (!data.startTime || !data.endTime) return true;
			return startTime.getTime() < endTime.getTime();
		},
		{
			message: greaterStartTime,
			path: ['startTime']
		}
	);
export type eventDetailTypes = z.infer<typeof eventDetailSchema>;

export const EventDetailsResponseSchema = v.object({
	id: v.string(),
	name: v.string(),
	location: v.optional(v.string()),
	projectHSG: v.optional(v.string()),
	dateFrom: v.nullable(v.pipe(v.string(), v.isoDate())),
	dateTo: v.nullable(v.pipe(v.string(), v.isoDate())),
	timeFrom: v.nullable(v.pipe(v.string(), v.isoTimeSecond())),
	timeTo: v.nullable(v.pipe(v.string(), v.isoTimeSecond())),
	comment: v.optional(v.string()),
	latestRegistration: v.nullable(v.pipe(v.string(), v.isoDate())),
	notesCategory: v.optional(v.string()),
	descriptionNotes: v.optional(v.string()),
	contactMail: v.optional(v.string()),
	website: v.optional(v.string()),
	additionalLink: v.optional(v.string()),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	addons: v.array(v.object({})),
	packages: v.array(v.object({}))
});

export type EventDetailsResponse = typeof EventDetailsResponseSchema;

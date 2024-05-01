import { ERROR_MESSAGE_KEYS } from '@constant';
import { z } from 'zod';

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

import { array, number, object, string } from 'valibot';

export const JobSchema = object({
	name: string(),
	status: string()
});

export type Job = typeof JobSchema;

export const JobsSchema = object({
	jobs: array(JobSchema),
	total: number(),
	limit: number()
});

export type Jobs = typeof JobsSchema;

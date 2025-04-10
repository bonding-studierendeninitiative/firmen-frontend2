import { API } from '@api';
import { type InferInput, parse } from 'valibot';
import { type Jobs, JobsSchema } from '@schema/jobs';

export async function getJobs({
	accessToken,
	stateName = 'SUCCEEDED',
	limit = '10',
	offset = '0'
}: {
	accessToken: string;
	stateName?: 'SUCCEEDED' | 'FAILED' | 'PROCESSING' | 'ENQUEUED' | 'SCHEDULED' | 'DELETED';
	limit?: string;
	offset?: string;
}) {
	const searchParams = new URLSearchParams({
		offset,
		limit,
		stateName
	});
	const response = await API.get<InferInput<Jobs>>({
		route: `/admin/jobs?${searchParams}`,
		token: accessToken
	});
	const data = await response.json();
	return parse(JobsSchema, data);
}

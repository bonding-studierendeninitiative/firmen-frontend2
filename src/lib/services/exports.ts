import { API } from '@api';
import { type InferInput, parse } from 'valibot';
import { type Exports, ExportsResponse } from '@schema';

export async function getExports({
	accessToken,
	eventId,
	limit = '10',
	page = '0'
}: {
	accessToken: string;
	limit?: string;
	page?: string;
	eventId: string;
}) {
	try {
		const searchParams = new URLSearchParams({
			page,
			limit
		});
		const response = await API.get<InferInput<Exports>>({
			route: `/admin/events/${eventId}/exports?${searchParams}`,
			token: accessToken
		});
		const data = await response.json();
		console.log('Loaded exports:', data);
		return parse(ExportsResponse, data);
	} catch (error) {
		console.error(error);
		return {
			exports: []
		};
	}
}

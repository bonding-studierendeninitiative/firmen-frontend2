import { parse } from 'valibot';
import { API } from '@api';
import { OrgAdvertisementResponse } from '@schema/advertisements';

export async function getOrgAdvertisements({
	organizationId,
	accessToken,
	fetch: fetchF = fetch,
	page = '0'
}: {
	organizationId: string;
	accessToken: string;
	fetch?: typeof fetch;
	page?: string;
}) {
	const searchParams = new URLSearchParams({
		page,
		limit: '10',
		sortBy: 'name', // default sort key, can be adjusted
		sortDirection: 'desc' // default sort direction, can be adjusted
	}).toString();

	const response = await API.get({
		route: `/organization/${organizationId}/advertisement?${searchParams}`,
		token: accessToken,
		fetch: fetchF
	});
	const data = await response.json();
	return parse(OrgAdvertisementResponse, data);
}

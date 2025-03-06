import { parse } from 'valibot';
import { API } from '@api';
import { OrgLogoResponse } from '@schema/logos';

export async function getOrgLogos({
	organizationId,
	accessToken,
	fetch: fetchF = fetch,
	page = '0',
	limit = '10',
	sortBy = 'name',
	sortDirection = 'desc'
}: {
	organizationId: string;
	accessToken: string;
	fetch?: typeof fetch;
	page?: `${number}`;
	limit?: `${number}`;
	sortBy?: string;
	sortDirection?: 'desc' | 'asc';
}) {
	const searchParams = new URLSearchParams({
		page,
		limit,
		sortBy,
		sortDirection
	}).toString();

	const response = await API.get({
		route: `/organization/${organizationId}/logo?${searchParams}`,
		token: accessToken,
		fetch: fetchF
	});
	const data = await response.json();
	return parse(OrgLogoResponse, data);
}

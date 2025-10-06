import { redirect } from '@sveltejs/kit';
import { getBuyOptions } from '@/remote/functions/admin';

export async function load({ params, parent }) {
	await parent();
	const data = await getBuyOptions({ eventId: params.id });

	if (data && Number(data?.totalElements) > 0) {
		redirect(302, `/admin/events/${params.id}/buy-options/${data?.buyOptions?.[0].id}`);
	}
}

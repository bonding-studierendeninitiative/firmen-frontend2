import { redirect } from '@sveltejs/kit';

export function load({ params }) {
	redirect(308, `/admin/events/${params.id}/buy-options/${params.buyOptionId}/editor`);
}

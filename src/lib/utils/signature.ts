import { WEBHOOK_EXPECTED_SECRET } from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { createHmac, timingSafeEqual } from 'crypto';

export function validateRequestSignature(event: RequestEvent) {
	const secret = WEBHOOK_EXPECTED_SECRET;

	const timestamp =
		event.request.headers.get('X-Timestamp') ?? error(400, 'Missing timestamp header');
	const signature =
		event.request.headers.get('X-Signature') ?? error(400, 'Missing signature header');

	const searchParams = event.url.searchParams;
	searchParams.append('timestamp', timestamp);

	searchParams.sort(); // Ensure consistent order of parameters

	const canonicalString = event.request.method + event.url.pathname + searchParams.toString();
	const expectedSignature = createHmac('sha256', secret).update(canonicalString).digest('base64');

	console.log(`Canonical String: ${canonicalString}`);
	console.log(`Expected Signature: ${expectedSignature}`);

	// Optional: Check timestamp freshness (e.g., within 5 minutes)
	if (Math.abs(Date.now() - parseInt(timestamp)) > 5 * 60 * 1000) {
		error(403, 'Stale request');
	}

	if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
		error(403, 'Invalid signature');
	}
}

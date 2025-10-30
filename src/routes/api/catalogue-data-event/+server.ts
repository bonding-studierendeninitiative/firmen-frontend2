import { validateRequestSignature } from '@/utils/signature';
import { sendUpdateToOrg } from '@api/broadcaster';
import { error, json, type RequestEvent } from '@sveltejs/kit';

type CatalogueDataEvent = {
	organizationId: string;
	documentId: string;
	versionId: string;
	type: string;
	documentType: string;
};

export async function POST(event: RequestEvent) {
	validateRequestSignature(event);

	// 2. Parse the payload
	let payload: CatalogueDataEvent;
	try {
		payload = (await event.request.json()) as CatalogueDataEvent;
	} catch (e) {
		console.error('Invalid JSON in webhook payload:', e);
		throw error(400, 'Bad Request: Invalid JSON payload');
	}

	const { organizationId, documentId, documentType } = payload;

	if (!organizationId || !documentId || !documentType) {
		console.warn('Missing fields in webhook payload:', payload);
		throw error(400, 'Bad Request: Missing required fields in payload');
	}

	// 3. Send the update to connected SSE clients for that organization
	sendUpdateToOrg(organizationId, 'catalogue-data-event', payload);

	console.log(
		`Webhook processed for org ${organizationId}, doc ${documentId}. document type: ${documentType}`
	);
	return json({ message: 'Webhook received and processed' }, { status: 200 });
}

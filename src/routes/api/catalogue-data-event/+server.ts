import { WEBHOOK_EXPECTED_SECRET } from '$env/static/private';
import { sendUpdateToOrg } from '@api/broadcaster';
import { error, json } from '@sveltejs/kit';

type CatalogueDataEvent = {
    organizationId: string;
    documentId: string;
    versionId: string;
    type: string;
    documentType: string
}

export async function POST({request}) {
    // 1. Authenticate the webhook
    const providedSecret = request.headers.get('X-Webhook-Signature'); // Or your chosen header
    if (!WEBHOOK_EXPECTED_SECRET) {
        console.error("Webhook secret not configured on SvelteKit server.");
        throw error(500, "Webhook endpoint misconfiguration.");
    }
    if (providedSecret !== WEBHOOK_EXPECTED_SECRET) {
        console.warn('Invalid webhook signature received.');
        throw error(401, 'Unauthorized: Invalid webhook signature');
    }

    // 2. Parse the payload
    let payload: CatalogueDataEvent;
    try {
        payload = (await request.json()) as CatalogueDataEvent;
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

    console.log(`Webhook processed for org ${organizationId}, doc ${documentId}. document type: ${documentType}`);
    return json({ message: 'Webhook received and processed' }, { status: 200 });
}
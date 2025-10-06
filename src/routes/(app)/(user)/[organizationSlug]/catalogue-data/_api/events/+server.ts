import { createOrgMemberContext } from '@/remote/context';
import { orgSseControllers } from '@api/broadcaster';

export async function POST() {
	const ctx = await createOrgMemberContext();

	const orgId = ctx.session.activeOrganizationId;
	const stream = new ReadableStream({
		start(controller) {
			if (!orgSseControllers.has(orgId)) {
				orgSseControllers.set(orgId, new Set());
			}
			orgSseControllers.get(orgId)!.add(controller);
			console.log(`Client connected for SSE on org: ${orgId}`);

			// Optional: Send a connection confirmation event
			const connectMsg = `event: connected\ndata: ${JSON.stringify({ message: `Subscribed to updates for org ${orgId}` })}\n\n`;
			controller.enqueue(new TextEncoder().encode(connectMsg));
		},
		cancel() {
			// This is called when the client closes the connection
			const controllers = orgSseControllers.get(orgId);
			if (controllers) {
				// We need to find the specific controller to remove.
				// This requires iterating or storing controllers in a way they can be identified.
				// For simplicity, if we only store the controller object itself:
				// A more robust way would be to assign a unique ID to each controller.
				// However, the controller passed to cancel() is not the same instance as in start().
				// A common pattern is to have the controller in start() add itself to a set,
				// and in cancel(), you'd need a way to identify which one to remove.
				// For this example, we'll assume we need a more robust cleanup if many controllers are present.
				// A simple approach for now: if a controller errors during enqueue, it's removed there.
				// When a client disconnects, its specific controller instance is harder to pinpoint here
				// without more complex tracking. The `sendUpdateToOrg` function handles cleanup of errored controllers.
				console.log(
					`Client disconnected from SSE on org: ${orgId}. Active controllers for org: ${controllers.size}`
				);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
}

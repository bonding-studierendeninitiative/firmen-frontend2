import { error } from '@sveltejs/kit';
import { building } from '$app/environment';

// IMPORTANT: This in-memory store is suitable for `adapter-node` or similar
// long-running server environments. For serverless (Vercel, Netlify),
// this will NOT work reliably as each function invocation is stateless.
// For serverless, you'd need an external pub/sub system (Redis, NATS,
// managed services like Ably/Pusher, or a dedicated WebSocket/SSE server).
// We'll proceed assuming a persistent server environment for this example.

interface SseController {
  controller: ReadableStreamDefaultController;
  orgId: string;
}

// Map: orgId -> Set of controllers for that org
export const orgSseControllers = new Map<string, Set<ReadableStreamDefaultController>>();

// This function will be called by the webhook handler
export function sendUpdateToOrg(
  orgId: string,
  eventName: string,
  data: unknown,
) {
  if (building) return; // Don't run on the server during build

  const controllers = orgSseControllers.get(orgId);
  if (controllers) {
    const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    const encodedMessage = new TextEncoder().encode(message);
    controllers.forEach((controller) => {
      try {
        controller.enqueue(encodedMessage);
      } catch (e) {
        // Likely stream closed, remove it
        console.warn(`Error enqueuing to controller for org ${orgId}, removing.`, e);
        controllers.delete(controller);
        if (controllers.size === 0) {
          orgSseControllers.delete(orgId);
        }
      }
    });
    console.log(`Sent SSE event '${eventName}' to ${controllers.size} clients for org ${orgId}`);
  } else {
    console.log(`No active SSE clients for org ${orgId} to send event '${eventName}'`);
  }
}
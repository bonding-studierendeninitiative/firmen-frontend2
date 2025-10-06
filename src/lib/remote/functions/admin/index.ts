// Re-export admin remote functions so components/pages can import from a single path.
// Example: import { getBuyOptions, createInviteForm } from '$lib/trpc/routers/admin';

export * from './addon-packages.remote';
export * from './buyOptions.remote';
export * from './catalogue-data.remote';
export * from './documents.remote';
export * from './event-registrations.remote';
export * from './events.remote';
export * from './exports.remote';
export * from './jobs.remote';
export * from './organization.remote';
export * from './organizations.remote';
export * from './user.remote';
export * from './users.remote';

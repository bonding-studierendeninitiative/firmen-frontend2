import { getRequestEvent, query } from '$app/server';
import type { BaseSchema, InferOutput } from 'valibot';
import { createPublicContext, createAuthenticatedContext, createOrgMemberContext } from './context';

export const publicQuery = <S extends BaseSchema<any, T, any>, T>(
	schema: S,
	fn: ({
		ctx,
		input
	}: {
		ctx: Awaited<ReturnType<typeof createPublicContext>>;
		input: InferOutput<S>;
	}) => T
) => {
	return query(schema, async (input) => {
		const ctx = await createPublicContext(getRequestEvent());

		fn({ ctx, input });
	});
};

export const authenticatedQuery = <S extends BaseSchema<any, T, any>, T>(
	schema: S,
	fn: ({
		ctx,
		input
	}: {
		ctx: Awaited<ReturnType<typeof createAuthenticatedContext>>;
		input: InferOutput<S>;
	}) => T
) => {
	return query(schema, async (input) => {
		const ctx = await createAuthenticatedContext();

		return fn({ ctx, input });
	});
};

export const orgMemberQuery = <S extends BaseSchema<any, T, any>, T>(
	schema: S,
	fn: ({
		ctx,
		input
	}: {
		ctx: Awaited<ReturnType<typeof createOrgMemberContext>>;
		input: InferOutput<S>;
	}) => T
) => {
	return query(schema, async (input) => {
		const ctx = await createOrgMemberContext();

		return fn({ ctx, input });
	});
};

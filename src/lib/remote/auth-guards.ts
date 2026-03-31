import { command, form, getRequestEvent, query } from '$app/server';
import type { BaseSchema, InferOutput } from 'valibot';
import { createPublicContext, createAuthenticatedContext, createOrgMemberContext } from './context';
import type { RemoteFormInput } from '@sveltejs/kit';
import type { StandardSchemaV1 } from '@standard-schema/spec';

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

export const orgMemberCommand = <S extends BaseSchema<any, T, any>, T>(
	schema: S,
	fn: ({
		ctx,
		input
	}: {
		ctx: Awaited<ReturnType<typeof createOrgMemberContext>>;
		input: InferOutput<S>;
	}) => T
) => {
	return command(schema, async (input) => {
		const ctx = await createOrgMemberContext();

		return fn({ ctx, input });
	});
};

export const orgMemberForm = <
	Schema extends StandardSchemaV1<RemoteFormInput, Record<string, any>>,
	T
>(
	schema: Schema,
	fn: ({
		ctx,
		input
	}: {
		ctx: Awaited<ReturnType<typeof createOrgMemberContext>>;
		input: RemoteFormInput;
	}) => T
) => {
	return form(schema, async (input) => {
		const ctx = await createOrgMemberContext();

		return fn({ ctx, input });
	});
};

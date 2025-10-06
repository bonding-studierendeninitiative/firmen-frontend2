/* eslint-disable svelte/prefer-svelte-reactivity */
import { goto } from '$app/navigation';
import type { Pathname } from '$app/types';
import { isHttpError } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';
import { get, writable } from 'svelte/store';
import {
	superForm,
	type FormOptions,
	type Infer,
	type InferIn,
	type SuperValidated
} from 'sveltekit-superforms';
import { valibotClient } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';

export type Awaitable<T> = T | Promise<T>;

export function successToast(message: string) {
	toast.success('Success', {
		description: message,
		classes: {
			description: 'text-white!'
		}
	});
}

export function errorToast(message: string) {
	toast.error('Error', {
		description: message,
		classes: {
			description: 'text-white!'
		},
		duration: 30000
	});
}

export function unknownErrorToast(error: unknown) {
	if (typeof error === 'string') errorToast(error);
	else if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof error.message === 'string'
	)
		errorToast(error.message);
	else if (isHttpError(error)) errorToast(error.body.message);
	else errorToast('An unknown error occurred');
}

type ResultSuccess<T = unknown> = { ok: true; data: T };

export interface CustomFormOptions<Out extends Record<string, unknown>> {
	remote?: (
		data: Out
	) => Promise<
		| ResultSuccess<SuperValidated<Out> | Pathname>
		| { ok: false; error: Error & { extra?: Record<string, unknown> } }
	>;
	onSuccessResult?: (data: Out) => Awaitable<void>;
	onErrorResult?: (error: Error) => Awaitable<void>;
}

export function valibotForm<
	S extends v.GenericSchema,
	Out extends Infer<S, 'valibot'>,
	In extends InferIn<S, 'valibot'>
>(
	form: SuperValidated<Out, unknown, In>,
	schema: S,
	{
		remote,
		invalidateAll: invalidate,
		onSuccessResult = (data) =>
			typeof data === 'object' && 'name' in data ? successToast(`${data.name} saved`) : undefined,
		onErrorResult = (error) => errorToast(error.message),
		onSubmit,
		onResult,
		...rest
	}: FormOptions<Out, unknown, In> & CustomFormOptions<Out> = {}
) {
	const pending = writable(false);
	const superform = superForm(form, {
		dataType: 'json',
		validators: valibotClient(schema),
		taintedMessage: 'You have unsaved changes. Are you sure you want to leave?',
		...rest,
		onSubmit: async (event) => {
			pending.set(true);
			if (remote) {
				event.cancel();

				const willInvalidate = invalidate !== false;
				const data = get(superform.form);
				const result = await remote(data);
				if (result.ok) {
					if (typeof result.data === 'string') {
						superform.tainted.set(undefined);
						await onSuccessResult(data);
						await goto(result.data, {
							invalidateAll: willInvalidate
						});
						return;
					}

					const hasErrors = Object.keys(result.data.errors).length > 0;
					superform.errors.set(result.data.errors);
					superform.message.set(result.data.message);
					superform.form.set(result.data.data, {
						taint: hasErrors ? true : 'untaint-form'
					});

					if (!hasErrors) await onSuccessResult(data);
					pending.set(false);
				} else {
					await onErrorResult(result.error);
					if (result.error.extra?.redirectTo && typeof result.error.extra.redirectTo === 'string') {
						superform.tainted.set(undefined);
						await goto(result.error.extra.redirectTo, {
							invalidateAll: willInvalidate
						});
					} else {
						const error = result.error.message;
						superform.errors.set({ _errors: [error] });
					}
					pending.set(false);
				}
			}

			onSubmit?.(event);
		},
		onResult(event) {
			if (event.result.type !== 'redirect') pending.set(false);
			if (['success', 'redirect'].includes(event.result.type)) {
				onSuccessResult(get(superform.form));
			}
			onResult?.(event);
		}
	});
	return {
		...superform,
		pending
	};
}

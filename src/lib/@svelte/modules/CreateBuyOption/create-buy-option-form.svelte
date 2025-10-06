<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { Minus, Plus } from '@lucide/svelte';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { type CreateBuyOptionRequest, CreateBuyOptionRequestSchema } from '@schema';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { page } from '$app/state';
	import { createBuyOption } from '@/trpc/routers/admin';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	interface Props {
		createForm: SuperValidated<Infer<CreateBuyOptionRequest>>;
		isDialogOpen?: boolean;
		onCreateBuyOption?: ({
			submit,
			form,
			data
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	}

	let { isDialogOpen = $bindable(false), createForm, onCreateBuyOption }: Props = $props();

	const superform = superForm(createForm, {
		validators: valibotClient(CreateBuyOptionRequestSchema),
		SPA: true
	});
	const { form: formData, validateForm } = superform;

	function decreaseServicesCount(e: Event) {
		e.preventDefault();
		const serviceCount = Number($formData.serviceCount);
		if (serviceCount > 0) {
			$formData.serviceCount = serviceCount - 1;
		}
	}

	function decreasePackagesCount(e: Event) {
		e.preventDefault();
		const packageCount = Number($formData.packageCount);
		if (packageCount > 0) {
			$formData.packageCount = packageCount - 1;
		}
	}

	function increaseServicesCount(e: Event) {
		e.preventDefault();
		const serviceCount = Number($formData.serviceCount);
		if (10 > serviceCount && serviceCount >= 0) {
			$formData.serviceCount = serviceCount + 1;
		}
	}

	function increasePackagesCount(e: Event) {
		e.preventDefault();
		const packageCount = Number($formData.packageCount);
		if (10 > packageCount && packageCount >= 0) {
			$formData.packageCount = packageCount + 1;
		}
	}
</script>

<form
	class="flex flex-col gap-y-4"
	{...createBuyOption.enhance(async ({ data, form, submit }) => {
		// formData.set({ ...$formData, ...Object.fromEntries(data) });
		const validatedForm = await validateForm({
			update: true
		});
		if (validatedForm.valid) {
			try {
				await onCreateBuyOption?.({ submit, form, data });
				isDialogOpen = false;
			} catch (error) {
				console.error(error?.message);
			}
		}
	})}
>
	<Field form={superform} name="eventId">
		<Control>
			{#snippet children({ props })}
				<Input {...props} type="hidden" value={page.params.id!} />
			{/snippet}
		</Control>
		<Description />
		<FieldErrors />
	</Field>
	<Field form={superform} name="name">
		<Control>
			{#snippet children({ props })}
				<Label>{$_('modules.create-buy-option.name')}</Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Control>
		<Description />
		<FieldErrors />
	</Field>

	<!--<Field form={superform} name="description">
				<Control>
					{#snippet children({ props })}
						<Label>Buy option description</Label>
						<Input {...props} bind:value={$formData.description} />
					{/snippet}
				</Control>
				<Description />
				<FieldErrors />
			</Field> -->

	<Field form={superform} name="packageCount">
		<Control>
			{#snippet children({ props })}
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-col gap-1">
						<Label>{$_('modules.create-buy-option.package-count')}</Label>
						<Description>{$_('modules.create-buy-option.package-count-description')}</Description>
					</div>
					<div
						class="flex items-center border border-border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
					>
						<Button
							variant="ghost"
							size="icon"
							class="size-10"
							disabled={$formData.packageCount <= 0}
							onclick={decreasePackagesCount}
						>
							<Minus class="size-5" />
						</Button>
						<Input
							{...props}
							type="number"
							class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
							bind:value={$formData.packageCount}
						></Input>
						<Button
							variant="ghost"
							size="icon"
							class="size-10"
							disabled={$formData.packageCount >= 10}
							onclick={increasePackagesCount}
						>
							<Plus class="size-5" />
						</Button>
					</div>
				</div>
			{/snippet}
		</Control>
		<FieldErrors />
	</Field>

	<Field form={superform} name="serviceCount">
		<Control>
			{#snippet children({ props })}
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-col gap-1">
						<Label>{$_('modules.create-buy-option.service-count')}</Label>
						<Description>{$_('modules.create-buy-option.service-count-description')}</Description>
					</div>
					<div
						class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
					>
						<Button
							variant="ghost"
							size="icon"
							class="size-10"
							disabled={$formData.serviceCount <= 0}
							onclick={decreaseServicesCount}
						>
							<Minus class="size-5" />
						</Button>
						<Input
							{...props}
							type="number"
							class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
							bind:value={$formData.serviceCount}
						></Input>
						<Button
							variant="ghost"
							size="icon"
							class="size-10"
							disabled={$formData.serviceCount >= 10}
							onclick={increaseServicesCount}
						>
							<Plus class="size-5" />
						</Button>
					</div>
				</div>
			{/snippet}
		</Control>
		<FieldErrors />
	</Field>

	<Dialog.Footer>
		<Button variant="default" type="submit">{$_('common.create')}</Button>
	</Dialog.Footer>
</form>

<style>
</style>

<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { Minus, Plus } from '@lucide/svelte';
	import { Input } from '@/components/ui/input';
	import { page } from '$app/state';
	import { createBuyOption } from '@/remote/functions/admin';
	import { Label } from '@/components/ui/label';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	interface Props {
		isDialogOpen?: boolean;
		onCreateBuyOption?: ({
			submit
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
		}) => Promise<void>;
	}

	let { isDialogOpen = $bindable(false), onCreateBuyOption }: Props = $props();

	function decreaseServicesCount(e: Event) {
		e.preventDefault();
		const serviceCount = Number(createBuyOption.fields.serviceCount.value());
		if (serviceCount > 0) {
			createBuyOption.fields.serviceCount.set(serviceCount - 1);
		}
	}

	function decreasePackagesCount(e: Event) {
		e.preventDefault();
		const packageCount = Number(createBuyOption.fields.packageCount.value());
		if (packageCount > 0) {
			createBuyOption.fields.packageCount.set(packageCount - 1);
		}
	}

	function increaseServicesCount(e: Event) {
		e.preventDefault();
		const serviceCount = Number(createBuyOption.fields.serviceCount.value());
		if (10 > serviceCount && serviceCount >= 0) {
			createBuyOption.fields.serviceCount.set(serviceCount + 1);
		}
	}

	function increasePackagesCount(e: Event) {
		e.preventDefault();
		const packageCount = Number(createBuyOption.fields.packageCount.value());
		if (10 > packageCount && packageCount >= 0) {
			createBuyOption.fields.packageCount.set(packageCount + 1);
		}
	}
</script>

<form
	class="flex flex-col gap-y-4"
	{...createBuyOption.enhance(async ({ submit }) => {
		try {
			await onCreateBuyOption?.({ submit });
			isDialogOpen = false;
		} catch (error) {
			console.error(error?.message);
		}
	})}
>
	<input {...createBuyOption.fields.eventId.as('hidden')} value={page.params.id!} />

	<div>
		<Label>{$_('modules.create-buy-option.name')}</Label>
		<Input {...createBuyOption.fields.name.as('text')} />
		{#each createBuyOption.fields.name.issues() ?? [] as issue}
			<div class="text-red-500 text-sm">{issue.message}</div>
		{/each}
	</div>

	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-col gap-1">
			<Label>{$_('modules.create-buy-option.package-count')}</Label>
			<p>{$_('modules.create-buy-option.package-count-description')}</p>
		</div>
		<div
			class="flex items-center border border-border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
		>
			<Button
				variant="ghost"
				size="icon"
				class="size-10"
				disabled={Number(createBuyOption.fields.packageCount.value()) <= 0}
				onclick={decreasePackagesCount}
			>
				<Minus class="size-5" />
			</Button>
			<Input
				{...createBuyOption.fields.packageCount.as('number')}
				bind:value={
					createBuyOption.fields.packageCount.value, createBuyOption.fields.packageCount.set
				}
				class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
			/>
			<Button
				variant="ghost"
				size="icon"
				class="size-10"
				disabled={Number(createBuyOption.fields.packageCount.value()) >= 10}
				onclick={increasePackagesCount}
			>
				<Plus class="size-5" />
			</Button>
		</div>
		{#each createBuyOption.fields.packageCount.issues() ?? [] as issue}
			<div class="text-red-500 text-sm">{issue.message}</div>
		{/each}
	</div>

	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-col gap-1">
			<Label>{$_('modules.create-buy-option.service-count')}</Label>
			<p>{$_('modules.create-buy-option.service-count-description')}</p>
		</div>
		<div
			class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
		>
			<Button
				variant="ghost"
				size="icon"
				class="size-10"
				disabled={Number(createBuyOption.fields.serviceCount.value()) <= 0}
				onclick={decreaseServicesCount}
			>
				<Minus class="size-5" />
			</Button>
			<Input
				{...createBuyOption.fields.serviceCount.as('number')}
				bind:value={
					createBuyOption.fields.serviceCount.value, createBuyOption.fields.serviceCount.set
				}
				class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
			/>
			<Button
				variant="ghost"
				size="icon"
				class="size-10"
				disabled={Number(createBuyOption.fields.serviceCount.value()) >= 10}
				onclick={increaseServicesCount}
			>
				<Plus class="size-5" />
			</Button>
		</div>
		{#each createBuyOption.fields.serviceCount.issues() ?? [] as issue}
			<div class="text-red-500 text-sm">{issue.message}</div>
		{/each}
	</div>

	<Dialog.Footer>
		<Button variant="default" type="submit">{$_('common.create')}</Button>
	</Dialog.Footer>
</form>

<style>
</style>

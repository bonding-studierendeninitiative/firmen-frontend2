<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import type { Readable } from 'svelte/store';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import toast from 'svelte-french-toast';
	import { cn } from '@/utils';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import { _ } from '@services';

	export let selectedEventRegistrations: Readable<string[]>;
	export let disabled: boolean;
	let open = false;

	const api = trpc($page);

	let documentType: 'advert' | 'logo' = 'advert';

	const exportCatalogueData = api.admin.catalogueData.export.createMutation();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant: "default"}))} {disabled}>{$_("common.export")}</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Export catalogue data</Dialog.Title>
			<Dialog.Description>Du kannst vergangene Export hier finden...</Dialog.Description>
		</Dialog.Header>
		<section class="space-y-4">
			<Tabs.Root bind:value={documentType}>
				<Tabs.List>
					<Tabs.Trigger value="advert">Advertisements</Tabs.Trigger>
					<Tabs.Trigger value="logo">Logos</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
			<Button on:click={()=> {
				$exportCatalogueData.mutate({
				documentType,
				eventRegistrationIds: $selectedEventRegistrations
				}, {
					onError: (error) => {
						toast.error(error.message);
					},
					onSuccess: () => {
						toast.success('Export enqueued');
					}
				})
			}} disabled={$exportCatalogueData.isPending} variant="default" size="sm">Export
			</Button>
		</section>
	</Dialog.Content>
</Dialog.Root>
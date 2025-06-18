<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import type { Readable } from 'svelte/store';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import {toast} from 'svelte-sonner';
	import { cn } from '@/utils';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { _ } from '@services';

	interface Props {
		selectedEventRegistrations: Readable<string[]>;
		disabled: boolean;
	}

	let { selectedEventRegistrations, disabled }: Props = $props();
	let open = $state(false);

	const api = trpc(page);

	let documentType: 'advert' | 'logo' = $state('logo');

	const exportCatalogueData = api.admin.catalogueData.export.createMutation();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant: "default"}))} {disabled}>{$_("common.export")}</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>$_('admin-pages.events.event-registrations.export-catalogue-data.title')</Dialog.Title>
			<Dialog.Description>$_('admin-pages.events.event-registrations.export-catalogue-data.description')</Dialog.Description>
		</Dialog.Header>
		<section class="space-y-4">
			<Tabs.Root bind:value={documentType}>
				<Tabs.List>
					<Tabs.Trigger value="advert">$_('admin-pages.events.event-registrations.export-catalogue-data.advertisements')</Tabs.Trigger>
					<Tabs.Trigger value="logo">$_('admin-pages.events.event-registrations.export-catalogue-data.logos')</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
			<Button onclick={()=> {
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
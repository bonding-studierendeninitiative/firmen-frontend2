<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { LogoItem, NoDataFound } from '@/@svelte/components';
	import { Label } from '@/components/ui/label';
	import { CheckCircle, CircleDashed, LoaderCircle } from 'lucide-svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Button } from '@/components/ui/form';
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';
	import {toast} from 'svelte-sonner';

	interface Props {
		open?: boolean;
		id: string;
		orgId: string;
	}

	let { open = $bindable(false), id, orgId }: Props = $props();

	const api = trpc($page);

	const utils = api.createUtils();

	let logos = api.catalogueData.getAll.createQuery({
		limit: '10',
		cursor: '0',
		documentType: "logo"
	});
	let pickLogo = api.catalogueData.pickLogo.createMutation();

	let selectedLogo = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pickLogo">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.pick-logo-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.pick-logo-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[65dvh]">
			{#if $logos.isLoading}
				<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
			{:else if $logos.data?.documents?.length === 0}
				<NoDataFound
					heading={$_('modules.pick-logo-dialog.no-data')}
					subHeading={$_('modules.pick-logo-dialog.no-data-sub-heading')}
					buttonText={$_('modules.pick-logo-dialog.no-data-action')}
					onButtonClick={() => goto(`/${orgId}/catalogue-data/logos`)}
				/>
			{:else}
				<RadioGroup.Root bind:value={selectedLogo}>
					<div
						class="grid grid-cols-1 gap-4 @sm/pickLogo:grid-cols-2 @lg/pickLogo:grid-cols-3 @4xl/pickLogo:grid-cols-4"
					>
						{#each $logos.data?.documents ?? [] as logo}
							<Label
								class="p-4 rounded-xl hover:bg-muted cursor-pointer [&:has([data-state=checked])]:bg-muted [&:has([data-state=checked])]:border [&:has([data-state=checked])]:border-dashed flex flex-col items-end gap-2"
								for={'logo-' + logo.id}
							>
								<RadioGroup.Item id={'logo-' + logo.id} value={logo.id} class="sr-only" />
								{#if logo.id === selectedLogo}
									<CheckCircle class="w-5 h-5 text-green-500" />
								{:else}
									<CircleDashed class="w-5 h-5 text-gray-500" />
								{/if}
								<LogoItem {logo} />
							</Label>
						{/each}
					</div>
				</RadioGroup.Root>
			{/if}
		</ScrollArea>
		<Dialog.Footer>
			<Button
				disabled={!selectedLogo || $pickLogo.isPending}
				on:click={() => {
					$pickLogo.mutate(
						{ documentId: selectedLogo, eventRegistrationId: id, versionId: $logos.data?.documents?.find(document => document.id === selectedLogo)?.activeVersion?.versionId },
						{
							onError(error, variables, context) {
								toast.error(error.message);
							},
							async onSuccess(data, variables, context) {
								open = false;
								toast.success('Logo ausgewählt!');
								await utils.eventRegistrations.forOrganization.invalidate();
							}
						}
					);
				}}>{$_('common.select')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

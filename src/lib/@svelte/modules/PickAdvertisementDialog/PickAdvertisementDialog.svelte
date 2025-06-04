<script lang="ts">
	import { page } from '$app/stores';
	import * as Dialog from '@/components/ui/dialog';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { AdvertisementItem, NoDataFound } from '@/@svelte/components';
	import { Label } from '@/components/ui/label';
	import { CheckCircle, CircleDashed, LoaderCircle } from 'lucide-svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Button } from '@/components/ui/form';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';

	export let open = false;
	export let id: string;
	export let orgId: string;

	let selectedAdvertisement = '';

	const api = trpc($page);

	const utils = api.createUtils();
	let advertisements = api.catalogueData.getAll.createQuery({
		cursor: "0",
		limit: "10",
		documentType: "advert"
	});
	let pickAdvertisement = api.catalogueData.pickAdvertisement.createMutation();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pickAdvertisement">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.pick-advertisement-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.pick-advertisement-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[70dvh]">
			{#if $advertisements.isLoading}
				<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
			{:else if $advertisements.data?.documents?.length === 0}
				<NoDataFound
					heading={$_('modules.pick-advertisement-dialog.no-data')}
					subHeading={$_('modules.pick-advertisement-dialog.no-data-sub-heading')}
					buttonText={$_('modules.pick-advertisement-dialog.no-data-action')}
					onButtonClick={() => goto(`/${orgId}/catalogue-data/adverts`)}
				/>
			{:else}
				<RadioGroup.Root bind:value={selectedAdvertisement}>
					<div
						class="grid grid-cols-1 gap-4 @sm/pickAdvertisement:grid-cols-2 @xl/pickAdvertisement:grid-cols-4"
					>
						{#each $advertisements.data?.documents ?? [] as advertisement}
							<Label
								class="p-4 rounded-xl hover:bg-muted cursor-pointer [&:has([data-state=checked])]:bg-muted [&:has([data-state=checked])]:border [&:has([data-state=checked])]:border-dashed flex flex-col items-end gap-2"
								for={'advertisement-' + advertisement.id}
							>
								<RadioGroup.Item
									id={'advertisement-' + advertisement.id}
									value={advertisement.id}
									class="sr-only"
								/>
								{#if advertisement.id === selectedAdvertisement}
									<CheckCircle class="w-5 h-5 text-green-500" />
								{:else}
									<CircleDashed class="w-5 h-5 text-gray-500" />
								{/if}
								<AdvertisementItem {advertisement} />
							</Label>
						{/each}
					</div>
				</RadioGroup.Root>
			{/if}
		</ScrollArea>
		<Dialog.Footer>
			<Button
				disabled={!selectedAdvertisement || $pickAdvertisement.isPending}
				on:click={() => {
					$pickAdvertisement.mutate(
						{
							advertisementId: selectedAdvertisement,
							eventRegistrationId: id
						},
						{
							onError(error, variables, context) {
								toast.error(error.message);
							},
							async onSuccess(data, variables, context) {
								open = false;
								toast.success('Imageanzeige ausgewählt!');
								await utils.eventRegistrations.forOrganization.invalidate();
							}
						}
					);
				}}>{$_('common.select')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

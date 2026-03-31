<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { AdvertisementItem, NoDataFound } from '@/@svelte/components';
	import { Label } from '@/components/ui/label';
	import { CheckCircle, CircleDashed, LoaderCircle } from '@lucide/svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Button } from '@/components/ui/form';
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getCatalogueByType } from '@/remote/functions';

	interface Props {
		open?: boolean;
		id: string;
		orgSlug: string;
		onPick?: (eventRegistrationId: string, documentId: string, versionId: string) => Promise<void>;
	}

	let { open = $bindable(false), id, orgSlug, onPick }: Props = $props();

	let selectedAdvertisement = $state('');
	let advertisementsQuery = getCatalogueByType({
		cursor: '0',
		limit: '10',
		documentType: 'advert'
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pick-advertisement">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.pick-advertisement-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.pick-advertisement-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[70dvh]">
			{#if advertisementsQuery.loading}
				<LoaderCircle class="size-10 mx-auto animate-spin" />
			{:else if advertisementsQuery.ready && (advertisementsQuery.current?.documents?.length ?? 0) === 0}
				<NoDataFound
					heading={$_('modules.pick-advertisement-dialog.no-data')}
					subHeading={$_('modules.pick-advertisement-dialog.no-data-sub-heading')}
					action={{
						label: $_('modules.pick-advertisement-dialog.no-data-action'),
						href: `/${orgSlug}/catalogue-data/adverts`
					}}
				/>
			{:else}
				<RadioGroup.Root bind:value={selectedAdvertisement}>
					<div
						class="grid grid-cols-1 gap-4 @sm/pick-advertisement:grid-cols-2 @xl/pick-advertisement:grid-cols-4"
					>
						{#each advertisementsQuery.current?.documents ?? [] as advertisement}
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
									<CheckCircle class="size-5 text-green-500" />
								{:else}
									<CircleDashed class="size-5 text-gray-500" />
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
				disabled={!selectedAdvertisement || !!$effect.pending()}
				onclick={() => {
					onPick?.(
						id,
						selectedAdvertisement,
						advertisementsQuery.current?.documents?.find((doc) => doc.id === selectedAdvertisement)
							?.activeVersion?.versionId ?? ''
					)
						.then(() => {
							toast.success($_('modules.pick-advertisement-dialog.success-toast'));
							open = false;
						})
						.catch(() => {
							toast.error($_('modules.pick-advertisement-dialog.error-toast'));
						});
				}}>{$_('common.select')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

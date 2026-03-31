<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { LogoItem, NoDataFound } from '@/@svelte/components';
	import { Label } from '@/components/ui/label';
	import { CheckCircle, CircleDashed, LoaderCircle } from '@lucide/svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Button } from '@/components/ui/form';
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { getCatalogueByType } from '@/remote/functions';

	interface Props {
		open?: boolean;
		id: string;
		orgSlug: string;
		onPick?: (eventRegistrationId: string, documentId: string, versionId: string) => Promise<void>;
	}

	let { open = $bindable(false), id, orgSlug, onPick }: Props = $props();

	let logosQuery = $derived(
		getCatalogueByType({
			limit: '10',
			cursor: '0',
			documentType: 'logo'
		})
	);

	let selectedLogo = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pick-logo" preventScroll={false}>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.pick-logo-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.pick-logo-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[65dvh]">
			{#if logosQuery.loading}
				<LoaderCircle class="size-10 mx-auto animate-spin" />
			{:else if logosQuery.ready && (logosQuery.current?.documents?.length ?? 0) === 0}
				<NoDataFound
					heading={$_('modules.pick-logo-dialog.no-data')}
					subHeading={$_('modules.pick-logo-dialog.no-data-sub-heading')}
					action={{
						label: $_('modules.pick-logo-dialog.no-data-action'),
						href: `/${orgSlug}/catalogue-data/logos`
					}}
				/>
			{:else}
				<RadioGroup.Root bind:value={selectedLogo}>
					<div
						class="grid grid-cols-1 gap-4 @sm/pick-logo:grid-cols-2 @lg/pick-logo:grid-cols-3 @4xl/pick-logo:grid-cols-4"
					>
						{#each logosQuery.current?.documents ?? [] as logo}
							<Label
								class="p-4 rounded-xl hover:bg-muted cursor-pointer border-transparent border [&:has([data-state=checked])]:bg-muted [&:has([data-state=checked])]:border-border flex flex-col items-end gap-2"
								for={'logo-' + logo.id}
							>
								<RadioGroup.Item id={'logo-' + logo.id} value={logo.id} class="sr-only" />
								{#if logo.id === selectedLogo}
									<CheckCircle class="size-5 text-green-500" />
								{:else}
									<CircleDashed class="size-5 text-gray-500" />
								{/if}
								<LogoItem
									onViewDetails={async (logoId) =>
										await goto(`/${orgId}/catalogue-data/logos/${logoId}`)}
									{logo}
								/>
							</Label>
						{/each}
					</div>
				</RadioGroup.Root>
			{/if}
		</ScrollArea>
		<Dialog.Footer>
			<Button
				disabled={!selectedLogo || !!$effect.pending()}
				onclick={() => {
					onPick?.(
						id,
						selectedLogo,
						logosQuery.current?.documents?.find((document) => document.id === selectedLogo)
							?.activeVersion?.versionId!
					);
				}}>{$_('common.select')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

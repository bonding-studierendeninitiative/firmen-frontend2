<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { LogoItem, NoDataFound, PortraitItem } from '@/@svelte/components';
	import { Label } from '@/components/ui/label';
	import { CheckCircle, CircleDashed, LoaderCircle } from 'lucide-svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Button } from '@/components/ui/form';
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';

	export let open = false;
	export let id: string;
	export let orgId: string;

	const api = trpc($page)

	let portraits = api.portraitTemplates.getAll.createQuery({
		page: 0,
		query: ""
	});

	let selectedPortrait = ""

</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pickPortrait">
		<Dialog.Header>
			<Dialog.Title>{$_("modules.submit-portrait-dialog.title")}</Dialog.Title>
			<Dialog.Description>{$_("modules.submit-portrait-dialog.description")}</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[65dvh]">
			{#if $portraits.isLoading}
				<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
			{:else if $portraits.data?.portraitTemplates?.length === 0}
				<NoDataFound heading={$_("modules.submit-portrait-dialog.no-data")}
										 subHeading={$_("modules.submit-logo-dialog.no-data-sub-heading")}
										 buttonText={$_("modules.submit-logo-dialog.no-data-action")}
										 onButtonClick={() => goto(`/${orgId}/catalogue-data/portraits`)} />
			{:else}
					<RadioGroup.Root bind:value={selectedPortrait}>
						<div
							class="grid grid-cols-1 gap-4 @sm/pickLogo:grid-cols-2 @lg/pickLogo:grid-cols-3 @4xl/pickLogo:grid-cols-4">
							{#each $portraits.data?.portraitTemplates ?? [] as portrait}
								<Label
									class="p-4 rounded-xl hover:bg-muted cursor-pointer [&:has([data-state=checked])]:bg-muted [&:has([data-state=checked])]:border [&:has([data-state=checked])]:border-dashed flex flex-col items-end gap-2"
									for={"portrait-"+portrait.id}>
									<RadioGroup.Item id={"portrait-"+portrait.id} value={portrait.id} class="sr-only" />
									{#if portrait.id === selectedPortrait}
										<CheckCircle class="w-5 h-5 text-green-500" />
									{:else}
										<CircleDashed class="w-5 h-5 text-gray-500" />
									{/if}
									<PortraitItem {portrait} />
								</Label>
							{/each}
						</div>
					</RadioGroup.Root>
			{/if}
		</ScrollArea>
		<Dialog.Footer>
			<!--<Button disabled={!selectedPortrait || $pickPortrait.isPending} on:click={() => {
				$pickPortrait.mutate({ portraitId: selectedPortrait, eventRegistrationId: id, organizationId: orgId })
			}}>{$_("common.select")}</Button>-->
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

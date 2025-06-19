<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Trash2 } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import type { AdvertisementOutput } from '@api/client';

	interface Props {
		advertisement: AdvertisementOutput;
	}

	let { advertisement }: Props = $props();
	let open = $state(false);
	const api = trpc(page);
	const utils = api.createUtils();

	const deleteAdvertisement = api.catalogueData.deleteDocument.createMutation();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'icon' })}>
		<Trash2 class="size-5" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title
				>{$_('modules.delete-advertisement-dialog.title', {
					values: {
						advertisementName: advertisement.title
					}
				})}</Dialog.Title
			>
			<Dialog.Description
				>{$_('modules.delete-advertisement-dialog.description')}</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}
				>{$_('common.cancel')}</Dialog.Close
			>
			<Button
				onclick={() => {
					if (advertisement.id) {
						$deleteAdvertisement.mutate(advertisement.id, {
							onError: (error) => {
								toast.error(error.message);
							},
							onSuccess: () => {
								toast.success('Advertisement deleted');
								utils.catalogueData.getAll.invalidate();
								open = false;
							}
						});
					}
				}}
				variant="destructive"
			>
				<Trash2 class="mr-2 size-5" />
				{$_('common.delete')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

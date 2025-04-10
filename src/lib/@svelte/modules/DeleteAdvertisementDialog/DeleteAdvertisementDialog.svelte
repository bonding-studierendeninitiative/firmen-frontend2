<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Trash2 } from 'lucide-svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import type { AdvertisementSchema } from '@schema';
	import type { InferOutput } from 'valibot';
	import { toast } from 'svelte-french-toast';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let advertisement: InferOutput<AdvertisementSchema>;
	let open = false;
	const api = trpc($page);
	const utils = api.createUtils()

	const deleteAdvertisement = api.catalogueData.advertisements.deleteAdvertisement.createMutation();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'icon' })}>
		<Trash2 class="w-5 h-5" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Advertisement</Dialog.Title>
			<Dialog.Description>Are you sure you want to delete this advertisement?</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({variant: "outline"})}>{$_("common.cancel")}</Dialog.Close>
			<Button on:click={() => {
					$deleteAdvertisement.mutate(advertisement.id, {
						onError: (error) => {
							toast.error(error.message);
						},
						onSuccess: () => {
							toast.success('Advertisement deleted');
							utils.catalogueData.logos.getAll.invalidate()
							open = false
						}
					})
				}} variant="destructive">
				<Trash2 class="mr-2 w-5 h-5" />
				{$_("common.delete")}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
<script lang="ts">
	import {
		type DeletePortraitTemplateRequest, DeletePortraitTemplateRequestSchema,
		type GetPortraitTemplatesResponse,
		PortraitTemplateSchema
	} from '@schema';
	import type { InferOutput } from 'valibot';
	import { Link } from '@/@svelte/components';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { FileText, LoaderCircle, Trash2 } from 'lucide-svelte';
	import * as Dialog from "@/components/ui/dialog";
	import { _} from "@services";
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { invalidate } from '$app/navigation';
	import { toast } from 'svelte-french-toast';

	export let portrait: InferOutput<GetPortraitTemplatesResponse>["portraitTemplates"][number];
	export let deletePortraitForm: SuperValidated<Infer<DeletePortraitTemplateRequest>>

	let deleteDialogOpen = false;

	const superform = superForm(deletePortraitForm, {
		onSubmit: ({ formData }) => {
			formData.set("id", portrait.id);
			console.log(formData);
		},
		validators: valibotClient(DeletePortraitTemplateRequestSchema),
		onResult: async ({ result }) => {
			if (result.status === 200) {
				deleteDialogOpen = false;
				toast.success($_('user-pages.portraits.portraitDeletedSuccessMessage'));
			} else {
				console.log(result);
				toast.error($_('user-pages.portraits.portraitDeletedErrorMessage'));
			}
		}
	});

	const { form, enhance, submitting } = superform;
</script>



<Card.Root class="h-full transition-all hover:shadow-md cursor-pointer relative group " >
	<Button on:click={() => deleteDialogOpen = true} variant="ghost" size="icon" class="absolute top-2 right-2 p-0 max-w-6 max-h-6 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground ">
		<Trash2 class="h-3.5 w-3.5" />
	</Button>
		<Link href={`portraits/${portrait.id}`} class="w-full h-full flex items-center hover:no-underline">
			<div class="flex justify-start items-center mr-2">
				<div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex justify-center items-center m-4">
					<FileText />
				</div>
				<div>
					<Card.Header>
						<Card.Title class="font-medium text-base mb-1">{portrait.title}</Card.Title>
					</Card.Header>

				</div>
			</div>
		</Link>
</Card.Root>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Title>{$_('user-pages.portraits.deletePortrait')}</Dialog.Title>
		<Dialog.Description>
			<p>{$_('user-pages.portraits.deletePortraitDescription')}</p>
			<p class="mt-2 font-medium">{$_('user-pages.portraits.nameOfPortrait')}:</p>
			<p>{portrait.title}</p>
			<form action="?/deletePortrait" method="post" id="delete-portrait-form" use:enhance>
				<input type="hidden" name="id" value={portrait.id} />
			</form>
		</Dialog.Description>
		<Dialog.Footer class="flex justify-end items-center w-full">
			<Button variant="secondary" on:click={() => deleteDialogOpen=false}>{$_('common.cancel')}</Button>
			{#if $submitting}
				<Button form="delete-portrait-form" disabled>
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />{$_('common.delete')}
				</Button>
			{:else}
				<Button type="submit" form="delete-portrait-form" variant="destructive">{$_('common.delete')}</Button>

			{/if}

		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

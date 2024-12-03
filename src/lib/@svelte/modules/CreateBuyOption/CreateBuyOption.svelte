<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { Minus, Plus } from 'lucide-svelte';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { CreateBuyOptionRequest } from '@schema';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { toast } from 'svelte-french-toast';
	import { page } from '$app/stores';

	export let createForm: SuperValidated<Infer<CreateBuyOptionRequest>>;
	export let isDialogOpen = false;

	const superform = superForm(createForm, {
		onResult({ result }) {
			if (result.type === 'redirect') {
				isDialogOpen = false;
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	const { form: formData, enhance } = superform;

	function decreaseServicesCount(e: Event) {
		e.preventDefault();
		if ($formData.serviceCount > 0) {
			$formData.serviceCount = $formData.serviceCount - 1;
		}
	}

	function decreasePackagesCount(e: Event) {
		e.preventDefault();
		if ($formData.packageCount > 0) {
			$formData.packageCount = $formData.packageCount - 1;
		}
	}

	function increaseServicesCount(e: Event) {
		e.preventDefault();
		if ($formData.packageCount > 0) {
			$formData.packageCount = $formData.packageCount + 1;
		}
	}

	function increasePackagesCount(e: Event) {
		e.preventDefault();
		if ($formData.packageCount > 0) {
			$formData.packageCount = $formData.packageCount + 1;
		}
	}
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_("modules.create-buy-option.title")}</Dialog.Title>
			<Dialog.Description>{$_("modules.create-buy-option.description")}</Dialog.Description>
		</Dialog.Header>
		<form
			class="flex flex-col gap-y-4"
			method="post"
			action={`/admin/events/${$page.params.id}/buy-options/?/createBuyOption`}
			use:enhance
		>
			<Field form={superform} name="name">
				<Control let:attrs>
					<Label>{$_("modules.create-buy-option.name")}</Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Control>
				<Description />
				<FieldErrors />
			</Field>

			<!--<Field form={superform} name="description">
				<Control let:attrs>
					<Label>Buy option description</Label>
					<Input {...attrs} bind:value={$formData.description} />
				</Control>
				<Description />
				<FieldErrors />
			</Field> -->

			<Field form={superform} name="packageCount">
				<Control let:attrs>
					<div class="flex flex-row items-center justify-between">
						<Label>{$_("modules.create-buy-option.package-count")}</Label>
						<div
							class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
						>
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.packageCount <= 0}
								on:click={decreasePackagesCount}
							>
								<Minus class="h-5 w-5" />
							</Button>
							<Input
								type="number"
								class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
								{...attrs}
								bind:value={$formData.packageCount}
							></Input>
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.packageCount >= 10}
								on:click={increasePackagesCount}
							>
								<Plus class="h-5 w-5" />
							</Button>
						</div>
					</div>
				</Control>
				<Description />
				<FieldErrors />
			</Field>

			<Field form={superform} name="serviceCount">
				<Control let:attrs>
					<div class="flex flex-row items-center justify-between">
						<Label>{$_("modules.create-buy-option.service-count")}</Label>
						<div
							class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
						>
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.serviceCount <= 0}
								on:click={decreaseServicesCount}
							>
								<Minus class="h-5 w-5" />
							</Button>
							<Input
								type="number"
								class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
								{...attrs}
								bind:value={$formData.serviceCount}
							></Input>
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.serviceCount >= 10}
								on:click={increaseServicesCount}
							>
								<Plus class="h-5 w-5" />
							</Button>
						</div>
					</div>
				</Control>
				<Description />
				<FieldErrors />
			</Field>

			<Dialog.Footer>
				<Button variant="gradient" type="submit">{$_('common.save')}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

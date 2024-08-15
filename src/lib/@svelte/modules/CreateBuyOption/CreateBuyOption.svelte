<script lang="ts">
	import { _ } from '@services/i18n.js';
	import * as Dialog from '@/components/ui/dialog';
	import { Button, Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Minus, Plus } from 'lucide-svelte';
	import { GradientButton } from '@/@svelte/components';
	import { Input } from '@/components/ui/input';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-french-toast';
	import type { CreateBuyOptionRequest } from '@schema';

	let isOpen = false;
	export let createForm: SuperValidated<CreateBuyOptionRequest>;

	const superform = superForm(createForm, {
		onResult({ result }) {
			if (result.type === 'redirect') {
				isOpen = false;
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	const { form: formData, enhance } = superform;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Overlay />
	<Dialog.Trigger asChild>
		<Button variant="outline" on:click={() => (isOpen = true)}>Add Buy Option&hellip;</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Buy Option</Dialog.Title>
			<Dialog.Description>
				Enter the buy option details
			</Dialog.Description>
		</Dialog.Header>
		<form class="flex flex-col gap-y-4" method="post" action="?/createBuyOption" use:enhance>

			<Field form={superform} name="name">
				<Control let:attrs>
					<Label>Buy option name</Label>
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
						<Label>Package count</Label>
						<div
							class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50 ">
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.packageCount <= 0}
								on:click={(e) => {
										e.preventDefault();
										if ($formData.packageCount > 0) {
										$formData.packageCount = $formData.packageCount - 1;
									}
									}
									}
							>
								<Minus class="h-5 w-5" />
							</Button>
							<Input
								type="number"
								class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
								{...attrs} bind:value={$formData.packageCount}
							>

							</Input>
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.packageCount >= 10}
								on:click={(e) => {
										e.preventDefault();
										if ($formData.packageCount < 10) {
										$formData.packageCount = $formData.packageCount + 1;
									}
									}
									}
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
						<Label>Service count</Label>
						<div
							class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50 ">
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.serviceCount <= 0}
								on:click={(e) => {
										e.preventDefault();
										if ($formData.serviceCount > 0) {
										$formData.serviceCount = $formData.serviceCount - 1;
									}
									}
									}
							>
								<Minus class="h-5 w-5" />
							</Button>
							<Input
								type="number"
								class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
								{...attrs} bind:value={$formData.serviceCount}
							>

							</Input>
							<Button
								variant="ghost"
								size="icon"
								class="h-10 w-10 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
								disabled={$formData.serviceCount >= 10}
								on:click={(e) => {
										e.preventDefault();
										if ($formData.serviceCount < 10) {
										$formData.serviceCount = $formData.serviceCount + 1;
									}
									}
									}
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
				<GradientButton type="submit">{$_('common.save')}</GradientButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
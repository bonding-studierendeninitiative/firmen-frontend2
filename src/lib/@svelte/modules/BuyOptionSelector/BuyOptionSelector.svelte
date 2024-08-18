<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { ChevronsUpDown, Minus, Plus, PlusCircle } from 'lucide-svelte';
	import Check from 'lucide-svelte/icons/check';
	import { cn } from '@/utils';
	import { tick } from 'svelte';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { CreateBuyOptionRequest } from '@schema';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { GradientButton } from '@/@svelte/components';
	import { toast } from 'svelte-french-toast';
	import { Badge } from '@/components/ui/badge';
	import { page } from '$app/stores';

	export let open: boolean = false;
	export let buyOptions: { label: string, value: string, active: boolean }[];
	export let onSelect: (value: string) => void;
	export let value = '';
	export let createForm: SuperValidated<Infer<CreateBuyOptionRequest>> | undefined;
	let isDialogOpen = false;

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

	$: selectedValue =
		buyOptions.find((f) => f.value === value)?.label ??
		'Select a framework...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

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
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-[300px] justify-between"
			>
				{selectedValue}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[300px] p-0">
			<Command.Root>
				<Command.Input placeholder="Search for a buy option..." />
				<Command.List>
					<Command.Empty>No buy option found.</Command.Empty>
					<Command.Group>
						{#each buyOptions as buyOption}
							<Command.Item
								class="flex"
								value={buyOption.value}
								onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
							onSelect(value);
            }}
							>
								<Check
									class={cn(
                "mr-2 h-4 w-4",
                value !== buyOption.value && "text-transparent"
              )}
								/>
								<span class="flex-grow">{buyOption.label}</span>
								{#if buyOption.active}
									<Badge variant="outline">aktiv</Badge>
								{/if}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
				<Command.Separator />
				<Command.List>
					<Command.Group>
						<Command.Item onSelect={() => {
						open = false;
						isDialogOpen = true;
					}}>
							<PlusCircle class="mr-2 h-4 w-4" />
							Create a new buy option&hellip;
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Buy Option</Dialog.Title>
			<Dialog.Description>
				Enter the buy option details
			</Dialog.Description>
		</Dialog.Header>
		<form class="flex flex-col gap-y-4" method="post"
					action={`/admin/events/${$page.params.id}/buy-options/?/createBuyOption`} use:enhance>

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
								on:click={decreasePackagesCount}
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
						<Label>Service count</Label>
						<div
							class="flex items-center border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50 ">
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
								{...attrs} bind:value={$formData.serviceCount}
							>

							</Input>
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
				<GradientButton type="submit">{$_('common.save')}</GradientButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>


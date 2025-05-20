<script lang="ts">
	import * as Popover from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import * as Command from '@/components/ui/command';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import { _ } from '@services';
	import { tick } from 'svelte';
	import { cn } from '@/utils';

	let open = false;
	export let value: string;

	export let organizationId: string;
	export let userId: string;

	const api = trpc($page);
	const updateRole = api.admin.orgs.members.updateRole.createMutation();

	const roles = [
		{
			value: 'org:member',
			label: $_('modules.manage-org-members.member')
		},
		{
			value: 'org:admin',
			label: $_('modules.manage-org-members.admin')
		}
	];
    let valueLabel = roles.find((row) => row.value === value)?.label

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			disabled={$updateRole.isPending}
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			{valueLabel}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Group>
				{#each roles as role}
					<Command.Item
						value={role.value}
						onSelect={(currentValue) => {
							$updateRole.mutate({
								organizationId,
								userId,
								role: currentValue
							}, {
                                onSuccess(data, variables, context) {
                                    value = currentValue
                                    valueLabel = roles.find((row) => row.value === currentValue)?.label
                                },
                            });
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== role.value && 'text-transparent')} />
						{role.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

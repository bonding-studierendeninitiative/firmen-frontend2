<script lang="ts">
	import * as Popover from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import * as Command from '@/components/ui/command';
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { _ } from '@services';
	import { tick } from 'svelte';
	import { cn } from '@/utils';

	let open = $state(false);

	interface Props {
		value: string;
		orgId: string;
		onChangeUserRole?: (orgId: string, role: 'member' | 'owner' | 'admin') => void;
	}

	let { value = $bindable(), orgId, onChangeUserRole }: Props = $props();

	const api = trpc(page);
	// const updateRole = api.admin.users.updateRole.createMutation();

	const roles = [
		{
			value: 'member',
			label: $_('modules.manage-user-orgs.member')
		},
		{
			value: 'owner',
			label: $_('modules.manage-user-orgs.owner')
		},
		{
			value: 'admin',
			label: $_('modules.manage-user-orgs.admin')
		}
	] as const;
	let valueLabel = $derived(roles.find((row) => row.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	let triggerRef = $state<HTMLButtonElement>(null!);
</script>

<Popover.Root bind:open>
	{#snippet children()}
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="w-[200px] justify-between"
				>
					{valueLabel}
					<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Group>
					{#each roles as role}
						<Command.Item
							value={role.value}
							onSelect={() => {
								onChangeUserRole?.(orgId, role.value);
								closeAndFocusTrigger();
							}}
						>
							<Check class={cn('mr-2 size-4', value !== role.value && 'text-transparent')} />
							{role.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	{/snippet}
</Popover.Root>

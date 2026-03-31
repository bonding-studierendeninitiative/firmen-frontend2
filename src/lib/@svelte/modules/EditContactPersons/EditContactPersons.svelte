<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as Avatar from '@/components/ui/avatar';
	import { cn } from '@/utils';
	import { LoaderCircle, Users } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { getOrgMembers } from '@/remote/functions';

	let organizationMembersQuery = getOrgMembers({
		limit: '100',
		offset: '0',
		orderBy: 'name',
		orderDirection: 'asc'
	});

	interface Props {
		eventRegistrationId: any;
		open?: boolean;
		contactPeople: string[];
		onChange?: (contactPeople: string[]) => Promise<void>;
	}

	let { open = $bindable(false), contactPeople = $bindable(), onChange }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.edit-contact-persons.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.edit-contact-persons.description')}</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 w-full">
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-lg flex items-center">
						<Users class="size-5 mr-2" />
						{$_('modules.edit-contact-persons.members-card-header')}
					</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Content class="space-y-6 pt-2">
					{#if organizationMembersQuery.loading}
						<LoaderCircle class="size-5 text-primary animate-spin mx-auto" />
					{/if}
					{#if organizationMembersQuery.ready && organizationMembersQuery.current.members.length === 0}
						<p>{$_('modules.edit-contact-persons.no-members')}</p>
					{:else}
						<ToggleGroup.Root
							type="multiple"
							variant="outline"
							class="flex flex-wrap gap-2"
							bind:value={contactPeople}
						>
							{#each organizationMembersQuery.current?.members ?? [] as member}
								<ToggleGroup.Item
									value={member.userId}
									class={cn(
										'flex items-center gap-2 rounded-full px-3 py-1 text-sm',
										'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
									)}
									aria-label={`Select ${member.user.name}`}
								>
									<Avatar.Root class="size-6">
										<Avatar.Image src={member.user.image} alt={member.user.name} />
										<Avatar.Fallback class="text-xs">
											{member.user.name
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</Avatar.Fallback>
									</Avatar.Root>
									<span>{member.user.name}</span>
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					{/if}
					<div class="text-sm text-muted-foreground">
						<p>
							{$_('modules.edit-contact-persons.members-selected', {
								values: { members: contactPeople.length }
							})}
						</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<Dialog.Footer>
			<Button
				disabled={!!$effect.pending() || !contactPeople.length}
				onclick={() => onChange?.(contactPeople)}
			>
				{$_('common.continue')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

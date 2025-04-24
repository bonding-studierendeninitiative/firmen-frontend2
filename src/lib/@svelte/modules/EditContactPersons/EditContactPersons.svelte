<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as Avatar from '@/components/ui/avatar';
	import { cn } from '@/utils';
	import { LoaderCircle, Users } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import toast from 'svelte-french-toast';

	export let eventRegistrationId;

	const api = trpc($page);

	const utils = api.createUtils();

	let organizationMembers = api.orgMembers.get.createQuery();
	let changeContactPeople = api.eventRegistrations.changeContactPeople.createMutation();

	export let open: boolean = false;

	export let contactPeople: string[];

</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{$_("modules.edit-contact-persons.title")}</Dialog.Title>
			<Dialog.Description>{$_("modules.edit-contact-persons.description")}
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 w-full">
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-lg flex items-center">
						<Users class="h-5 w-5 mr-2" />
						{$_("modules.edit-contact-persons.members-card-header")}
					</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Content class="space-y-6 pt-2">
					{#if $organizationMembers.isLoading}
						<LoaderCircle class="h-5 w-5 text-primary animate-spin mx-auto" />
					{/if}
					{#if ($organizationMembers.data?.length ?? 0) < 1 && !$organizationMembers.isLoading}
						<p>{$_("modules.edit-contact-persons.no-members")}</p>
					{:else}
						<ToggleGroup.Root
							type="multiple"
							variant="outline"
							class="flex flex-wrap gap-2"
							bind:value={contactPeople}
						>
							{#each $organizationMembers.data ?? [] as member}
								<ToggleGroup.Item
									value={member.publicUserData?.userId}
									class={cn(
										"flex items-center gap-2 rounded-full px-3 py-1 text-sm",
										"data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
									)}
									aria-label={`Select ${member.publicUserData?.firstName} ${member.publicUserData?.lastName}`}
								>
									<Avatar.Root class="h-6 w-6">
										<Avatar.Image src={member.publicUserData?.imageUrl}
																	alt={member.publicUserData?.firstName + " " + member.publicUserData?.lastName} />
										<Avatar.Fallback class="text-xs">
											{[member.publicUserData?.firstName[0], member.publicUserData?.lastName[0]].join("")}
										</Avatar.Fallback>
									</Avatar.Root>
									<span>{member.publicUserData?.firstName + " " + member.publicUserData?.lastName}</span>
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					{/if}
					<div class="text-sm text-muted-foreground">
						<p>{$_("modules.edit-contact-persons.members-selected", { values: { members: contactPeople.length } })}</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<Dialog.Footer>
			<Button disabled={$changeContactPeople.isPending || !contactPeople.length}
							on:click={() => $changeContactPeople.mutate({ eventRegistrationId, contactPeople }, {
				onError: (err) => {
					console.error(err);
					toast.error(err.message);
				},
				onSuccess: () => {
					toast.success("Contact people updated")
					open = false;
					// utils.event
				}
			})}>
				{$_("common.continue")}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
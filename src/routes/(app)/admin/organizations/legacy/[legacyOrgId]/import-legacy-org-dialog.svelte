<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import LegacyOrgDetailsCard from './legacy-org-details-card.svelte';
	import { importLegacyOrg } from '@/remote/functions/admin';
	import type { LegacyOrganizationOutput_Detailed } from '@api/admin-client';

	let {open = $bindable(false), org}: {
		open: boolean;
		org: Required<LegacyOrganizationOutput_Detailed>;
	} = $props();

	let contactPeople: string[] = $state([]);
	let adminContactPerson: string | null = $state(null);

	let orgName = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.admin-import-legacy-org.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.admin-import-legacy-org.description')}</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 w-full max-h-[70dvh] overflow-y-auto">
				<LegacyOrgDetailsCard
					orgId={org.id}
					bind:selectedContacts={contactPeople}
					bind:adminContact={adminContactPerson}
					bind:orgName
				/>
		</div>
		<Dialog.Footer>
			<Button
				disabled={!org || !contactPeople.length}
				onclick={async () => {
					try {
						await importLegacyOrg({
							legacyOrgId: org.id,
							request: {
								adminContactPerson: adminContactPerson !== null ? adminContactPerson : undefined,
								contactPeople,
								organizationName: orgName
							}
						});
						toast.success('Organisation erfolgreich importiert');
						open = false;
					} catch (error) {
						toast.error('Organisation konnte nicht importiert werden');
					}
				}}
				>{$_('common.submit')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

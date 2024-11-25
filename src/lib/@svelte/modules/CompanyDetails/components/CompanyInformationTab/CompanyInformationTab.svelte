<script lang="ts">
	import { _ } from '@services';
	import type { GetOrgMembersResponse } from '@schema';

	export let organizationInfo: { label: string; value: string }[];
	export let orgMembers: GetOrgMembersResponse['members'];

	console.log({ organizationInfo, orgMembers });
</script>

<section class="space-y-8">
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		{#each organizationInfo as { label, value } (label)}
			<p class=" font-normal text-sm text-stone-500">{$_(`admin-pages.organizations.${label}`)}</p>
			<p class=" w-full text-right font-normal text-sm text-stone-800">{value}</p>{/each}
	</div>
	<section class="space-y-4">
		<h3>{$_(`admin-pages.organizations.contactPeople`)}</h3>
		<div class="flex flex-col rounded-lg border border-gray-200 overflow-hidden">
			{#each orgMembers as orgMember (orgMember.contactPersonId)}
				<div class="flex flex-row gap-4 w-full border-b justify-between p-4">
					<p class=" font-normal text-sm text-stone-800">{orgMember.contactPersonName}</p>
					<p
						class=" font-normal text-sm text-stone-500">{$_(`admin-pages.organizations.members.${orgMember.membershipType.toLowerCase()}`)}</p>
				</div>
			{/each}
		</div>
	</section>
</section>

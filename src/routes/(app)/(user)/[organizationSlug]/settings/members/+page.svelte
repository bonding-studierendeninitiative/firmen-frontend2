<script lang="ts">
	import { _ } from '@services';
	import type { PageServerData } from './$types';
	import { ManageOrgMembers } from '@/@svelte/modules';
	import { getOrgMembers } from '@/remote/functions';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	let organizationMembersQuery = getOrgMembers({
		limit: '10',
		offset: '0',
		orderBy: 'name',
		orderDirection: 'asc'
	});
</script>

<section class="grid gap-x-8 grid-cols-3 @container gap-y-8">
	<div class="@3xl:col-span-1 col-span-3">
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.settings.org-members.title')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.settings.org-members.description')}
		</h4>
	</div>
	<ManageOrgMembers
		class="@3xl:col-span-2 col-span-3"
		organizationId={data.organization?.id!}
		membersResponse={organizationMembersQuery}
	/>
</section>

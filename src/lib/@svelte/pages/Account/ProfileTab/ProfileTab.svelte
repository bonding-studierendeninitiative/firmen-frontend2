<script lang="ts">
	import { _ } from '@services';

	import {
		type CreateOrgInviteRequest,
		type GetOrgMembersResponse
	} from '@schema';
	import { type SuperValidated } from 'sveltekit-superforms';
	import type { InferOutput } from 'valibot';
	import { ManageOrgMembers } from '@/@svelte/modules';


	export let createInviteForm: SuperValidated<InferOutput<CreateOrgInviteRequest>> | undefined;
	export let organizationMembers: InferOutput<GetOrgMembersResponse> | undefined;

</script>

<div>
	<section class="">
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.accounts.personalInformation')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.accounts.personalInformationSubHeading')}
		</h4>
	</section>
	<pre>{JSON.stringify(organizationMembers, null, 2)}</pre>
	<ManageOrgMembers {createInviteForm} {organizationMembers} />
</div>

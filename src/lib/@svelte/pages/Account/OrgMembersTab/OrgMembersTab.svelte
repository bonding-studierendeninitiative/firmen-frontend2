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

<div class="grid gap-x-8 grid-cols-3 @container gap-y-8">
	<section class="@3xl:col-span-1 col-span-3">
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.settings.org-members.title')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.settings.org-members.description')}
		</h4>
	</section>
	<ManageOrgMembers class="@3xl:col-span-2 col-span-3" {createInviteForm} {organizationMembers} />
</div>

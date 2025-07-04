<script lang="ts">
	import { OrganizationList } from 'svelte-clerk';
	import { fade } from 'svelte/transition';
</script>

<div in:fade>

	<OrganizationList
		hideSlug={true}
		hidePersonal={true}
		afterSelectOrganizationUrl={(org) => {
			return `/${org.slug}/dashboard`;
		}}
		afterCreateOrganizationUrl={(org) => {
			return `/${org.slug}/dashboard`;
		}}
		skipInvitationScreen={true}
	/>
</div>

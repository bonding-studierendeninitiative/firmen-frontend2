<script lang="ts">
	import type { PageData } from './$types';
	import { CreateOrganization } from '@/@svelte/modules/CreateOrganization';
	import { _ } from '@services';
	import * as Card from '@/components/ui/card';
	export let data: PageData;

</script>


<main class="container mt-8">
	<Card.Root>
		<Card.Header>
			<Card.Title>{$_('user-pages.organizations.newOrganization')}</Card.Title>
			<Card.Description>{$_('user-pages.organizations.noOrgMembershipsFoundDescription')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<CreateOrganization bind:validated={data.form} revocable={false} />
		</Card.Content>
	</Card.Root>


</main>


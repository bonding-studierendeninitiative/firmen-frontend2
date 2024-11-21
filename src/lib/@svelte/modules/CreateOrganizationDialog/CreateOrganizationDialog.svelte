<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import { type SuperValidated } from 'sveltekit-superforms';
	import { type CreateOrganizationRequest } from '@schema';
	import { CreateOrganization } from '@/@svelte/modules/CreateOrganization';

	export let validated: SuperValidated<CreateOrganizationRequest>;
	export let isOpen: boolean;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Overlay class="bg-opacity-20 bg-slate-400"></Dialog.Overlay>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('user-pages.organizations.newOrganization')}</Dialog.Title>
		</Dialog.Header>
		<CreateOrganization validated={validated} bind:isOpen />
	</Dialog.Content>
</Dialog.Root>

<!--<Modal
	handleSubmit={() => {
		console.log('Submit was handled in CreateOrganizationDialog');
	}}
	heading={$_('user-pages.organizations.newOrganization')}
	hasActions={false}
	bind:isOpen
>
	
</Modal>
-->

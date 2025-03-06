<script lang="ts">
	import type { PageData } from './$types';
	import { UpdateUserDetails } from '@/@svelte/modules';

	export let data: PageData;
	import { _ } from '@services';
	import * as Card from '@/components/ui/card';
</script>


<main class="container mt-8">
	<Card.Root>
		<Card.Header>
			<Card.Title>{$_('user-pages.contactPersons.signUp.title')}</Card.Title>
			<Card.Description>{$_('user-pages.contactPersons.signUp.description')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<UpdateUserDetails validated={data.form} />
		</Card.Content>
	</Card.Root>

</main>


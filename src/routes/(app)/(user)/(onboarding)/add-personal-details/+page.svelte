<script lang="ts">
	import { UpdateUserDetails } from '@/@svelte/modules';

	import { _ } from '@services';
	import * as Card from '@/components/ui/card';
	import { goto } from '$app/navigation';

	const onUserUpdate = async () => {
		goto('/');
	};
</script>

<main class="container mt-8">
	<Card.Root class="mx-auto w-full max-w-xl">
		<Card.Header>
			<Card.Title>{$_('user-pages.contactPersons.signUp.title')}</Card.Title>
			<Card.Description>{$_('user-pages.contactPersons.signUp.description')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<UpdateUserDetails onUserDetailsUpdate={onUserUpdate} />
		</Card.Content>
	</Card.Root>
</main>

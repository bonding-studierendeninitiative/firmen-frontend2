<script lang="ts">
	import { AuthForm } from '@/components/auth';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import * as Card from '@/components/ui/card';
	import { _ } from '@services';

	const params = queryParameters({ redirectTo: ssp.string('/') });
	const safeRedirectTo = $derived.by(() => {
		if (params.redirectTo) return `/${params.redirectTo.slice(1)}`;
		return '/';
	});
</script>

<Card.Header>
	<Card.Title>{$_('auth.sign-up.title')}</Card.Title>
	<Card.Description>
		{$_('auth.sign-up.description')}
	</Card.Description>
</Card.Header>

<Card.Content class={`grid gap-6`}>
	<!-- AuthForm goes here -->
	<AuthForm callbackURL={safeRedirectTo} className="my-4" view="SIGN_UP" />
</Card.Content>

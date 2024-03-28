<script lang="ts">
	import { Button, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';
	import { _ } from '../../../services/i18n';

	const handleMagicClick = () => {
		goto('/login-email');
	};
	const handleLoginClick = () => {
		goto('/login');
	};
</script>

<GradientButton classes=" mt-5 w-full" onClick={handleMagicClick}
	>{$_('auth.login.loginWithMagicLink')}</GradientButton
>
<Button onClick={handleLoginClick} classes="shadow-md  w-full !font-extrabold mt-5"
	>{$_('auth.login.loginWithPassword')}</Button
>

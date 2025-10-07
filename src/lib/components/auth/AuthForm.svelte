<script lang="ts">
	import SignInForm from './SignInForm.svelte';
	import SignUpForm from './SignUpForm.svelte';
	import SignOut from './SignOut.svelte';
	import AuthCallback from './AuthCallback.svelte';

	interface Props {
		// Props
		className?: string;
		classNames?: any;
		callbackURL?: string;
		isSubmitting?: boolean;
		redirectTo?: string;
		view?: string;
	}

	let {
		className = '',
		classNames = {},
		callbackURL,
		isSubmitting = false,
		redirectTo = '',
		view = 'SIGN_IN'
	}: Props = $props();
</script>

{#if view === 'SIGN_IN'}
	<SignInForm {classNames} {redirectTo} {isSubmitting} {className} />
{:else if view === 'SIGN_UP'}
	<SignUpForm {callbackURL} {className} />
{:else if view === 'SIGN_OUT'}
	<SignOut />
{:else if view === 'CALLBACK'}
	<AuthCallback {redirectTo} />
{:else if view === 'FORGOT_PASSWORD'}
	<!-- TODO: Implement ForgotPasswordForm -->
	<div>Forgot Password Form</div>
{:else if view === 'RESET_PASSWORD'}
	<!-- TODO: Implement ResetPasswordForm -->
	<div>Reset Password Form</div>
{:else if view === 'TWO_FACTOR'}
	<!-- TODO: Implement TwoFactorForm -->
	<div>Two Factor Form</div>
{:else if view === 'MAGIC_LINK'}
	<!-- TODO: Implement MagicLinkForm -->
	<div>Magic Link Form</div>
{:else if view === 'EMAIL_OTP'}
	<!-- TODO: Implement EmailOTPForm -->
	<div>Email OTP Form</div>
{:else}
	<div>Unknown view: {view}</div>
{/if}

<style>
	/* Add any scoped styles here if needed */
</style>

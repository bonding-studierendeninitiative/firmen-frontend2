<script lang="ts">
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { Separator } from '../ui/separator';
	import authClient from '@/auth-client';
	import { PUBLIC_APP_URL } from '$env/static/public';
	import { GithubIcon, LinkedinIcon, MicrosoftEntraIcon } from '@/@svelte/icons';
	import { _ } from '@services';
	import { toast } from 'svelte-sonner';

	interface Props {
		className?: string;
		classNames?: any;
		redirectTo?: string;
		isSubmitting?: boolean;
	}

	let { className = '', classNames = {}, redirectTo = '', isSubmitting = false }: Props = $props();

	let email = $state('');
	let error: string | null = $state(null);
	let emailSent = $state(false);
	let showAdmin = $state(false);

	async function handleMagicLink() {
		error = null;
		if (!email) {
			error = $_('auth.signIn.fieldsRequired');
			return;
		}

		try {
			isSubmitting = true;
			const res = await authClient.signIn.magicLink({
				email,
				callbackURL: `${PUBLIC_APP_URL}${redirectTo || '/dashboard'}`
			});

			if (res.error) {
				toast.error(res.error.code || $_('auth.sign-in.magic-link-error'));
				return;
			}
			emailSent = true;
		} catch (err) {
			error = 'Failed to send magic link';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleSSO(provider: 'entra' | 'github' | 'linkedin') {
		try {
			isSubmitting = true;
			if (provider === 'entra') {
				await authClient.signIn.sso({
					callbackURL: `${PUBLIC_APP_URL}${redirectTo || '/dashboard'}`,
					providerId: 'entra'
				});
				return;
			}
			const res = await authClient.signIn.social({
				provider,
				callbackURL: `${PUBLIC_APP_URL}${redirectTo || '/dashboard'}`
			});
		} catch (err) {
			error = `Failed to sign in with ${provider}`;
		} finally {
			isSubmitting = false;
		}
	}

	function resetEmail() {
		emailSent = false;
		email = '';
	}
</script>

<form
	class={`grid w-full gap-6 ${className} ${classNames?.base ?? ''}`}
	onsubmit={(e) => e.preventDefault()}
>
	{#if emailSent}
		<div class="text-center space-y-4">
			<div class="text-green-600 text-lg font-semibold">
				{$_('auth.signIn.emailSent')}
			</div>
			<p class="text-sm text-muted-foreground">
				{$_('auth.signIn.emailSentMessage', { values: { email } })}
			</p>
			<Button variant="outline" onclick={resetEmail} class="w-full">
				{$_('auth.signIn.changeEmail')}
			</Button>
		</div>
	{:else if showAdmin}
		<!-- Admin sign in options -->
		<Button
			type="button"
			variant="secondary"
			class={`w-full ${classNames?.button ?? ''}`}
			onclick={() => handleSSO('entra')}
		>
			<MicrosoftEntraIcon class="mr-2" />
			{$_('auth.signIn.signInWithMicrosoft')}
		</Button>
		<Button
			type="button"
			variant="secondary"
			class={`w-full ${classNames?.button ?? ''}`}
			onclick={() => handleSSO('github')}
		>
			<GithubIcon class="mr-2" />
			{$_('auth.signIn.signInWithGithub')}
		</Button>
		<Button variant="link" onclick={() => (showAdmin = false)} class="text-sm">
			{$_('auth.signIn.backToRegular')}
		</Button>
	{:else}
		<!-- Regular user sign in -->
		<Button
			type="button"
			variant="secondary"
			class={`w-full ${classNames?.button ?? ''}`}
			onclick={() => handleSSO('linkedin')}
		>
			<LinkedinIcon class="mr-2" />
			{$_('auth.signIn.signInWithLinkedin')}
		</Button>

		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<Separator class="w-full" />
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground">
					{$_('auth.signIn.or')}
				</span>
			</div>
		</div>

		<!-- Email/Username input -->
		<div class="grid gap-2">
			<Label for="email">{$_('auth.signIn.email')}</Label>
			<Input
				id="email"
				type="email"
				required
				name="email"
				bind:value={email}
				placeholder={$_('auth.signIn.emailPlaceholder')}
				disabled={isSubmitting}
				class={classNames?.input ?? ''}
			/>
			{#if error}
				<div class="text-red-500 text-sm">{error}</div>
			{/if}
		</div>

		<!-- Remember me checkbox 
		<div class="flex items-center space-x-2">
			<Checkbox id="remember" bind:checked={rememberMe} disabled={isSubmitting} />
			<Label for="remember" class="text-sm">{localization?.REMEMBER_ME ?? 'Remember me'}</Label>
		</div>-->

		<Button
			type="button"
			variant="default"
			class={`w-full ${classNames?.button ?? ''}`}
			onclick={handleMagicLink}
			disabled={isSubmitting}
		>
			{isSubmitting ? $_('auth.signIn.sending') : $_('auth.signIn.sendMagicLink')}
		</Button>

		<Button variant="link" onclick={() => (showAdmin = true)} class="text-sm">
			{$_('auth.signIn.adminSignIn')}
		</Button>
	{/if}
</form>

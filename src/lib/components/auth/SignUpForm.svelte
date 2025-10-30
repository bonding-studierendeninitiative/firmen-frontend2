<script lang="ts">
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { _ } from 'svelte-i18n';
	import * as Field from '../ui/field';
	import { signUp } from '@/remote/functions';

	interface Props {
		className?: string;
		callbackURL?: string;
	}

	let { className = '', callbackURL }: Props = $props();
	let emailSent = $state(false);
	let email = $state('');
</script>

{#if emailSent}
	<div class="text-center space-y-4">
		<div class="text-green-600 text-lg font-semibold">
			{$_('auth.signIn.emailSent')}
		</div>
		<p class="text-sm text-muted-foreground">
			{$_('auth.signIn.emailSentMessage', { values: { email } })}
		</p>
	</div>
{:else}
	<form
		{...signUp.enhance(async ({ data, submit }) => {
			try {
				email = data.email;
				await submit();
				emailSent = signUp.result?.ok === true;
			} catch (error) {
				console.error('Sign up failed:', error);
			}
		})}
		class={`grid w-full gap-6 ${className}`}
	>
		<!-- Hidden callbackURL input -->
		{#if callbackURL}
			<input {...signUp.fields.callbackURL.as('hidden', callbackURL)} />
		{/if}

		<Field.Field>
			<Field.Label for="name">{$_('auth.sign-up.name')}</Field.Label>
			<Input
				id="name"
				{...signUp.fields.name.as('text')}
				placeholder={$_('auth.sign-up.placeholders.name')}
				disabled={signUp.pending > 0}
			/>
			<Field.Error>
				{#each signUp.fields.name.issues() ?? [] as issue}
					<div class="text-red-500 text-sm">{issue.message}</div>
				{/each}
			</Field.Error>
		</Field.Field>

		<!-- Email input -->
		<Field.Field>
			<Field.Label for="email">{$_('auth.sign-up.email')}</Field.Label>
			<Input
				id="email"
				{...signUp.fields.email.as('text')}
				placeholder={$_('auth.sign-up.placeholders.email')}
				disabled={signUp.pending > 0}
			/>
			<Field.Error>
				{#each signUp.fields.email.issues() ?? [] as issue}
					<div class="text-red-500 text-sm">{issue.message}</div>
				{/each}
			</Field.Error>
		</Field.Field>

		<!-- Submit button -->
		<Button type="submit" disabled={signUp.pending > 0} class={`w-full`}>
			{signUp.pending > 0 ? $_('auth.sign-up.sending') : $_('auth.sign-up.action')}
		</Button>
	</form>
{/if}

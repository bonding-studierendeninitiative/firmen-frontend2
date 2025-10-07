<script lang="ts">
	import authClient from '@/auth-client';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { _ } from '@services/i18n';
	import { useId } from 'bits-ui';

	let session = authClient.useSession();
	let sessions = authClient.listSessions();

	const nameId = useId('settings-account-name');
	const emailId = useId('settings-account-email');

	let name = $state($session?.data?.user?.name || '');
	let email = $state($session?.data?.user?.email || '');
</script>

<div>
	<section class="space-y-6">
		<div class="flex flex-col">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.account.title')}
			</h2>
			<h4 class=" text-stone-500 text-sm text-balance">
				{$_('user-pages.settings.account.description')}
			</h4>
		</div>
		<form class="flex flex-col gap-4 items-end">
			<div class="w-full">
				<Label for={nameId}>
					{$_('user-pages.settings.account.labels.name')}
				</Label>
				<Input id={nameId} type="text" placeholder="Name" name="name" bind:value={name} />
			</div>

			<div class="w-full">
				<Label for={emailId}>
					{$_('user-pages.settings.account.labels.email')}
				</Label>
				<Input id={emailId} disabled type="email" placeholder="Email" name="email" value={email} />
			</div>

			<Button
				type="submit"
				onclick={async (e) => {
					e.preventDefault();
					await authClient.updateUser({
						name
					});
				}}
			>
				{$_('common.save')}
			</Button>
		</form>
	</section>
	<section>
		<h3 class="text-stone-800 text-lg font-bold">
			{$_('user-pages.settings.account.sessions.title')}
		</h3>
		<ul>
			{#each (await sessions).data ?? [] as session (session.id)}
				<li>
					<p>{session.userAgent}</p>
					<p>{session.createdAt}</p>
				</li>
			{/each}
		</ul>
	</section>
</div>

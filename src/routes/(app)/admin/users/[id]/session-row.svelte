<script lang="ts">
	import authClient from '@/auth-client';
	import UaSummary from './ua-summary.svelte';
	import { toast } from 'svelte-sonner';
	import { UAParser } from 'ua-parser-js';
	import * as Table from '@/components/ui/table';
	import LocalizedDate from '@/@svelte/components/LocalizedDate/LocalizedDate.svelte';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';

	export type Session = {
		id: string;
		userId: string;
		expiresAt: string | Date;
		createdAt: string | Date;
		updatedAt: string | Date;
		token: string;
		ipAddress?: string | null;
		userAgent?: string | null;
	};

	let { session, onRevoke }: { session: Session; onRevoke?: () => void } = $props();
</script>

<Table.Row>
	<!-- Browser / Device (UaSummary compact) -->
	<Table.Cell class="px-3 py-2 align-middle min-w-[220px]">
		{#if session.userAgent}
			{@const ua = new UAParser(session.userAgent).getResult()}
			<UaSummary result={ua} />
		{:else}
			<div class="text-sm text-slate-700 dark:text-slate-200">Unknown browser</div>
			<div class="text-xs text-slate-400 dark:text-slate-500">{session.userAgent ?? ''}</div>
		{/if}
	</Table.Cell>

	<!-- IP address -->
	<Table.Cell class="px-3 py-2 align-middle">
		<div
			class="text-sm text-slate-700 dark:text-slate-200 truncate max-w-[150px]"
			title={session.ipAddress ?? ''}
		>
			{session.ipAddress ?? '—'}
		</div>
	</Table.Cell>

	<!-- Created at -->
	<Table.Cell class="px-3 py-2 align-middle hidden sm:table-cell">
		<LocalizedDate date={session.createdAt} />
	</Table.Cell>

	<!-- Expires at -->
	<Table.Cell class="px-3 py-2 align-middle hidden md:table-cell">
		<LocalizedDate date={session.expiresAt} />
	</Table.Cell>

	<!-- Actions -->
	<Table.Cell class="px-3 py-2 align-middle text-right">
		<Button
			variant="destructive"
			size="sm"
			onclick={() => {
				toast.promise(
					authClient.admin
						.revokeUserSession({
							sessionToken: session.token
						})
						.then(() => {
							onRevoke?.();
						}),
					{
						success: $_('admin-pages.users.sessions.session-revoked-successfully'),
						error: $_('admin-pages.users.sessions.failed-to-revoke-session')
					}
				);
			}}
			aria-label={$_('admin-pages.users.sessions.revoke-session')}
			title={$_('admin-pages.users.sessions.revoke-session')}
		>
			{$_('admin-pages.users.sessions.revoke-session')}
		</Button>
	</Table.Cell>
</Table.Row>

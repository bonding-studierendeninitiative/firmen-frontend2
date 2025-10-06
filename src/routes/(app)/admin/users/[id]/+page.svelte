<script lang="ts">
	import { Link } from '@/@svelte/components';
	import * as Alert from '@/components/ui/alert';
	import * as Avatar from '@/components/ui/avatar';
	import { _ } from '@services';
	import { LoaderCircle, RefreshCwIcon, TriangleAlert } from '@lucide/svelte';
	import * as Table from '@/components/ui/table';
	import { Button } from '@/components/ui/button';
	import authClient from '@/auth-client';
	import { invalidate } from '$app/navigation';
	import BanUserDialog from '@/components/auth/admin/ban-user-dialog.svelte';
	import { page } from '$app/state';
	import UserOrgsDataTable from './user-orgs-data-table.svelte';
	import { fade } from 'svelte/transition';
	import SessionRow from './session-row.svelte';
	import { toast } from 'svelte-sonner';
	import { getOrgMemberships, getUser, updateRole } from '@/trpc/routers/admin';

	let user = $derived(await getUser(page.params.id!));

	let abc = $derived(
		authClient.admin.listUserSessions({
			userId: user?.id
		})
	);

	function refetchSessions() {
		abc = authClient.admin.listUserSessions({
			userId: user?.id
		});
	}

	function onChangeUserRole(
		orgId: string,
		role: 'member' | 'owner' | 'admin',
		memberId: string
	): void {
		try {
			console.log('Changing role for', { memberId, role, orgId });
			updateRole({
				organizationId: orgId,
				memberId,
				role
			}).updates(
				getOrgMemberships(page.params.id!).withOverride((orgMemberships) => {
					return orgMemberships.map((membership) => {
						if (membership.userId === memberId) {
							return {
								...membership,
								role
							};
						}
						return membership;
					});
				})
			);
		} catch (error) {
			console.error('Failed to update user role:', error);
		}
	}
</script>

<main in:fade class="space-y-10">
	<div>
		<Link href="/admin/users">{$_('admin-pages.users.back-to-overview')}</Link>
	</div>
	{#if user}
		<header class="bg-card shadow border shadow-card p-4 rounded-lg border-card">
			<div class="flex gap-4 items-center">
				<Avatar.Root class="size-20">
					<Avatar.Image src={user.image} alt={user.name} />
					<Avatar.Fallback class="text-3xl font-medium"
						>{user.name
							?.split(' ')
							.slice(0, 2)
							.map((word) => word.charAt(0))
							.join('')}</Avatar.Fallback
					>
				</Avatar.Root>
				<div class="flex flex-col">
					<h1 class=" text-stone-950 text-3xl font-extrabold">
						{user.name}
					</h1>
					<p class="text-sm">{user.email}</p>
					<div class="text-sm flex gap-2 mt-4">
						{#if user.role}
							<p>
								{$_('admin-pages.users.roles.label')}: {$_(`admin-pages.users.roles.${user.role}`)}
							</p>
							<span class="font-bold">&middot;</span>
						{/if}
						<p class=" text-gray-700">
							Joined on {new Date(user.createdAt).toLocaleDateString()}
						</p>
					</div>
				</div>
				<div class="grow"></div>
				{#if !user.banned}
					<BanUserDialog {user} />
				{/if}
			</div>
		</header>
		{#if user.banned}
			<Alert.Root class="bg-destructive w-auto min-w-[30ch] text-destructive-foreground">
				<TriangleAlert class="size-5 text-current!" />
				<Alert.Title>{$_('admin-pages.users.overview.banned')}</Alert.Title>
				<Alert.Description>
					{#if user.banReason}
						<br />
						{$_('admin-pages.users.overview.banReason')}: {user.banReason}
					{/if}
					{#if user.banExpires}
						<br />
						{$_('admin-pages.users.overview.banExpires')}: {new Date(
							user.banExpires
						).toLocaleDateString()}
					{/if}
					<div class="pt-4">
						<Button
							variant="ghost"
							onclick={async () => {
								await authClient.admin.unbanUser({
									userId: user?.id
								});
								await invalidate('trpc:admin.users.getDetails');
							}}>Unban User</Button
						>
					</div>
				</Alert.Description>
			</Alert.Root>
		{/if}
		<div class="flex flex-col">
			{#if page.params.id && getOrgMemberships(page.params.id).ready}
				<h2 class="text-lg font-semibold">{$_('admin-pages.users.orgs.orgMemberships')}</h2>
				<UserOrgsDataTable
					memberships={getOrgMemberships(page.params.id).current ?? []}
					isLoading={false}
					totalCount={getOrgMemberships(page.params.id).current?.length ?? 0}
					{onChangeUserRole}
				/>
			{:else}
				<p>{$_('admin-pages.users.orgs.noOrganizations')}</p>
			{/if}
		</div>
	{/if}
	<section class="space-y-4">
		<h2 class="text-lg font-semibold">{$_('admin-pages.users.sessions.title')}</h2>
		{#await abc}
			<div class="flex justify-center">
				<LoaderCircle class="size-10 animate-spin" />
			</div>
		{:then sessions}
			<div class=" bg-card border border-card shadow shadow-card rounded-lg">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="pl-3">{$_('admin-pages.users.sessions.device')}</Table.Head>
							<Table.Head class="px-3 py-2 align-middle hidden sm:table-cell">
								{$_('admin-pages.users.sessions.ip-address')}
							</Table.Head>
							<Table.Head class="px-3 py-2 align-middle hidden md:table-cell"
								>{$_('table-headings.created')}</Table.Head
							>
							<Table.Head class="px-3 py-2 align-middle hidden md:table-cell"
								>{$_('table-headings.expires')}</Table.Head
							>
							<Table.Head class="px-3 py-2 align-middle text-right"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each sessions?.data?.sessions ?? [] as session (session.id)}
							<SessionRow {session} onRevoke={refetchSessions} />
						{:else}
							<Table.Row>
								<Table.Cell colspan={5} class="text-center"
									>{$_('admin-pages.users.sessions.no-active-sessions')}</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onclick={refetchSessions}
					title={$_('admin-pages.users.sessions.refresh-sessions')}
				>
					<RefreshCwIcon class="size-4" />
				</Button>
				<Button
					variant="destructive"
					disabled={sessions?.data?.sessions.length === 0}
					onclick={() => {
						toast.promise(
							authClient.admin
								.revokeUserSessions({
									userId: user?.id
								})
								.then(() => {
									refetchSessions();
								}),
							{
								success: 'All sessions revoked successfully',
								error: 'Failed to revoke all sessions'
							}
						);
					}}>{$_('admin-pages.users.sessions.revoke-all-sessions')}</Button
				>
			</div>
		{:catch error}
			<p class="text-red-500">
				{$_('admin-pages.users.sessions.error', { error: error.message })}
			</p>
		{/await}
	</section>
</main>

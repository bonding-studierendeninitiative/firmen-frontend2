<script lang="ts">
	import { _ } from '@services';
	import { AdminManageOrgMembers } from '@/@svelte/modules';
	import { LoaderCircle, TriangleAlert } from '@lucide/svelte';
	import { queryParameters } from 'sveltekit-search-params';
	import * as Alert from '@/components/ui/alert';
	import * as Avatar from '@/components/ui/avatar';
	import { Link, LocalizedDate } from '@/@svelte/components';
	import { fade } from 'svelte/transition';
	import authClient from '@/auth-client';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import {
		addMember,
		getOrgDetails,
		getOrgMembers,
		getSsoProviders,
		removeMember,
		updateRole
	} from '@/remote/functions/admin';
	import SuperDebug from 'sveltekit-superforms';

	let { data } = $props();

	let params = queryParameters({
		page: false,
		limit: false,
		sortBy: false,
		sortDirection: false
	});

	function filterOrgEntries(tuple: [string, any]): tuple is [string, string] {
		// console.log(tuple);
		const [key, value] = tuple;
		const excludedKeys = [
			'id',
			'createdAt',
			'modifiedAt',
			'slug',
			'name',
			'organizationType',
			'imageUrl'
		];
		const keyValid = key != undefined && !excludedKeys.includes(key);
		const valueValid = typeof value === 'string';
		return keyValid && valueValid;
	}

	const filters = $derived.by(() => {
		if (!data.organizationId) return null;
		return {
			organizationId: data.organizationId,
			limit: Number(params.limit || '10'),
			page: Number(params.page || '0'),
			sortBy: params.sortBy as 'role' | 'createdAt',
			sortDirection: params.sortDirection as 'asc' | 'desc'
		};
	});

	// const updateRole = api.admin.orgs.members.updateRole.createMutation();

	// new: dialog state & form fields
	let isCreateSsoOpen = $state(false);
	let ssoProviderId = $state('');
	let ssoIssuer = $state('');
	let ssoClientId = $state('');
	let ssoClientSecret = $state('');

	// additional configurable fields for registration
	let ssoDomain = $state('example.com');
	let ssoAuthorizationEndpoint = $state('');
	let ssoTokenEndpoint = $state('');
	let ssoJwksEndpoint = $state('');
	let ssoDiscoveryEndpoint = $state('');
	// scopes as comma-separated string in the UI, converted before send
	let ssoScopes = $state('openid,email,profile');
	let ssoPkce = $state(true);

	// mapping fields
	let mappingId = $state('sub');
	let mappingEmail = $state('email');
	let mappingEmailVerified = $state('email_verified');
	let mappingName = $state('name');
	let mappingImage = $state('picture');

	let orgDetails = $derived.by(() => {
		if (!filters) return null;
		return getOrgDetails(filters);
	});
</script>

<main in:fade class="space-y-8 py-6">
	<div>
		<Link href="/admin/organizations">{$_('admin-pages.organizations.back-to-overview')}</Link>
	</div>
	{#if filters}
		{#if getOrgDetails(filters).loading}
			<LoaderCircle class="size-12 animate-spin mx-auto" />
		{/if}
		{#if getOrgDetails(filters).ready && orgDetails !== null}
			<header
				class="flex flex-col gap-y-6 bg-card shadow shadow-card border border-card rounded-lg p-4"
			>
				<div class="flex gap-4 items-center">
					<Avatar.Root class="size-20">
						<Avatar.Image src={orgDetails?.current?.logo} />
						<Avatar.Fallback class="text-3xl font-medium"
							>{orgDetails?.current?.name
								.split(' ')
								.slice(0, 2)
								.map((word) => word[0].toUpperCase())
								.join('')}</Avatar.Fallback
						>
					</Avatar.Root>
					<div class="flex flex-col">
						<h1 class=" text-stone-950 text-3xl font-extrabold">
							{orgDetails?.current?.name}
						</h1>
						<div class="flex flex-row gap-2 text-sm">
							<span>Erstellt <LocalizedDate date={orgDetails?.current?.createdAt} /></span>
							{#if Number(orgDetails?.current?.members.length) > 0}
								<span>&middot;</span>
								<span>
									{$_('admin-pages.organizations.membersCount', {
										values: {
											count: orgDetails?.current?.members.length
										}
									})}
								</span>
							{/if}
						</div>
					</div>
				</div>
				{#if JSON.parse(orgDetails?.current?.metadata ?? '{"public": {"type":null}}')?.public?.type}
					<p>
						{$_(
							`common.org-types.${JSON.parse(orgDetails?.current?.metadata ?? '{"public": {"type":null}}')?.public?.type}`
						)}
					</p>
				{/if}
			</header>
		{/if}
		{#if orgDetails?.current?.metadata}
			{@const metadata = orgDetails?.current?.metadata}
			{@const organizationInfo = Object.entries(JSON.parse(metadata ?? '{public: {}}').public)
				.filter(filterOrgEntries)
				.map(([key, value]) => ({ label: key, value }))}
			{#if organizationInfo.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
					{#each organizationInfo as { label, value } (label)}
						<p class=" font-normal text-sm text-stone-500">
							{$_(`admin-pages.organizations.${label}`)}
						</p>
						<p class=" w-full text-right font-normal text-sm text-stone-800">
							{#if label === 'createdBy'}
								{getOrgMembers(filters).current?.members.find((item) => {
									return item.userId === value;
								})?.user.name}
							{:else}
								{value}
							{/if}
						</p>
					{/each}
				</div>
			{/if}
		{/if}
		{#if data.is_bondingOrg}
			<Alert.Root class="bg-primary text-primary-foreground">
				<TriangleAlert class="size-5 text-current!" />
				<Alert.Title>Das ist die bonding-Organisation</Alert.Title>
				<Alert.Description
					>Pass auf, wenn du auf dieser Seite änderungen durchführst.</Alert.Description
				>
			</Alert.Root>
		{/if}
		{#if filters}
			<section class="space-y-4">
				<h3 class=" text-xl font-semibold text-stone-800">
					{$_(`admin-pages.organizations.contactPeople`)}
				</h3>
				{#if getOrgMembers(filters).loading}
					<LoaderCircle class="size-12 animate-spin mx-auto" />
				{/if}
				{#if getOrgMembers(filters).ready}
					<AdminManageOrgMembers
						organizationId={data.organizationId!}
						memberResponse={getOrgMembers(filters).current?.members ?? []}
						showAddMemberButton={true}
						onChangeUserRole={(userId, role, organizationId) => {
							try {
								console.log('Changing role for', { userId, role, organizationId });
								updateRole({
									organizationId,
									memberId: userId,
									role
								}).updates(
									getOrgMembers(filters).withOverride((orgMembers) => {
										return {
											...orgMembers,
											members: orgMembers.members.map((member) => {
												if (member.userId === userId) {
													return {
														...member,
														role
													};
												}
												return member;
											})
										};
									})
								);
							} catch (error) {
								console.error('Failed to update user role:', error);
							}
						}}
						onAddMember={async (userId, sendNotification) => {
							try {
								await addMember({
									userId,
									organizationId: data.organizationId!,
									sendNotification
								}).updates(
									getOrgMembers(filters).withOverride((orgMembers) => {
										return {
											...orgMembers,
											members: [
												...orgMembers.members,
												{
													userId,
													user: {
														name: 'Loading...',
														image: null,
														id: userId,
														email: '',
														banned: null
													},
													role: 'member',
													createdAt: new Date(),
													organizationId: data.organizationId!,
													id: crypto.randomUUID()
												}
											]
										};
									})
								);
								toast.success($_('modules.add-member-dialog.success'));
							} catch (error) {
								toast.error(error?.message);
							}
						}}
						onRemoveMember={async (userId, sendNotification) => {
							try {
								await removeMember({
									userId,
									organizationId: data.organizationId!,
									sendNotification
								}).updates(
									getOrgMembers(filters).withOverride((orgMembers) => {
										return {
											...orgMembers,
											members: orgMembers.members.filter((member) => member.userId !== userId)
										};
									})
								);
								toast.success($_('modules.remove-member-dialog.success'));
							} catch (error) {
								toast.error(error?.message);
							}
						}}
					/>
				{/if}
			</section>
			<section>
				<section class="space-y-4">
					<h3 class="text-xl font-semibold text-stone-800">
						{$_('admin-pages.organizations.sso.title')}
					</h3>

					{#if getSsoProviders(filters).loading}
						<LoaderCircle class="size-12 animate-spin mx-auto" />
					{/if}

					{#if getSsoProviders(filters).ready}
						{@const ssoConnections = getSsoProviders(filters).current}
						{#if ssoConnections?.length === 0}
							<Alert.Root class="bg-muted text-muted-foreground">
								<Alert.Title>
									{$_('admin-pages.organizations.sso.none')}
								</Alert.Title>
								<Alert.Description>
									{$_('admin-pages.organizations.sso.hint', {
										values: { org: (await getOrgDetails(filters))?.name }
									})}
								</Alert.Description>
							</Alert.Root>
						{:else}
							<div class="grid gap-3">
								{#each ssoConnections ?? [] as conn (conn.providerId)}
									<div
										class="flex items-center justify-between bg-card border border-card rounded-lg p-3"
									>
										<div class="flex items-center gap-4">
											<div class="flex flex-col">
												<span class="font-medium text-stone-800">{conn.providerId}</span>
											</div>
										</div>
										<div class="flex items-center gap-3">
											{conn.oidcConfig}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					{/if}

					<div class="flex items-center gap-3 pt-2">
						<!-- create-sso dialog trigger -->
						<Dialog.Root bind:open={isCreateSsoOpen}>
							<Dialog.Trigger>
								{$_('admin-pages.organizations.sso.add')}
							</Dialog.Trigger>
							<Dialog.Content class="sm:max-w-[640px]">
								<Dialog.Header>
									<Dialog.Title>{$_('admin-pages.organizations.sso.add')}</Dialog.Title>
									<Dialog.Description>
										{$_('admin-pages.organizations.sso.add-description')}
									</Dialog.Description>
								</Dialog.Header>
								<div class="space-y-4 py-2">
									<div class="grid grid-cols-1 gap-3">
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.providerId')}</span
											>
											<input
												class="input"
												bind:value={ssoProviderId}
												placeholder="e.g. acme-oidc"
											/>
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.domain')}</span
											>
											<input class="input" bind:value={ssoDomain} placeholder="example.com" />
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.authorizationEndpoint')}</span
											>
											<input
												class="input"
												bind:value={ssoAuthorizationEndpoint}
												placeholder="https://idp.example.com/authorize"
											/>
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.tokenEndpoint')}</span
											>
											<input
												class="input"
												bind:value={ssoTokenEndpoint}
												placeholder="https://idp.example.com/token"
											/>
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.jwksEndpoint')}</span
											>
											<input
												class="input"
												bind:value={ssoJwksEndpoint}
												placeholder="https://idp.example.com/jwks"
											/>
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.discoveryEndpoint')}</span
											>
											<input
												class="input"
												bind:value={ssoDiscoveryEndpoint}
												placeholder="https://idp.example.com/.well-known/openid-configuration"
											/>
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.scopes')}</span
											>
											<input
												class="input"
												bind:value={ssoScopes}
												placeholder="openid,email,profile"
											/>
										</label>
										<label class="flex items-center gap-2">
											<input type="checkbox" bind:checked={ssoPkce} />
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.pkce') ?? 'Use PKCE'}</span
											>
										</label>

										<!-- mapping -->
										<div class="pt-2">
											<p class="text-sm font-medium">
												{$_('admin-pages.organizations.sso.mapping')}
											</p>
											<label class="flex flex-col pt-1">
												<span class="text-sm text-muted-foreground">ID claim</span>
												<input class="input" bind:value={mappingId} />
											</label>
											<label class="flex flex-col pt-1">
												<span class="text-sm text-muted-foreground">Email claim</span>
												<input class="input" bind:value={mappingEmail} />
											</label>
											<label class="flex flex-col pt-1">
												<span class="text-sm text-muted-foreground">Email verified claim</span>
												<input class="input" bind:value={mappingEmailVerified} />
											</label>
											<label class="flex flex-col pt-1">
												<span class="text-sm text-muted-foreground">Name claim</span>
												<input class="input" bind:value={mappingName} />
											</label>
											<label class="flex flex-col pt-1">
												<span class="text-sm text-muted-foreground">Image claim</span>
												<input class="input" bind:value={mappingImage} />
											</label>
										</div>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.issuer')}
											</span>
											<input
												class="input"
												bind:value={ssoIssuer}
												placeholder="https://accounts.example.com"
											/>
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.clientId')}</span
											>
											<input class="input" bind:value={ssoClientId} />
										</label>
										<label class="flex flex-col">
											<span class="text-sm text-muted-foreground"
												>{$_('admin-pages.organizations.sso.clientSecret')}</span
											>
											<input class="input" bind:value={ssoClientSecret} type="password" />
										</label>
									</div>
								</div>
								<Dialog.Footer class="flex justify-end gap-2">
									<Button variant="outline" onclick={() => (isCreateSsoOpen = false)}>
										{$_('common.cancel')}
									</Button>
									<Button
										onclick={async () => {
											try {
												const payload = {
													providerId: ssoProviderId,
													issuer: ssoIssuer,
													domain: ssoDomain,
													oidcConfig: {
														clientId: ssoClientId,
														clientSecret: ssoClientSecret,
														authorizationEndpoint: ssoAuthorizationEndpoint || undefined,
														tokenEndpoint: ssoTokenEndpoint || undefined,
														jwksEndpoint: ssoJwksEndpoint || undefined,
														discoveryEndpoint: ssoDiscoveryEndpoint || undefined
													},
													scopes: (ssoScopes || '')
														.split(',')
														.map((s) => s.trim())
														.filter(Boolean),
													pkce: !!ssoPkce,
													mapping: {
														id: mappingId,
														email: mappingEmail,
														emailVerified: mappingEmailVerified,
														name: mappingName,
														image: mappingImage
													},
													organizationId: data.organizationId || undefined
												};
												await authClient.sso.register(payload);
												// on success, close dialog and refresh providers list
												isCreateSsoOpen = false;
												await getSsoProviders(filters).refresh();
												toast.success($_('admin-pages.organizations.sso.create-success'));
											} catch (err) {
												console.error(err);
												toast.error(err?.message ?? 'Could not create external connection');
											}
										}}
									>
										{$_('common.create') ?? 'Create'}
									</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
						{#if data.is_bondingOrg}
							<Alert.Root class="bg-primary text-primary-foreground">
								<TriangleAlert class="size-5 text-current!" />
								<Alert.Title>{$_('admin-pages.organizations.sso.bonding-warning')}</Alert.Title>
							</Alert.Root>
						{/if}
					</div>
				</section>
			</section>
		{/if}
	{/if}
</main>

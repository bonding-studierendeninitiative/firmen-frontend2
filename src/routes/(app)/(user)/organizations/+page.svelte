<script lang="ts">
	import { _ } from '@services';
	import type { PageData } from './$types';
	import { Button, NoDataFound } from '$lib/@svelte/components';
	import { CreateOrganization } from '$lib/@svelte/modules/CreateOrganization';

	export let data: PageData;
	import { superForm } from 'sveltekit-superforms';

	// Client API:
	const form = superForm(data.form);
	let isOpen = false;
</script>

<div class="bg-brand w-full h-[100dvh]">
<main class="container mx-auto py-12 px-4 md:px-6">
	<header>
		<h1 class="text-white text-3xl font-extrabold">{$_('user-pages.organizations.organizations')}</h1>
		<h4
			class="text-white max-w-prose text-balance">{$_('user-pages.organizations.organizationsSubHeading')}</h4>
	</header>
	<section class="my-10 flex flex-col gap-4">
		<h2 class="text-white text-lg font-extrabold">{$_('user-pages.organizations.myOrganizations')}</h2>
		{#if data.memberships}
			{#if data.memberships.length === 0}
				<NoDataFound heading={$_('user-pages.organizations.noOrgMembershipsFound')}
										 subHeading={$_('user-pages.organizations.noOrgMembershipsFoundDescription')}
										 buttonText={$_('user-pages.organizations.newOrganization')} onButtonClick={() => {
											 isOpen = true;
										 }} />
			{/if}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.memberships as {
					organizationName,
					organizationSlug,
					membershipType
				}, index (index)}

					<div class="bg-white p-6 rounded-lg shadow-md">
						<div class="mb-4 flex flex-col gap-2 justify-items-start">
							<a href="/{organizationSlug}/dashboard">
								<h3 class="text-lg font-semibold">{organizationName}</h3>
							</a>
							<span class="w-fit rounded text-xs font-mono tracking-wide px-2 py-1 bg-gray-100 text-muted-foreground">{organizationSlug}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class=" text-sm text-muted-foreground">{membershipType}</span>
							<Button onClick={() => {}} classes="outline">
								Leave
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
	<section>
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-white text-xl font-bold">Discover Organizations</h2>
			<Button classes="bg-white" onClick={() => {isOpen = true}}>Create Organization</Button>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<div class="bg-white p-6 rounded-lg shadow-md">
				<div class="mb-4">
					<h3 class="text-lg font-semibold">Tech Community</h3>
					<p class="text-muted-foreground">A community for tech enthusiasts to connect and collaborate.</p>
				</div>
				<Button onClick={() => {}} classes="outline">Join</Button>
			</div>
			<div class="bg-white p-6 rounded-lg shadow-md">
				<div class="mb-4">
					<h3 class="text-lg font-semibold">Sustainability Club</h3>
					<p class="text-muted-foreground">Promoting sustainable practices and environmental awareness.</p>
				</div>
				<Button onClick={() => {}} classes="outline">Join</Button>
			</div>
			<div class="bg-white p-6 rounded-lg shadow-md">
				<div class="mb-4">
					<h3 class="text-lg font-semibold">Book Club</h3>
					<p class="text-muted-foreground">
						A group of book lovers who meet regularly to discuss literature.
					</p>
				</div>
				<Button onClick={() => {}} classes="outline">Join</Button>
			</div>
		</div>
	</section>

	<section class=" mt-6">

	</section>
</main>
</div>

<CreateOrganization superForm={form} bind:isOpen />
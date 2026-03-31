<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { getLegacyOrgDetails } from '@/remote/functions/admin';
	import * as Card from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import { Separator } from '@/components/ui/separator';
	import {
		MapPin,
		User,
		Phone,
		Mail,
		Info,
		ArrowLeft,
		Printer,
		Globe,
		Building2
	} from '@lucide/svelte';
	import { Link } from '@/@svelte/components';
	import { _ } from '@services';
	import { fade } from 'svelte/transition';
	import ImportLegacyOrgDialog from './import-legacy-org-dialog.svelte';
	import { SimpleLegacyOrganizationAddress } from '@api/admin-client';

	const { params } = $props();

	let query = getLegacyOrgDetails({
		orgId: params.legacyOrgId
	});

	let importLegacyOrgDialogOpen = $state(false);
</script>

<svelte:boundary>
	{#snippet pending()}
		<div class="flex h-64 items-center justify-center">
			<p class="animate-pulse text-muted-foreground">{$_('common.loading')}</p>
		</div>
	{/snippet}

	{#snippet failed(error, retry)}
		<Card.Root class="border-destructive">
			<Card.Header>
				<Card.Title class="text-destructive">Fehler beim Laden der Legacy-Organisation</Card.Title>
				<Card.Description>{error}</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button onclick={retry}>Erneut versuchen</Button>
			</Card.Content>
		</Card.Root>
	{/snippet}

	{#if query.current}
		{@const org = query.current}
		<div in:fade class="space-y-6 pb-12">
			<div class="flex items-center gap-4">
				<Link
					href="javascript:history.back()"
					class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft class="size-4" />
					Zurück zur Übersicht
				</Link>
			</div>

			<div class="flex flex-col gap-4 md:flex-row md:items-end justify-between">
				<div class="space-y-1">
					<h1 class="text-3xl font-bold tracking-tight">{org.name}</h1>
					<p class="text-lg text-muted-foreground">{org.fullName}</p>
				</div>
				<div class="flex flex-wrap gap-2">
					<Badge variant="outline" class="font-mono">ID: {org.id}</Badge>
					{#if org.shortName}
						<Badge variant="secondary">{org.shortName}</Badge>
					{/if}
				</div>
				<ImportLegacyOrgDialog org={query.current} bind:open={importLegacyOrgDialogOpen} />
				<Button onclick={() => (importLegacyOrgDialogOpen = true)}>
					{$_('admin-pages.organizations.importOrganization.trigger')}
				</Button>
			</div>

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<!-- General Information Card -->
				<Card.Root class="lg:col-span-2">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Info class="size-5 text-primary" />
							Allgemeine Informationen
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="space-y-1">
								<p class="text-sm font-medium text-muted-foreground">Offizieller Name</p>
								<p class="font-medium">{org.fullName || '-'}</p>
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-muted-foreground">Anzeigename</p>
								<p class="font-medium">{org.publicName || '-'}</p>
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-muted-foreground">Fax</p>
								<div class="flex items-center gap-2">
									<Printer class="size-4 text-muted-foreground" />
									<span>{org.fax || '-'}</span>
								</div>
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-muted-foreground">Typ</p>
								<div class="flex items-center gap-2">
									<Building2 class="size-4 text-muted-foreground" />
									<span>Notes Organisation</span>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				{#if org.address}
					<!-- Address Card -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<MapPin class="size-5 text-primary" />
								Standort & Kontakt
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="space-y-1">
								<p class="text-sm font-medium text-muted-foreground">Anschrift</p>
								{@render address(org.address, false)}
							</div>
							<Separator />
							<div class="space-y-1">
								<p class="text-sm font-medium text-muted-foreground">Telefon</p>
								<div class="flex items-center gap-2">
									<Phone class="size-4 text-muted-foreground" />
									<a href="tel:{org.address.phone}" class="hover:underline"
										>{org.address.phone || '-'}</a
									>
								</div>
							</div>
							{#if org.address.addressType == 'Postfach'}
								<Separator />
								<div class="space-y-1">
									<p class="text-sm font-medium text-muted-foreground">Postfach</p>
									{@render address(org.address, true)}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
			</div>

			{#if org.contactPeople && Number(org.contactPeople?.length) > 0}
				<!-- Contact People Section -->
				<div class="space-y-4 pt-4">
					<div class="flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-2xl font-semibold">
							<User class="size-6 text-primary" />
							Kontaktpersonen
							<Badge variant="secondary" class="ml-2">{org.contactPeople.length}</Badge>
						</h2>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{#each org.contactPeople as person}
							<Card.Root class="flex flex-col transition-shadow hover:shadow-md">
								<Card.Header class="pb-3">
									<div class="flex items-start justify-between">
										<div class="space-y-1">
											<Card.Title class="text-lg">
												{person.firstName}
												{person.lastName}
											</Card.Title>
											{#if person.department}
												<div
													class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
												>
													{person.department}
												</div>
											{/if}
										</div>
										<Badge variant="outline" class="text-[10px] opacity-70">
											{person.gender}
										</Badge>
									</div>
								</Card.Header>
								<Card.Content class="flex-grow space-y-3">
									<div class="space-y-2">
										{#if person.email}
											<div class="flex items-center gap-2 text-sm">
												<Mail class="size-4 text-primary/70" />
												<a
													href="mailto:{person.email}"
													class="break-all text-primary hover:underline"
												>
													{person.email}
												</a>
											</div>
										{/if}
										{#if person.phone}
											<div class="flex items-center gap-2 text-sm">
												<Phone class="size-4 text-primary/70" />
												<a href="tel:{person.phone}" class="hover:underline">{person.phone}</a>
											</div>
										{/if}
										{#if person.phone2}
											<div class="flex items-center gap-2 text-sm">
												<Phone class="size-4 text-primary/70" />
												<a href="tel:{person.phone2}" class="hover:underline">{person.phone2}</a>
											</div>
										{/if}
									</div>

									{#if person.responsible || person.language || person.remarks}
										<Separator class="my-2" />
										<div class="space-y-2 text-xs text-muted-foreground">
											{#if person.responsible}
												<div class="flex justify-between">
													<span class="font-medium">Zuständigkeit:</span>
													<span class="text-foreground">{person.responsible}</span>
												</div>
											{/if}
											{#if person.language}
												<div class="flex justify-between">
													<span class="font-medium">Sprache:</span>
													<span class="text-foreground">{person.language}</span>
												</div>
											{/if}
											{#if person.remarks}
												<div class="mt-2 rounded-md bg-muted/50 p-2 italic">
													&ldquo;{person.remarks}&rdquo;
												</div>
											{/if}
										</div>
									{/if}
								</Card.Content>
								<Card.Footer class="border-t bg-muted/20 py-2">
									<p class="font-mono text-[9px] text-muted-foreground">
										LEGACY_ID: {person.legacyId}
									</p>
								</Card.Footer>
							</Card.Root>
						{/each}

						{#if org.contactPeople.length === 0}
							<Card.Root
								class="flex flex-col items-center justify-center border-dashed p-12 md:col-span-2 xl:col-span-3"
							>
								<User class="mb-4 size-12 opacity-20" />
								<p class="text-muted-foreground">
									Keine Kontaktpersonen in den Reindaten gefunden.
								</p>
							</Card.Root>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Raw Data Toggle (Optional helper for admins) -->
			<div class="pt-8">
				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
					>
						<div
							class="size-4 transition-transform group-open:rotate-90 flex items-center justify-center font-bold"
						>
							&gt;
						</div>
						Rohdaten anzeigen
					</summary>
					<pre
						class="mt-4 max-h-96 overflow-auto rounded-lg border bg-stone-950 p-4 font-mono text-xs text-stone-100">{JSON.stringify(
							org,
							null,
							2
						)}</pre>
				</details>
			</div>
		</div>
	{/if}
</svelte:boundary>

{#snippet address(address: SimpleLegacyOrganizationAddress, postbox: boolean)}
	{#if !postbox}
		<p class="leading-relaxed">
			{address.street}<br />
			{#if address.country && address.country.length > 0 && address.country.length <= 3}
				{address.country}-{address.postCode}
				{address.location}
			{:else}
				{address.postCode}
				{address.location}<br />
				<span class="flex items-center gap-1">
					<Globe class="size-3" />
					{address.country}
				</span>
			{/if}
		</p>
	{:else}
		<p class="leading-relaxed">
			{address.pob}<br />
			{#if address.country && address.country.length > 0 && address.country.length <= 3}
				{address.country}-{address.pobplz}
				{address.location}
			{:else}
				{address.pobplz}
				{address.location}<br />
				<span class="flex items-center gap-1">
					<Globe class="size-3" />
					{address.country}
				</span>
			{/if}
		</p>
	{/if}
{/snippet}

<script lang="ts" context="module">
	import {
		Calendar,
		CheckCircle2,
		ChevronDown,
		ChevronRight,
		Clock,
		FileText,
		Info,
		Package,
		Users
	} from 'lucide-svelte';

	// Status mapping for visual indicators
	const catalogueDataStatusConfig = {
		'changes-requested': { color: 'text-yellow-500', label: 'New' },
		created: { color: 'text-blue-500', label: 'Created' },
		confirmed: { color: 'text-green-500', label: 'Confirmed' },
		rejected: { color: 'text-red-500', label: 'Rejected' },
		missing: { color: 'text-red-500', label: 'Rejected' },
		uploaded: { color: 'text-blue-500', label: 'Pending' }
	};

	// Calculate the completion percentage for catalogue data
	const calculateCatalogueCompletion = (data: GetEventRegistrationForOrganizationOutput): number => {

		function getSingleCompletion(status: string): number {
			switch (status) {
				case 'confirmed':
					return 1.00;
				case 'missing':
					return 0;
				case 'changes-requested':
					return .25;
				case 'uploaded':
					return .50;
				case 'rejected':
					return 0;
			}
			return 0;
		}

		let total: number;
		let status: string[];

		if (data.canUploadAdvertisement) {
			total = 3;
			status = [data.logoStatus, data.advertisementStatus, data.portraitStatus];
		} else {
			total = 2;
			status = [data.logoStatus, data.portraitStatus];
		}

		const completed = status
			.map(getSingleCompletion)
			.filter(Boolean)
			.reduce((sum, current) => sum + current, 0);
		return (completed / total);
	};
</script>

<script lang="ts">

	import { Badge } from '@/components/ui/badge';
	import * as Avatar from '@/components/ui/avatar';
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
	import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
	import RegistrationAddonTree from './registration-addon-tree.svelte';
	import { Progress } from '@/components/ui/progress';
	import { Separator } from '@/components/ui/separator';
	import * as Tooltip from '@/components/ui/tooltip';
	import {
		AdvertisementPreview,
		LocalizedDate,
		LocalizedDateRange,
		LogoPreview
	} from '@/@svelte/components';
	import { buttonVariants, Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { _ } from '@services';
	import {
		EditContactPersons,
		PickLogoDialog,
		ViewAdvertisementDialog,
		ViewLogoDialog
	} from '@/@svelte/modules';
	import { PickAdvertisementDialog } from '@/@svelte/modules/PickAdvertisementDialog';
	import { PenLine, Plus } from 'lucide-svelte';
	import type {GetEventRegistrationForOrganizationOutput } from '@api/client';

	let isAddonsOpen = false;
	export let registration: GetEventRegistrationForOrganizationOutput;

	const statusConfig = {
		created: { color: 'bg-blue-500', label: $_('status-text.created') },
		confirmed: { color: 'bg-green-500', label: $_('status-text.confirmed') },
		rejected: { color: 'bg-red-500', label: $_('status-text.rejected') },
		withdrawn: { color: 'bg-gray-500', label: $_('status-text.withdrawn') }
	};

	let pickAdvertisementOpen = false;
	let viewAdvertisementOpen = false;
	let editContactPersonsOpen = false;
	let viewLogoOpen = false;
	let pickLogoOpen = false;
</script>

<Card class="w-full max-w-2xl shadow-md hover:shadow-lg transition-shadow">

	<PickAdvertisementDialog bind:open={pickAdvertisementOpen} id={registration.id} orgId={registration.organizationId} />
	<ViewAdvertisementDialog bind:open={viewAdvertisementOpen} advertisement={registration.advertisement} />
	<EditContactPersons bind:open={editContactPersonsOpen} contactPeople={registration.contactPeople?.map(({id})=> id)}
											eventRegistrationId={registration.id} />
	<PickLogoDialog bind:open={pickLogoOpen} id={registration.id} orgId={registration.organizationId} />
	<ViewLogoDialog bind:open={viewLogoOpen} logo={registration.logo} />
	<CardHeader class="pb-2">
		<div class="flex justify-between items-start">
			<div>
				<CardTitle class="text-xl font-bold">{registration.event.name}</CardTitle>
				<CardDescription class="mt-1">{registration.event.location}</CardDescription>
			</div>
			<Badge class={`${statusConfig[registration.status].color} text-white`}>
				{statusConfig[registration.status].label}
			</Badge>
		</div>
	</CardHeader>
	<CardContent class="space-y-4">
		<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
			<div class="flex items-center">
				<Calendar class="h-4 w-4 mr-2 text-muted-foreground" />
				<LocalizedDateRange format="ll" hoverFormat="none" class="text-sm" dateFrom={registration.event.dateFrom}
														dateTo={registration.event.dateTo} />
			</div>
			{#if registration.purchasedPackage}
				<div class="flex items-center">
					<Package class="h-4 w-4 mr-2 text-muted-foreground" />
					<span class="text-sm font-medium">{$_("components.registration-card.package", {
						values: {
							package: registration.purchasedPackage.name,
						}
					})}</span>
				</div>
			{/if}
			{#if registration.desiredEventRegistrationDays?.length > 0}
				<div class="flex items-center">
					<Clock class="h-4 w-4 mr-2 text-muted-foreground" />
					<span class="text-sm">{$_("components.registration-card.desired-participation-days", {
						values: {
							days: registration.desiredEventRegistrationDays?.length
						}
					})}</span>
				</div>
			{/if}
		</div>

		<Separator />

		<div class="space-y-2">
			<div class="flex justify-between items-center">
				<h4 class="text-sm font-medium">{$_("components.registration-card.catalogue-data")}</h4>
				<span class="text-xs text-muted-foreground">{$_("components.registration-card.catalogue-data-completion", {
					values: {
						completion: calculateCatalogueCompletion(registration),
					}
				})}</span>
			</div>
			<Progress value={calculateCatalogueCompletion(registration)*100} class="h-2" />

			<div class="flex flex-wrap gap-3 mt-2">
				<Tooltip.Root group="registration-card">
					<Tooltip.Trigger>
						<Button
							class={cn("flex items-center gap-1 text-xs", catalogueDataStatusConfig[registration.logoStatus]?.color)}
							variant="ghost" size="sm" on:click={() => {
								if (registration.logo !== null) {
									viewLogoOpen = true;
								} else {

								pickLogoOpen = true
								}
								}}>
							{#if registration.logoStatus === "confirmed"}
								<CheckCircle2 class="h-3.5 w-3.5" />
							{:else}
								<Info class="h-3.5 w-3.5" />
							{/if}
							{$_("common.logo")}
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{#if registration.logoStatus !== "missing"}
							<LogoPreview class="max-w-64" logo={registration.logo} />
						{:else}
							{$_("components.registration-card.logo-tooltip-content." + registration.logoStatus)}
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>

				{#if registration.canUploadAdvertisement}
					<Tooltip.Root group="registration-card">
						<Tooltip.Trigger
							class={`flex items-center text-xs ${catalogueDataStatusConfig[registration.advertisementStatus]?.color}`}>
							<Button
								class={cn("flex items-center gap-1 text-xs", catalogueDataStatusConfig[registration.advertisementStatus]?.color)}
								variant="ghost" size="sm" on:click={() =>{
									if (registration.advertisement !== null) {
										viewAdvertisementOpen = true;
									} else {
										pickAdvertisementOpen = true;
									}
								}}>
								{#if registration.advertisementStatus === "confirmed"}
									<CheckCircle2 class="h-3.5 w-3.5 mr-1" />
								{:else}
									<Info class="h-3.5 w-3.5 mr-1" />
								{/if}
								{$_("common.advert")}
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							{#if registration.advertisementStatus !== "missing"}
								<AdvertisementPreview class="max-w-64" advertisement={registration.advertisement} />
							{:else}
								{$_("components.registration-card.advertisement-tooltip-content." + registration.advertisementStatus)}
							{/if}
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}

				<Tooltip.Root group="registration-card">
					<Tooltip.Trigger
						class={`flex items-center text-xs ${catalogueDataStatusConfig[registration.portraitStatus]?.color}`}>
						{#if registration.portraitStatus === "confirmed"}
							<CheckCircle2 class="h-3.5 w-3.5 mr-1" />
						{:else}
							<Info class="h-3.5 w-3.5 mr-1" />
						{/if}
						{$_("common.portrait")}
					</Tooltip.Trigger>
					<Tooltip.Content>
						{registration.portraitStatus === "confirmed"
							? "Company portrait completed"
							: "Company portrait needs to be completed"}
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</div>

		<Separator />

		<div class="space-y-2 @container/contact-people">
			<div class="flex items-center justify-between">
				<h4 class="text-sm font-medium flex items-center">
					<Users class="h-4 w-4 mr-2" />
					{$_("components.registration-card.contact-people")}
				</h4>

				<Button variant="outline" class="rounded-full px-2 py-1 text-sm font-semibold h-auto" on:click={() => {
					editContactPersonsOpen = true;
				}}>
					{#if registration.contactPeople?.length < 1}
						<Plus class="h-4 w-4 mr-1" />
						{$_("common.select")}
					{:else}
						<PenLine class="w-4 h-4 mr-1" />{$_("common.edit")}
					{/if}
				</Button>
			</div>
			{#if registration.contactPeople?.length > 0}
				<div class="grid grid-cols-1 @lg/contact-people:grid-cols-2 gap-2">
					{#each registration.contactPeople ?? [] as contact (contact.name)}
						<div class="text-sm flex items-center gap-3 rounded-full border border-muted py-1 px-1.5">
							<Avatar.Root class="w-8 h-8">
								<Avatar.Image src={contact.image} />
								<Avatar.Fallback>{contact.name?.split(" ").map(part => part[0]).join("").toUpperCase()}</Avatar.Fallback>
							</Avatar.Root>
							<div class="flex flex-col">
								<div class="font-medium">{contact.name}</div>
								<div class="text-xs text-muted-foreground">{contact.email}</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if registration.addonPackages?.length > 0}
			<Collapsible bind:open={isAddonsOpen} class="w-full">
				<div class="flex items-center justify-between">
					<h4 class="text-sm font-medium flex items-center">
						<Package class="h-4 w-4 mr-2" />
						{$_("components.registration-card.addons")}
					</h4>
					<CollapsibleTrigger class={cn(buttonVariants({size: "sm", variant: "ghost"}), "p-0 h-8 w-8")}>
						{#if isAddonsOpen}
							<ChevronDown class="h-4 w-4" />
						{:else}
							<ChevronRight class="h-4 w-4" />
						{/if}
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent class="mt-2">
					<RegistrationAddonTree addons={registration.addonPackages} />
				</CollapsibleContent>
			</Collapsible>
		{/if}
	</CardContent>
	<CardFooter class="flex justify-between border-t pt-4">
		<div class="flex items-center text-xs text-muted-foreground">
			<FileText class="h-3.5 w-3.5 mr-1" />
			{$_("components.registration-card.id")} {registration.id}
		</div>
		<div class="text-xs text-muted-foreground">
			{$_("components.registration-card.last-updated")}
			<LocalizedDate class="ml-1" date={registration.createdAt ?? registration.modifiedAt} format="relative" />
		</div>
	</CardFooter>
</Card>
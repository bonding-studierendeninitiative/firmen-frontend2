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
	import type { InferOutput } from 'valibot';
	import type { OrgEventRegistration } from '@schema';

	// Status mapping for visual indicators
	const statusConfig = {
		'changes-requested': { color: 'bg-blue-500', label: 'New' },
		created: { color: 'bg-blue-500', label: 'Created' },
		confirmed: { color: 'bg-green-500', label: 'Confirmed' },
		rejected: { color: 'bg-red-500', label: 'Rejected' },
		uploaded: { color: 'bg-yellow-500', label: 'Pending' }
	};
	const catalogueDataStatusConfig = {
		'changes-requested': { color: 'text-blue-500', label: 'New' },
		created: { color: 'text-blue-500', label: 'Created' },
		confirmed: { color: 'text-green-500', label: 'Confirmed' },
		rejected: { color: 'text-red-500', label: 'Rejected' },
		missing: { color: 'text-red-500', label: 'Rejected' },
		uploaded: { color: 'text-yellow-500', label: 'Pending' }
	};

	// Calculate the completion percentage for catalogue data
	const calculateCatalogueCompletion = (data: InferOutput<OrgEventRegistration>): number => {

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
	import { LocalizedDate, LocalizedDateRange } from '@/@svelte/components';
	import { buttonVariants, Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { type getEventRegistrationsForOrganization } from '@/services';
	import { _ } from '@services';
	import { UploadCatalogueData } from '@/@svelte/modules';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { UploadCatalogueDataForm } from '@schema';
	import { setContext } from 'svelte';

	let isAddonsOpen = false;
	export let registration: Awaited<ReturnType<typeof getEventRegistrationsForOrganization>>['eventRegistrations'][number];
	export let uploadCatalogueDataForm: SuperValidated<Infer<UploadCatalogueDataForm>>;

	setContext("uploadCatalogueDataForm", uploadCatalogueDataForm);
	let catalogueDataOpen = false;
</script>

<UploadCatalogueData bind:isOpen={catalogueDataOpen} id={registration.id} />

<Card class="w-full max-w-2xl shadow-md hover:shadow-lg transition-shadow">
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
							variant="ghost" size="sm" on:click={() => catalogueDataOpen = true}>
							{#if registration.logoStatus === "confirmed"}
								<CheckCircle2 class="h-3.5 w-3.5" />
							{:else}
								<Info class="h-3.5 w-3.5" />
							{/if}
							{$_("common.logo")}
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{registration.logoStatus === "confirmed" ? "Logo uploaded" : "Logo needs to be uploaded"}
					</Tooltip.Content>
				</Tooltip.Root>

				{#if registration.canUploadAdvertisement}
					<Tooltip.Root group="registration-card">
						<Tooltip.Trigger
							class={`flex items-center text-xs ${catalogueDataStatusConfig[registration.advertisementStatus]?.color}`}>
							{#if registration.advertisementStatus === "confirmed"}
								<CheckCircle2 class="h-3.5 w-3.5 mr-1" />
							{:else}
								<Info class="h-3.5 w-3.5 mr-1" />
							{/if}
							{$_("common.advert")}
						</Tooltip.Trigger>
						<Tooltip.Content>
							{registration.advertisementStatus === "confirmed" ? "Ad PDF uploaded" : "Ad PDF needs to be uploaded (optional)"}
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

		{#if registration.contactPeople.length > 0}
			<div class="space-y-2 @container/contact-people">
				<h4 class="text-sm font-medium flex items-center">
					<Users class="h-4 w-4 mr-2" />
					{$_("components.registration-card.contact-people")}
				</h4>
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
			</div>
		{/if}

		{#if registration.addonPackages.length > 0}
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
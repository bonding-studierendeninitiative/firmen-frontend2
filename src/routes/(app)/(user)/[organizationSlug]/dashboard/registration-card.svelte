<script lang="ts" module>
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
	const calculateCatalogueCompletion = (
		data: GetEventRegistrationForOrganizationOutput
	): number => {
		function getSingleCompletion(status: string): number {
			switch (status) {
				case 'confirmed':
					return 1.0;
				case 'missing':
					return 0;
				case 'changes-requested':
					return 0.25;
				case 'uploaded':
					return 0.5;
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
		return completed / total;
	};
</script>

<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import * as Avatar from '@/components/ui/avatar';
	import * as Tabs from '@/components/ui/tabs';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@/components/ui/card';
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
		SubmitPortraitDialog,
		ViewAdvertisementDialog,
		ViewLogoDialog
	} from '@/@svelte/modules';
	import { PickAdvertisementDialog } from '@/@svelte/modules/PickAdvertisementDialog';
	import { PenLine, Plus } from 'lucide-svelte';
	import type { GetEventRegistrationForOrganizationOutput } from '@api/client';
	import SuperDebug from 'sveltekit-superforms';
	import QueryWrappedViewLogoDialog from '@/@svelte/modules/ViewLogoDialog/QueryWrappedViewLogoDialog.svelte';
	import LogoMissing from './logo-missing.svelte';
	import AdvertMissing from './advert-missing.svelte';
	import PortraitMissing from './portrait-missing.svelte';

	let isAddonsOpen = $state(false);
	interface Props {
		registration: GetEventRegistrationForOrganizationOutput;
	}

	let { registration }: Props = $props();

	const statusConfig = {
		created: { color: 'bg-blue-500', label: $_('status-text.created') },
		confirmed: { color: 'bg-green-500', label: $_('status-text.confirmed') },
		rejected: { color: 'bg-red-500', label: $_('status-text.rejected') },
		withdrawn: { color: 'bg-gray-500', label: $_('status-text.withdrawn') }
	};

	let pickAdvertisementOpen = $state(false);
	let viewAdvertisementOpen = $state(false);
	let editContactPersonsOpen = $state(false);
	let viewLogoOpen = $state(false);
	let pickLogoOpen = $state(false);
	let submitPortraitOpen = $state(false);
</script>

<Card class="w-full max-w-2xl shadow-md hover:shadow-lg transition-shadow">
	<PickAdvertisementDialog
		bind:open={pickAdvertisementOpen}
		id={registration.id}
		orgId={registration.organizationId}
	/>
	<PickLogoDialog bind:open={pickLogoOpen} id={registration.id} orgId={registration.organizationId} />
	{#if registration.advertisement}
		<ViewAdvertisementDialog
			bind:open={viewAdvertisementOpen}
			advertisement={registration.advertisement}
		/>
	{/if}
	<EditContactPersons
		bind:open={editContactPersonsOpen}
		contactPeople={registration.contactPeople?.map(({ id }) => id)}
		eventRegistrationId={registration.id}
	/>
	{#if registration.logo?.documentId}
		<QueryWrappedViewLogoDialog
			bind:open={viewLogoOpen}
			documentId={registration.logo.documentId}
		/>
	{/if}
	<SubmitPortraitDialog id={registration.id} orgId={registration.organizationId} bind:open={submitPortraitOpen} />
	<CardHeader class="pb-2">
		<div class="flex justify-between items-start">
			<div>
				<CardTitle class="text-xl font-bold">{registration.event?.name}</CardTitle>
				<CardDescription class="mt-1">{registration.event?.location}</CardDescription>
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
				<LocalizedDateRange
					format="ll"
					hoverFormat="none"
					class="text-sm"
					dateFrom={registration.event.dateFrom}
					dateTo={registration.event.dateTo}
				/>
			</div>
			{#if registration.purchasedPackage}
				<div class="flex items-center">
					<Package class="h-4 w-4 mr-2 text-muted-foreground" />
					<span class="text-sm font-medium"
						>{$_('components.registration-card.package', {
							values: {
								package: registration.purchasedPackage.name
							}
						})}</span
					>
				</div>
			{/if}
			{#if registration.desiredEventRegistrationDayDates?.length > 0}
				<div class="flex items-center">
					<Clock class="h-4 w-4 mr-2 text-muted-foreground" />
					<span class="text-sm"
						>{$_('components.registration-card.desired-participation-days', {
							values: {
								days: registration.desiredEventRegistrationDayDates?.length
							}
						})}</span
					>
				</div>
			{/if}
		</div>

		<Separator />

		<div class="space-y-2">
			<div class="flex justify-between items-center">
				<h4 class="text-sm font-medium">{$_('components.registration-card.catalogue-data')}</h4>
				<span class="text-xs text-muted-foreground"
					>{$_('components.registration-card.catalogue-data-completion', {
						values: {
							completion: calculateCatalogueCompletion(registration)
						}
					})}</span
				>
			</div>
			<Progress value={calculateCatalogueCompletion(registration) * 100} class="h-2" />

			<div class=" mt-2">
				<Tabs.Root value="logo">
					<Tabs.List>
						<Tabs.Trigger
							class={cn(
								'flex items-center gap-1 text-xs',
								catalogueDataStatusConfig[registration.logoStatus]?.color
							)}
							value="logo"
						>
							{#if registration.logoStatus === 'confirmed'}
								<CheckCircle2 class="h-3.5 w-3.5" />
							{:else}
								<Info class="h-3.5 w-3.5" />
							{/if}
							{$_('common.logo')}
						</Tabs.Trigger>

						{#if registration.canUploadAdvertisement}
							<Tabs.Trigger
								class={cn(
									'flex items-center gap-1 text-xs',
									catalogueDataStatusConfig[registration.advertisementStatus]?.color
								)}
								value="advertisement"
							>
								{#if registration.advertisementStatus === 'confirmed'}
									<CheckCircle2 class="h-3.5 w-3.5" />
								{:else}
									<Info class="h-3.5 w-3.5" />
								{/if}
								{$_('common.advert')}
							</Tabs.Trigger>
						{/if}
						<Tabs.Trigger
							class={cn(
								'flex items-center gap-1 text-xs',
								catalogueDataStatusConfig[registration.portraitStatus]?.color
							)}
							value="portrait"
						>
							{#if registration.portraitStatus === 'confirmed'}
								<CheckCircle2 class="h-3.5 w-3.5" />
							{:else}
								<Info class="h-3.5 w-3.5" />
							{/if}
							{$_('common.portrait')}
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="logo">
						{#if registration.logoStatus !== 'missing'}
							<LogoPreview pickNewLogo={() => {
								pickLogoOpen = true
							}} logo={registration.logo} />
						{:else}
						<LogoMissing bind:pickLogoOpen />
						{/if}
					</Tabs.Content>

					{#if registration.canUploadAdvertisement}
						<Tabs.Content value="advertisement">
							{#if registration.advertisementStatus !== 'missing'}
								<AdvertisementPreview pickNewAdvertisement={() => pickAdvertisementOpen = true} advert={registration.advertisement} />
							{:else}
								<AdvertMissing {registration} />
							{/if}
						</Tabs.Content>
					{/if}
					<Tabs.Content value="portrait">
						{#if registration.portraitStatus !== 'missing'}
							<LogoPreview class="max-w-64" logo={registration.logo} />
						{:else}
							<PortraitMissing bind:submitPortraitOpen />
						{/if}
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>

		<Separator />

		<div class="space-y-2 @container/contact-people">
			<div class="flex items-center justify-between">
				<h4 class="text-sm font-medium flex items-center">
					<Users class="h-4 w-4 mr-2" />
					{$_('components.registration-card.contact-people')}
				</h4>

				<Button
					variant="outline"
					class="rounded-full px-2 py-1 text-sm font-semibold h-auto"
					onclick={() => {
						editContactPersonsOpen = true;
					}}
				>
					{#if Number(registration.contactPeople?.length) < 1}
						<Plus class="h-4 w-4 mr-1" />
						{$_('common.select')}
					{:else}
						<PenLine class="w-4 h-4 mr-1" />{$_('common.edit')}
					{/if}
				</Button>
			</div>
			{#if Number(registration.contactPeople?.length) > 0}
				<div class="grid grid-cols-1 @lg/contact-people:grid-cols-2 gap-2">
					{#each registration.contactPeople ?? [] as contact (contact.name)}
						<div
							class="text-sm flex items-center gap-3 rounded-full border border-neutral-300 bg-muted py-1 px-1.5"
						>
							<Avatar.Root class="w-8 h-8">
								<Avatar.Image src={contact.image} />
								<Avatar.Fallback
									>{contact.name
										?.split(' ')
										.map((part) => part[0])
										.join('')
										.toUpperCase()}</Avatar.Fallback
								>
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
						{$_('components.registration-card.addons')}
					</h4>
					<CollapsibleTrigger
						class={cn(buttonVariants({ size: 'sm', variant: 'ghost' }), 'p-0 h-8 w-8')}
					>
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
			{$_('components.registration-card.id')}
			{registration.id}
		</div>
		<div class="text-xs text-muted-foreground">
			{$_('components.registration-card.last-updated')}
			<LocalizedDate
				class="ml-1"
				date={registration.createdAt ?? registration.modifiedAt}
				format="relative"
			/>
		</div>
	</CardFooter>
</Card>

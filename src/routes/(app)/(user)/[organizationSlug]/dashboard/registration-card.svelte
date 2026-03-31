<script lang="ts" module>
	import { type EventRegistrationsOutput } from '@/remote/functions';
	import { tv } from 'tailwind-variants';

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
	} from '@lucide/svelte';

	interface Props {
		registration: EventRegistrationsOutput['eventRegistrations'][number];
		orgSlug?: string;
	}

	// Calculate the completion percentage for catalogue data
	function calculateCatalogueCompletion(
		data: EventRegistrationsOutput['eventRegistrations'][number]
	): number {
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
			status = [
				data.registrationDocuments?.find((d) => d.documentType === 'logo')?.status ?? '',
				data.registrationDocuments?.find((d) => d.documentType === 'advert')?.status ?? '',
				data.registrationDocuments?.find((d) => d.documentType === 'portrait')?.status ?? ''
			];
		} else {
			total = 2;
			status = [
				data.registrationDocuments?.find((d) => d.documentType === 'logo')?.status ?? '',
				data.registrationDocuments?.find((d) => d.documentType === 'portrait')?.status ?? ''
			];
		}

		const completed = status
			.map(getSingleCompletion)
			.filter(Boolean)
			.reduce((sum, current) => sum + current, 0);
		return completed / total;
	}

	const statusVariants = tv({
		variants: {
			status: {
				created: 'bg-blue-500',
				confirmed: 'bg-green-500',
				rejected: 'bg-red-500',
				withdrawn: 'bg-gray-500'
			}
		}
	});

	const catalogueDataStatusVariants = tv({
		variants: {
			status: {
				'changes-requested': 'text-blue-500',
				unreviewed: 'text-yellow-800 data-[state=active]:bg-yellow-300',
				confirmed: 'text-green-600 data-[state=active]:bg-green-500 data-[state=active]:text-white',
				rejected: 'text-red-500 data-[state=active]:bg-red-500 data-[state=active]:text-white',
				missing: 'text-red-500 data-[state=active]:bg-red-500 data-[state=active]:text-white',
				draft: 'text-yellow-500',
				submitted: ''
			}
		}
	});
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
	import * as Collapsible from '@/components/ui/collapsible';
	import RegistrationAddonTree from './registration-addon-tree.svelte';
	import { Progress } from '@/components/ui/progress';
	import { Separator } from '@/components/ui/separator';
	import { LocalizedDate, LocalizedDateRange, LogoPreview } from '@/@svelte/components';
	import { buttonVariants, Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { _ } from '@services';
	import {
		EditContactPersons,
		PickLogoDialog,
		SubmitPortraitDialog,
		ViewAdvertisementDialog
	} from '@/@svelte/modules';
	import { PickAdvertisementDialog } from '@/@svelte/modules/PickAdvertisementDialog';
	import { PenLine, Plus } from '@lucide/svelte';
	import QueryWrappedViewLogoDialog from '@/@svelte/modules/ViewLogoDialog/QueryWrappedViewLogoDialog.svelte';
	import RegistrationDocumentPreview from './registration-document-preview.svelte';
	import RegistrationDocumentMissing from './registration-document-missing.svelte';
	import { forOrganization as getEventRegistrations } from '@/remote/functions';

	let isAddonsOpen = $state(false);

	let { registration, orgSlug }: Props = $props();

	let logo = $derived(registration.registrationDocuments?.find((d) => d.documentType === 'logo'));
	let advertisement = $derived(
		registration.registrationDocuments?.find((d) => d.documentType === 'advert')
	);

	let pickAdvertisementOpen = $state(false);
	let viewAdvertisementOpen = $state(false);
	let editContactPersonsOpen = $state(false);
	let viewLogoOpen = $state(false);
	let pickLogoOpen = $state(false);
	let submitPortraitOpen = $state(false);
</script>

<Card class="w-full max-w-2xl shadow-md hover:shadow-lg transition-shadow">
	<PickAdvertisementDialog bind:open={pickAdvertisementOpen} id={registration.id ?? ''} {orgSlug} />
	<PickLogoDialog bind:open={pickLogoOpen} id={registration.id ?? ''} {orgSlug} />
	{#if advertisement}
		<ViewAdvertisementDialog bind:open={viewAdvertisementOpen} {advertisement} />
	{/if}
	<EditContactPersons
		bind:open={editContactPersonsOpen}
		contactPeople={registration.contactPeople?.map(({ id }) => id)}
		eventRegistrationId={registration.id}
	/>
	{#if logo?.documentVersion?.document?.id}
		<QueryWrappedViewLogoDialog
			bind:open={viewLogoOpen}
			documentId={logo?.documentVersion?.document.id}
		/>
	{/if}
	<SubmitPortraitDialog
		id={registration.id ?? ''}
		orgId={registration.organizationId ?? ''}
		bind:open={submitPortraitOpen}
		onSubmitPortrait={async ({ submit }) => {
			await submit().updates(
				getEventRegistrations({
					orgId: registration.organizationId ?? '',
					cursor: 0,
					limit: 10
				}).withOverride((prev) => {
					return {
						...prev,
						eventRegistrations: (prev.eventRegistrations ?? []).map((er) =>
							er.id === registration.id ? { ...er, portraitStatus: 'submitted' } : er
						)
					};
				})
			);
			submitPortraitOpen = false;
		}}
	/>
	<CardHeader class="pb-2">
		<div class="flex justify-between items-start">
			<div>
				<CardTitle class="text-xl font-bold">{registration.event?.name}</CardTitle>
				<CardDescription class="mt-1">{registration.event?.location}</CardDescription>
			</div>
			<Badge class={cn(statusVariants({ status: registration.status }), 'text-white')}>
				{$_(`status-text.${registration.status}`)}
			</Badge>
		</div>
	</CardHeader>
	<CardContent class="space-y-4">
		<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
			<div class="flex items-center">
				<Calendar class="size-4 mr-2 text-muted-foreground" />
				{#if registration.event?.dateFrom}
					{#if registration.event?.dateTo}
						<LocalizedDateRange
							format="ll"
							hoverFormat="none"
							class="text-sm"
							dateFrom={registration.event.dateFrom}
							dateTo={registration.event.dateTo}
						/>
					{:else}
						<LocalizedDate
							format="ll"
							hoverFormat="none"
							class="text-sm"
							date={registration.event.dateFrom}
						/>
					{/if}
				{/if}
			</div>
			{#if registration.purchasedPackage}
				<div class="flex items-center">
					<Package class="size-4 mr-2 text-muted-foreground" />
					<span class="text-sm font-medium"
						>{$_('components.registration-card.package', {
							values: {
								package: registration.purchasedPackage.name
							}
						})}</span
					>
				</div>
			{/if}
			{#if Number(registration.desiredEventRegistrationDayDates?.length) > 0}
				<div class="flex items-center">
					<Clock class="size-4 mr-2 text-muted-foreground" />
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
								catalogueDataStatusVariants({ status: logo?.status ?? 'missing' })
							)}
							value="logo"
						>
							{#if logo?.status === 'confirmed'}
								<CheckCircle2 class="size-3.5" />
							{:else}
								<Info class="size-3.5" />
							{/if}
							{$_('common.logo')}
						</Tabs.Trigger>

						{#if registration.canUploadAdvertisement}
							<Tabs.Trigger
								class={cn(
									'flex items-center gap-1 text-xs',
									catalogueDataStatusVariants({ status: advertisement?.status ?? 'missing' })
								)}
								value="advertisement"
							>
								{#if advertisement?.status === 'confirmed'}
									<CheckCircle2 class="size-3.5" />
								{:else}
									<Info class="size-3.5" />
								{/if}
								{$_('common.advert')}
							</Tabs.Trigger>
						{/if}
						<Tabs.Trigger
							class={cn(
								'flex items-center gap-1 text-xs',
								catalogueDataStatusVariants({ status: registration.portraitStatus ?? 'missing' })
							)}
							value="portrait"
						>
							{#if registration.portraitStatus === 'confirmed'}
								<CheckCircle2 class="size-3.5" />
							{:else}
								<Info class="size-3.5" />
							{/if}
							{$_('common.portrait')}
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content class="@container/preview" value="logo">
						{#if logo}
							<RegistrationDocumentPreview
								pickNewDocument={() => {
									pickLogoOpen = true;
								}}
								registrationDocument={logo}
							/>
						{:else}
							<RegistrationDocumentMissing
								documentType="logo"
								pickNewDocument={() => (pickLogoOpen = true)}
							/>
						{/if}
					</Tabs.Content>

					{#if registration.canUploadAdvertisement}
						<Tabs.Content class="@container/preview" value="advertisement">
							{#if advertisement}
								<RegistrationDocumentPreview
									pickNewDocument={() => (pickAdvertisementOpen = true)}
									registrationDocument={advertisement}
								/>
							{:else}
								<RegistrationDocumentMissing
									documentType="advert"
									pickNewDocument={() => (pickAdvertisementOpen = true)}
								/>
							{/if}
						</Tabs.Content>
					{/if}
					<Tabs.Content value="portrait">
						{#if registration.portraitStatus !== 'missing'}
							<!-- TODO: Portrait preview -->
							<LogoPreview class="max-w-64" {logo} />
						{:else}
							<RegistrationDocumentMissing
								documentType="portrait"
								pickNewDocument={() => (submitPortraitOpen = true)}
							/>
						{/if}
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>

		<Separator />

		<div class="space-y-2 @container/contact-people">
			<div class="flex items-center justify-between">
				<h4 class="text-sm font-medium flex items-center">
					<Users class="size-4 mr-2" />
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
						<Plus class="size-4 mr-1" />
						{$_('common.select')}
					{:else}
						<PenLine class="size-4 mr-1" />{$_('common.edit')}
					{/if}
				</Button>
			</div>
			{#if Number(registration.contactPeople?.length) > 0}
				<div class="grid grid-cols-1 @lg/contact-people:grid-cols-2 gap-2">
					{#each registration.contactPeople ?? [] as contact (contact.name)}
						<div
							class="text-sm flex items-center gap-3 rounded-full border border-border bg-muted py-1 px-1.5"
						>
							<Avatar.Root class="size-8">
								<Avatar.Image src={`/api/avatar/${contact.id}.svg`} />
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

		{#if Number(registration.addonPackages?.length) > 0}
			<Collapsible.Root bind:open={isAddonsOpen} class="w-full">
				<div class="flex items-center justify-between">
					<h4 class="text-sm font-medium flex items-center">
						<Package class="size-4 mr-2" />
						{$_('components.registration-card.addons')}
					</h4>
					<Collapsible.Trigger
						class={cn(buttonVariants({ size: 'sm', variant: 'ghost' }), 'p-0 size-8')}
					>
						{#if isAddonsOpen}
							<ChevronDown class="size-4" />
						{:else}
							<ChevronRight class="size-4" />
						{/if}
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content class="mt-2">
					<RegistrationAddonTree addons={registration.addonPackages} />
				</Collapsible.Content>
			</Collapsible.Root>
		{/if}
	</CardContent>
	<CardFooter class="flex justify-between border-t pt-4">
		<div class="flex items-center text-xs text-muted-foreground">
			<FileText class="size-3.5 mr-1" />
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

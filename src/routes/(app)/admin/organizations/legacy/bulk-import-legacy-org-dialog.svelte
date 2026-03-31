<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import { Building, Check } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { Label } from '@/components/ui/label';
	import { Badge } from '@/components/ui/badge';
	import { getLegacyOrgsByNotesIds, importLegacyOrg } from '@/remote/functions/admin';
	import * as Select from '@/components/ui/select';

	let { open = $bindable(false) }: { open: boolean } = $props();

	let step = $state<'upload' | 'columnSelection' | 'review' | 'importing'>('upload');
	let csvHeaders = $state<string[]>([]);
	let csvRows = $state<string[][]>([]);
	let selectedColumnIndex = $state<string | undefined>(undefined);
	let recognizedOrgs = $state<
		{
			id: string;
			name: string;
		}[]
	>([]);
	let importingProgress = $state(0);

	let contactPeople: string[] = $state([]);
	let adminContactPerson: string | null = $state(null);

	async function handleFileUpload(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = async (event) => {
				const text = event.target?.result;
				if (typeof text === 'string') {
					const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
					if (lines.length > 0) {
						csvHeaders = lines[0].split(',').map((h) => h.trim());
						csvRows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim()));
						step = 'columnSelection';
					}
				}
			};
			reader.readAsText(file);
		}
	}

	function isFulfilled<T>(promiseResult: PromiseSettledResult<T>): promiseResult is PromiseFulfilledResult<T> {
		return promiseResult.status === 'fulfilled';
	}

	async function fetchOrgDetails() {
		if (selectedColumnIndex === undefined) return;
		const idx = parseInt(selectedColumnIndex);
		const ids = Array.from(new Set(csvRows.map((row) => row[idx]).filter((id) => id)));
		try {
			Promise.allSettled(ids.map((id) => getLegacyOrgsByNotesIds(id))).then((orgs) => {
				if (orgs.length > 0 && orgs.every((org) => org !== null)) {
					toast.success(`Details für ${orgs.length} Organisationen abgerufen`);
					recognizedOrgs = orgs
						.map((org) => {
							if (isFulfilled(org) && org.value !== null) {
								return {
									id: org.value?.notesId,
									name: org.value?.name
								};
							} else {
								return false;
							}
						})
						.filter(Boolean);
				} else {
					toast.error(
						'Keine Organisationen erkannt. Bitte überprüfe die ausgewählte Spalte und die CSV-Datei.'
					);
				}
			});
			step = 'review';
		} catch (error) {
			toast.error('Fehler beim Abrufen der Organisationsdetails');
		}
	}

	let missingOrgs = $derived.by(() => {
		if (selectedColumnIndex === undefined) return [];
		const idx = parseInt(selectedColumnIndex);
		const ids = Array.from(new Set(csvRows.map((row) => row[idx]).filter((id) => id)));
		const foundIds = new Set(
			recognizedOrgs
				.filter((org) => org !== null && org !== undefined && org.id)
				.map((org) => org.id)
		);
		return ids.filter((id) => !foundIds.has(id));
	});

	async function bulkImport() {
		step = 'importing';
		importingProgress = 0;
		let successCount = 0;
		let errorCount = 0;

		for (const org of recognizedOrgs) {
			try {
				await importLegacyOrg({
					legacyOrgId: org.id,
					request: {
						adminContactPerson: adminContactPerson !== null ? adminContactPerson : undefined,
						contactPeople,
						organizationName: org.name
					}
				});
				successCount++;
			} catch (error) {
				errorCount++;
			}
			importingProgress++;
		}

		if (errorCount === 0) {
			toast.success(`${successCount} Organisationen erfolgreich importiert`);
		} else {
			toast.info(`${successCount} erfolgreich, ${errorCount} fehlgeschlagen`);
		}
		open = false;
		step = 'upload';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-full max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.admin-bulk-import-legacy-org.title')}</Dialog.Title>
			<Dialog.Description
				>{$_('modules.admin-bulk-import-legacy-org.description')}</Dialog.Description
			>
		</Dialog.Header>
		<div class="space-y-4 w-full max-h-[70dvh] overflow-y-auto pr-2">
			{#if step === 'upload'}
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Building class="size-5 mr-2" />
							{$_('modules.admin-import-legacy-org.org-card-header')}
						</Card.Title>
						<Card.Description>
							{$_('modules.admin-bulk-import-legacy-org.org-card-description')}
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4 pt-6">
						<div class="grid w-full max-w-sm items-center gap-1.5">
							<Label for="csv-upload">CSV Datei auswählen</Label>
							<input
								id="csv-upload"
								type="file"
								accept=".csv,text/csv"
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								onchange={handleFileUpload}
							/>
						</div>
					</Card.Content>
				</Card.Root>
			{:else if step === 'columnSelection'}
				<Card.Root>
					<Card.Header>
						<Card.Title>Spalte auswählen</Card.Title>
						<Card.Description>
							Wählen Sie die Spalte aus, die die IDs (Legacy Org IDs) enthält.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid gap-2">
							<Label>ID Spalte</Label>
							<Select.Root type="single" bind:value={selectedColumnIndex}>
								<Select.Trigger>
									{selectedColumnIndex !== undefined
										? csvHeaders[parseInt(selectedColumnIndex)]
										: 'Spalte auswählen...'}
								</Select.Trigger>
								<Select.Content>
									{#each csvHeaders as header, i}
										<Select.Item value={i.toString()} label={header}>{header}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div class="rounded-md border p-4 bg-muted/50">
							<p class="text-xs font-semibold uppercase text-muted-foreground mb-2">
								Vorschau (Erste Zeile)
							</p>
							<div class="grid grid-cols-2 gap-2 text-sm">
								{#each csvHeaders as header, i}
									<div class="font-medium text-muted-foreground">{header}:</div>
									<div class="truncate">{csvRows[0][i] || '-'}</div>
								{/each}
							</div>
						</div>
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button variant="outline" onclick={() => (step = 'upload')}>Zurück</Button>
						<Button disabled={selectedColumnIndex === undefined} onclick={fetchOrgDetails}
							>Weiter</Button
						>
					</Card.Footer>
				</Card.Root>
			{:else if step === 'review'}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-base flex items-center justify-between">
								<span>Erkannt</span>
								<Badge variant="outline">{recognizedOrgs.length}</Badge>
							</Card.Title>
						</Card.Header>
						<Card.Content class="max-h-[40dvh] overflow-y-auto">
							<div class="space-y-2">
								{#each recognizedOrgs as org}
									<div class="flex items-center justify-between p-2 border rounded-md text-xs">
										<div class="flex flex-col truncate">
											<span class="font-medium truncate">{org?.name}</span>
											<span class="text-muted-foreground">ID: {org?.id}</span>
										</div>
										<Check class="size-3 text-green-500 shrink-0" />
									</div>
								{:else}
									<p class="text-center text-muted-foreground py-4 text-xs">Keine erkannt.</p>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title class="text-base flex items-center justify-between">
								<span>Nicht gefunden</span>
								<Badge variant="destructive">{missingOrgs.length}</Badge>
							</Card.Title>
						</Card.Header>
						<Card.Content class="max-h-[40dvh] overflow-y-auto">
							<div class="space-y-2">
								{#each missingOrgs as id}
									<div
										class="flex items-center justify-between p-2 border rounded-md text-xs bg-destructive/10"
									>
										<span class="font-medium truncate">{id}</span>
									</div>
								{:else}
									<p class="text-center text-muted-foreground py-4 text-xs">Alles gefunden!</p>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			{:else if step === 'importing'}
				<Card.Root>
					<Card.Header>
						<Card.Title>Importvorgang</Card.Title>
						<Card.Description>Organisationen werden importiert...</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="w-full bg-secondary h-2 rounded-full overflow-hidden">
							<div
								class="bg-primary h-full transition-all"
								style="width: {(importingProgress / recognizedOrgs.length) * 100}%"
							></div>
						</div>
						<p class="text-center text-sm font-medium">
							{importingProgress} / {recognizedOrgs.length}
						</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
		<Dialog.Footer class="flex justify-between items-center sm:justify-between w-full">
			{#if step === 'review'}
				<Button variant="outline" onclick={() => (step = 'columnSelection')}>Zurück</Button>
				<Button disabled={recognizedOrgs.length === 0} onclick={bulkImport}>
					{recognizedOrgs.length} Organisationen importieren
				</Button>
			{:else if step === 'upload'}
				<div></div>
				<Button variant="outline" onclick={() => (open = false)}>Abbrechen</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

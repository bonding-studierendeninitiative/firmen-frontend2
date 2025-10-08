<script lang="ts">
	import { _, number } from '@services';
	import { Plus, Trash2, Save, Eye, ArrowUp, ArrowDown, Calendar } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
	import { Label } from '@/components/ui/label';
	import { Switch } from '@/components/ui/switch';
	import { Textarea } from '@/components/ui/textarea';
	import { Progress } from '@/components/ui/progress';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/components/ui/table';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogClose
	} from '@/components/ui/dialog';
	import { ValueType } from '@schema';
	import { BuyOptionPreview } from '@/@svelte/modules';
	import { cn } from '@/utils';
	import { LocalizedDate } from '@/@svelte/components';
	import type { UpdateEventBuyOptionInput } from '@api/admin-client';
	import { updateBuyOption } from '@/remote/functions/admin';
	import { toast } from 'svelte-sonner';
	import SuperDebug from 'sveltekit-superforms';

	interface Props {
		eventId: string;
		buyOptionId: string;
		data: UpdateEventBuyOptionInput;
	}

	let { data, buyOptionId, eventId }: Props = $props();

	if (data) {
		updateBuyOption.fields.data.set(data);
	}

	type Service = Exclude<UpdateEventBuyOptionInput['services'], undefined>[number];
	type Package = Exclude<UpdateEventBuyOptionInput['packages'], undefined>[number];
	type PackageBenefit = Exclude<
		UpdateEventBuyOptionInput['packages'],
		undefined
	>[number]['benefits'][number];
	type EventDay = Exclude<UpdateEventBuyOptionInput['eventDays'], undefined>[number];

	// Reactive variables (equivalent to React's useState)
	let activeTab = $state('editor');

	function handleCreateEventDay(e: Event) {
		e.preventDefault();
		updateBuyOption.fields.data.eventDays.set([
			...(updateBuyOption.fields.data.eventDays.value() ?? []),
			{
				dayDate: new Date().toISOString().split('T')[0] ?? '2025-01-01',
				totalCapacity: 0,
				remainingCapacity: 0
			}
		]);
	}

	function handleDeleteEventDay(e: Event, dayIndex: number) {
		e.preventDefault();
		updateBuyOption.fields.data.eventDays.set([
			...(updateBuyOption.fields.data.eventDays.value()?.slice(0, dayIndex) ?? []),
			...(updateBuyOption.fields.data.eventDays.value()?.slice(dayIndex + 1) ?? [])
		]);
	}

	// Service management
	function addService(): void {
		const newService: Service = {
			name: 'New Service',
			description: 'Description of the service',
			valueType: ValueType.Boolean
		};

		updateBuyOption.fields.data.set({
			...updateBuyOption.fields.data.value(),
			services: [...(updateBuyOption.fields.data.services.value() ?? []), newService],
			packages: updateBuyOption.fields.data.packages.value()?.map((pkg) => ({
				...pkg,
				benefits: [...pkg.benefits, {}]
			}))
		});
	}

	function removeService(serviceIndex: number): void {
		updateBuyOption.fields.data.set({
			...updateBuyOption.fields.data.value(),
			services: updateBuyOption.fields.data.services
				.value()
				?.filter((service, index) => index !== serviceIndex),
			packages: updateBuyOption.fields.data.packages.value()?.map((pkg) => ({
				...pkg,
				benefits: pkg.benefits.filter((value, index) => index !== serviceIndex)
			}))
		});
	}

	function moveService(serviceIndex: number, direction: 'up' | 'down'): void {
		if (
			(direction === 'up' && serviceIndex === 0) ||
			(direction === 'down' &&
				serviceIndex === Number(updateBuyOption.fields.data.services.value()?.length) - 1)
		) {
			return;
		}

		const newIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;
		const newServices = [...(updateBuyOption.fields.data.services.value() ?? [])];
		const [movedService] = newServices.splice(serviceIndex, 1);
		newServices.splice(newIndex, 0, movedService);

		updateBuyOption.fields.data.set({
			...updateBuyOption.fields.data.value(),
			services: newServices
		});
	}

	// Package management
	function addPackage(): void {
		const newPackage: Package = {
			name: 'New Package',
			price: 0,
			benefits: updateBuyOption.fields.data.services.value()?.map(() => ({})) ?? []
		};

		updateBuyOption.fields.data.packages.set([
			...(updateBuyOption.fields.data.packages.value() ?? []),
			newPackage
		]);
	}

	// Calculate capacity percentage
	function calculateCapacityPercentage(day: EventDay): number {
		return Math.round(
			((Number(day.totalCapacity) - Number(day.remainingCapacity)) / Number(day.totalCapacity)) *
				100
		);
	}

	function removePackage(packageIndex: number): void {
		console.log('Removing package at index:', packageIndex);
		let packages = updateBuyOption.fields.data.packages;
		let newPackages = packages.value()?.filter((pkg, index) => index !== packageIndex);
		console.log('New packages after removal:', newPackages);
		packages.set(newPackages);
	}

	function movePackage(packageIndex: number, direction: 'left' | 'right'): void {
		if (
			(direction === 'left' && packageIndex === 0) ||
			(direction === 'right' &&
				packageIndex === Number(updateBuyOption.fields.data.packages.value()?.length) - 1)
		) {
			return;
		}

		const newIndex = direction === 'left' ? packageIndex - 1 : packageIndex + 1;
		const newPackages = [...(updateBuyOption.fields.data.packages.value() ?? [])];
		const [movedPackage] = newPackages.splice(packageIndex, 1);
		newPackages.splice(newIndex, 0, movedPackage);

		updateBuyOption.fields.data.set({
			...updateBuyOption.fields.data.value(),
			packages: newPackages
		});
	}
</script>

<form {...updateBuyOption} class="space-y-6 pb-6">
	<div class="flex justify-between items-center">
		<div>
			<h2 class="text-2xl font-semibold">{$_('components.editBuyOptions.buyOptionEditor')}</h2>
			<p class="text-muted-foreground">{$_('components.editBuyOptions.editorDescription')}</p>
		</div>
		<div class="flex gap-2">
			<Button type="submit">
				<Save class="mr-2 size-4" />
				{$_('components.editBuyOptions.saveBuyOption')}
			</Button>
		</div>
	</div>

	{#each updateBuyOption.fields.allIssues() ?? [] as issue}
		<div class="text-red-500 text-sm">{issue.message}</div>
	{/each}

	<SuperDebug data={updateBuyOption.fields.value()} />

	<Tabs
		value={activeTab}
		onValueChange={(value) => {
			if (value) activeTab = value;
		}}
		class="space-y-4"
	>
		<TabsList>
			<TabsTrigger value="editor">{$_('components.editBuyOptions.editor')}</TabsTrigger>
			<TabsTrigger value="preview">{$_('components.editBuyOptions.preview')}</TabsTrigger>
		</TabsList>

		<TabsContent value="editor" class="space-y-6">
			<input {...updateBuyOption.fields.buyOptionId.as('hidden', buyOptionId)} />
			<input {...updateBuyOption.fields.eventId.as('hidden', eventId)} />
			<Card>
				<CardHeader>
					<CardTitle>{$_('components.editBuyOptions.generalInformation')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="grid gap-4">
						<div class="grid gap-2">
							<Label for="buyOptionName">{$_('components.editBuyOptions.buyOptionName')}</Label>
							<Input id="buyOptionName" {...updateBuyOption.fields.data.name.as('text')} />
						</div>
					</div>
					<section class="py-4 space-y-4">
						<div class="flex flex-nowrap justify-between gap-4 items-center">
							<h3 class="font-semibold text-lg grow">
								{$_('components.editBuyOptions.eventDays.header')}
							</h3>
							<Button onclick={handleCreateEventDay}>
								<Plus class="mr-2 size-4" />
								Add event day
							</Button>
						</div>
						<div class="space-y-4">
							{#if updateBuyOption.fields.data.eventDays.value()?.length === 0}
								<div class="text-center py-4 text-muted-foreground">
									No event days added yet. Add days to allow organizations to select their preferred
									participation day.
								</div>
							{:else}
								<div class="grid gap-4">
									{#each updateBuyOption.fields.data.eventDays.value() ?? [] as day, index}
										<div class="flex items-center justify-between p-4 border rounded-md">
											<div class="flex-1">
												<div class="flex items-center gap-2">
													<Calendar class="size-5 text-muted-foreground" />
													<LocalizedDate format="dddd, LL" date={day.dayDate} />
												</div>
												<div class="mt-2 space-y-1">
													<div class="flex justify-between text-sm">
														<span>Capacity: {day.totalCapacity} spots</span>
														<span class="text-muted-foreground"
															>{day.remainingCapacity} remaining</span
														>
													</div>
													<Progress value={calculateCapacityPercentage(day)} class="h-2" />
												</div>
											</div>
											<div class="flex gap-2 ml-4">
												<Dialog>
													<DialogTrigger
														class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
														type="button"
													>
														<Eye class="size-4" />
													</DialogTrigger>
													<DialogContent class="sm:max-w-[500px]">
														<DialogHeader>
															<DialogTitle>Edit Event Day</DialogTitle>
															<DialogDescription
																>Configure the event day details and capacity.</DialogDescription
															>
														</DialogHeader>
														<div class="grid gap-4 py-4">
															<div class="grid gap-2">
																<Label for="eventDate">Event Date</Label>
																<Input
																	id="eventDate"
																	{...updateBuyOption.fields.data.eventDays[index].dayDate.as(
																		'date'
																	)}
																	bind:value={
																		updateBuyOption.fields.data.eventDays[index].dayDate.value,
																		updateBuyOption.fields.data.eventDays[index].dayDate.set
																	}
																/>
															</div>
															<div class="grid gap-2">
																<Label for="totalCapacity">Total Capacity</Label>
																<Input
																	id="totalCapacity"
																	{...updateBuyOption.fields.data.eventDays[index].totalCapacity.as(
																		'number'
																	)}
																	bind:value={
																		updateBuyOption.fields.data.eventDays[index].totalCapacity
																			.value,
																		updateBuyOption.fields.data.eventDays[index].totalCapacity.set
																	}
																/>
																<p class="text-sm text-muted-foreground">
																	Maximum number of organizations that can participate on this day
																</p>
															</div>
															<div class="grid gap-2">
																<Label for="remainingCapacity">Remaining Capacity</Label>
																<Input
																	id="remainingCapacity"
																	max={updateBuyOption.fields.data.eventDays[
																		index
																	].totalCapacity.value()}
																	{...updateBuyOption.fields.data.eventDays[
																		index
																	].remainingCapacity.as('number')}
																	bind:value={
																		updateBuyOption.fields.data.eventDays[index].remainingCapacity
																			.value,
																		updateBuyOption.fields.data.eventDays[index].remainingCapacity
																			.set
																	}
																/>
																<p class="text-sm text-muted-foreground">
																	Number of spots still available for booking
																</p>
															</div>
															<div class="mt-2">
																<div class="text-sm mb-2">Capacity Usage</div>
																<Progress
																	value={calculateCapacityPercentage(
																		updateBuyOption.fields.data.eventDays[index].value()
																	)}
																	class="h-2"
																/>
																<div class="flex justify-between text-sm mt-1">
																	<span
																		>{Number(
																			updateBuyOption.fields.data.eventDays[
																				index
																			].totalCapacity.value()
																		) -
																			Number(
																				updateBuyOption.fields.data.eventDays[
																					index
																				].remainingCapacity.value()
																			)}
																		booked</span
																	>
																	<span class="text-muted-foreground"
																		>{updateBuyOption.fields.data.eventDays[
																			index
																		].remainingCapacity.value()}
																		remaining</span
																	>
																</div>
															</div>
														</div>
														<DialogFooter>
															<DialogClose class={buttonVariants({ variant: 'outline' })}>
																{$_('common.confirm')}
															</DialogClose>
														</DialogFooter>
													</DialogContent>
												</Dialog>
												<Button
													variant="ghost"
													size="icon"
													onclick={(e) => handleDeleteEventDay(e, index)}
												>
													<Trash2 class="size-4 text-destructive" />
												</Button>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</section>
					{#if Number(updateBuyOption.fields.data.eventDays.value()?.length) > 1}
						<section class="py-4 space-y-4">
							<h3 class="font-semibold text-lg grow">
								{$_('components.editBuyOptions.eventDays.signUpDays.header')}
							</h3>
							<Tabs
								bind:value={
									() => updateBuyOption.fields.data.allowedSignUpDays.value().toString(),
									(a) => updateBuyOption.fields.data.allowedSignUpDays.set(a ? Number(a) : 0)
								}
							>
								<TabsList>
									{#each updateBuyOption.fields.data.eventDays.value() ?? [] as _someDay, dayIndex}
										<TabsTrigger value={(dayIndex + 1).toString()}
											>{$_('components.editBuyOptions.eventDays.signUpDays.days', {
												values: { days: (dayIndex + 1).toString() }
											})}</TabsTrigger
										>
									{/each}
								</TabsList>
							</Tabs>
						</section>
					{/if}
				</CardContent>
			</Card>

			<div class="grid md:grid-cols-2 gap-6">
				<!-- Services Management -->
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle>{$_('components.editBuyOptions.services')}</CardTitle>
						<Button size="sm" onclick={addService}>
							<Plus class="mr-2 size-4" />
							{$_('components.editBuyOptions.addService')}
						</Button>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							{#each updateBuyOption.fields.data.services.value() ?? [] as service, index}
								<div class="flex items-center justify-between p-2 border rounded-md">
									<div>
										<p class="font-medium">{service.name}</p>
										<p class="text-sm text-muted-foreground">{service.valueType.valueOf()}</p>
									</div>
									<div class="flex gap-1">
										<Button variant="ghost" size="icon" onclick={() => moveService(index, 'up')}>
											<ArrowUp class="size-4" />
										</Button>
										<Button variant="ghost" size="icon" onclick={() => moveService(index, 'down')}>
											<ArrowDown class="size-4" />
										</Button>
										<Dialog>
											<DialogTrigger
												class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
												type="button"
											>
												<Eye class="size-4" />
											</DialogTrigger>
											<DialogContent class="sm:max-w-[500px]">
												<DialogHeader>
													<DialogTitle>{$_('components.editBuyOptions.editService')}</DialogTitle>
													<DialogDescription
														>{$_('components.editBuyOptions.serviceDescription')}</DialogDescription
													>
												</DialogHeader>
												<div class="grid gap-4 py-4">
													<div class="grid gap-2">
														<Label for="serviceName"
															>{$_('components.editBuyOptions.serviceName')}</Label
														>
														<Input
															id="serviceName"
															{...updateBuyOption.fields.data.services[index].name.as('text')}
															bind:value={
																updateBuyOption.fields.data.services[index].name.value,
																updateBuyOption.fields.data.services[index].name.set
															}
														/>
													</div>
													<div class="grid gap-2">
														<Label for="serviceDescription"
															>{$_('components.editBuyOptions.serviceDescription')}</Label
														>
														<Textarea
															id="serviceDescription"
															{...updateBuyOption.fields.data.services[index].description.as(
																'text'
															)}
															bind:value={
																updateBuyOption.fields.data.services[index].description.value,
																updateBuyOption.fields.data.services[index].description.set
															}
														/>
													</div>
													<div>
														<Label>{$_('components.editBuyOptions.type')}</Label>
														<DropdownMenu.Root>
															<DropdownMenu.Trigger>
																{#snippet child({ props })}
																	<Button class="my-2! p-2" variant="outline" {...props}>
																		{#if updateBuyOption.fields.data.services?.[index].valueType.value() === 'STRING'}
																			Textfeld für generische Werte
																		{:else if updateBuyOption.fields.data.services?.[index].valueType.value() === 'BOOLEAN'}
																			Enthalten (ja/nein)
																		{:else if updateBuyOption.fields.data.services?.[index].valueType.value() === 'INTEGER'}
																			Anzahl (z. B. 2 Stühle)
																		{/if}
																	</Button>
																{/snippet}
															</DropdownMenu.Trigger>
															<DropdownMenu.Content>
																<DropdownMenu.RadioGroup
																	bind:value={
																		updateBuyOption.fields.data.services[index].valueType.value,
																		updateBuyOption.fields.data.services[index].valueType.set
																	}
																>
																	<DropdownMenu.RadioItem value="STRING"
																		>{$_(
																			'components.editBuyOptions.typeText'
																		)}</DropdownMenu.RadioItem
																	>
																	<DropdownMenu.RadioItem value="BOOLEAN"
																		>{$_(
																			'components.editBuyOptions.typeBoolean'
																		)}</DropdownMenu.RadioItem
																	>
																	<DropdownMenu.RadioItem value="INTEGER"
																		>{$_(
																			'components.editBuyOptions.typeNumeric'
																		)}</DropdownMenu.RadioItem
																	>
																</DropdownMenu.RadioGroup>
															</DropdownMenu.Content>
														</DropdownMenu.Root>
													</div>
												</div>
												<DialogFooter>
													<DialogClose class={buttonVariants({ variant: 'outline' })}
														>{$_('common.confirm')}</DialogClose
													>
												</DialogFooter>
											</DialogContent>
										</Dialog>

										<Button variant="ghost" size="icon" onclick={() => removeService(index)}>
											<Trash2 class="size-4 text-destructive" />
										</Button>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>

				<!-- Packages Management -->
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle>{$_('components.editBuyOptions.packages')}</CardTitle>
						<Button size="sm" onclick={addPackage}>
							<Plus class="mr-2 size-4" />
							{$_('components.editBuyOptions.addPackage')}
						</Button>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							{#each updateBuyOption.fields.data.packages.value() ?? [] as pkg, index}
								<div class="flex items-center justify-between p-2 border rounded-md">
									<div>
										<p class="font-medium">{pkg.name}</p>
										<p class="text-sm text-muted-foreground">
											{$number((pkg.price ?? 0) / 100, {
												style: 'currency',
												currency: 'EUR',
												currencyDisplay: 'code'
											})}
										</p>
									</div>
									<div class="flex gap-1">
										<Button variant="ghost" size="icon" onclick={() => movePackage(index, 'left')}>
											<ArrowUp class="size-4" />
										</Button>
										<Button variant="ghost" size="icon" onclick={() => movePackage(index, 'right')}>
											<ArrowDown class="size-4" />
										</Button>
										<Dialog>
											<DialogTrigger
												class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
												type="button"
											>
												<Eye class="size-4" />
											</DialogTrigger>
											<DialogContent class="sm:max-w-[500px]">
												<DialogHeader>
													<DialogTitle>{$_('components.editBuyOptions.editPackage')}</DialogTitle>
													<DialogDescription
														>{$_(
															'components.editBuyOptions.editPackageDescription'
														)}</DialogDescription
													>
												</DialogHeader>
												<div class="grid gap-4 py-4">
													<div class="grid gap-2">
														<Label for="packageName"
															>{$_('components.editBuyOptions.packageName')}</Label
														>
														<Input
															id="packageName"
															{...updateBuyOption.fields.data.packages[index].name.as('text')}
															bind:value={
																updateBuyOption.fields.data.packages[index].name.value,
																updateBuyOption.fields.data.packages[index].name.set
															}
														/>
													</div>
													<div class="grid gap-2">
														<Label for="packagePrice"
															>{$_('components.editBuyOptions.packagePrice')}</Label
														>
														<Input
															id="packagePrice"
															{...updateBuyOption.fields.data.packages[index].price.as('number')}
															bind:value={
																updateBuyOption.fields.data.packages[index].price.value,
																updateBuyOption.fields.data.packages[index].price.set
															}
														/>
													</div>
												</div>
												<DialogFooter>
													<DialogClose class={buttonVariants({ variant: 'outline' })}
														>{$_('common.confirm')}</DialogClose
													>
												</DialogFooter>
											</DialogContent>
										</Dialog>
										<Button variant="ghost" size="icon" onclick={() => removePackage(index)}>
											<Trash2 class="size-4 text-destructive" />
										</Button>
									</div>
								</div>
							{/each}
							{#each updateBuyOption.fields.data.packages.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Package Values Matrix -->
			<Card>
				<CardHeader>
					<CardTitle>{$_('components.editBuyOptions.packageBenefitConfiguration')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead class="w-[200px]">{$_('components.editBuyOptions.service')}</TableHead>
									<TableHead class="w-[150px]">{$_('components.editBuyOptions.type')}</TableHead>
									{#each updateBuyOption.fields.data.packages.value() ?? [] as pkg, index}
										<TableHead class="text-center">
											{pkg.name} ({$number((pkg.price ?? 0) / 100, {
												style: 'currency',
												currency: 'EUR',
												currencyDisplay: 'code'
											})})
										</TableHead>
									{/each}
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each updateBuyOption.fields.data.services.value() ?? [] as service, serviceIndex}
									<TableRow>
										<TableCell class="font-medium">{service.name}</TableCell>
										<TableCell>{service.valueType}</TableCell>
										{#each updateBuyOption.fields.data.packages.value() ?? [] as _pkg, index}
											{@const benefit =
												updateBuyOption.fields.data.packages.value()?.[index].benefits[
													serviceIndex
												] ?? ({} as PackageBenefit)}
											<TableCell>
												{#if service.valueType === ValueType.Boolean}
													<div class="flex justify-center">
														<Switch
															bind:checked={
																() => benefit.booleanValue ?? false,
																(value) =>
																	updateBuyOption.fields.data.packages[index].benefits[
																		serviceIndex
																	].set({
																		...benefit,
																		booleanValue: value
																	})
															}
														/>
													</div>
												{:else if service.valueType === ValueType.Integer}
													<Input
														{...updateBuyOption.fields.data.packages[index].benefits[
															serviceIndex
														].numericValue.as('number')}
														class="w-20 mx-auto"
													/>
												{:else}
													<Input
														{...updateBuyOption.fields.data.packages[index].benefits[
															serviceIndex
														].stringValue.as('text')}
														class="w-full"
													/>
												{/if}
											</TableCell>
										{/each}
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="preview" class="px-6 border border-dashed rounded-md">
			<BuyOptionPreview buyOption={updateBuyOption.fields.data.value()} />
		</TabsContent>
	</Tabs>
</form>

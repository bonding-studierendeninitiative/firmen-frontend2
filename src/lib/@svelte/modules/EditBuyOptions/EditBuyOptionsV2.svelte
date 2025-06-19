<script lang="ts">
	import { _, number } from '@services';
	import { Plus, Trash2, Save, Eye, ArrowUp, ArrowDown, Calendar } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
	import { Field, Control, Label as FormLabel } from '@/components/ui/form';
	import { Label } from '@/components/ui/label';
	import { Switch } from '@/components/ui/switch';
	import { Textarea } from '@/components/ui/textarea';
	import { Progress } from '@/components/ui/progress';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
	import { type Infer, intProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type UpdateBuyOptionRequest, ValueType } from '@schema';
	import { toast } from 'svelte-sonner';
	import type { InferOutput } from 'valibot';
	import { BuyOptionPreview } from '@/@svelte/modules';
	import { cn } from '@/utils';
	import { LocalizedDate } from '@/@svelte/components';

	interface Props {
		form: SuperValidated<Infer<UpdateBuyOptionRequest>>;
	}

	let { form }: Props = $props();

	let superform = superForm<Infer<UpdateBuyOptionRequest>>(form, {
		dataType: 'json',
		invalidateAll: 'force',
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success($_('user-pages.events.eventUpdatedSuccessfully'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	let { form: formData, enhance, isTainted, tainted } = superform;

	let signUpDaysProxy = intProxy(superform, 'allowedSignUpDays', { empty: 'null' });

	type Service = Infer<UpdateBuyOptionRequest>['services'][number]
	type Package = InferOutput<UpdateBuyOptionRequest>['packages'][number]
	type PackageBenefit = Infer<UpdateBuyOptionRequest>['packages'][number]['benefits'][number]
	type EventDay = Infer<UpdateBuyOptionRequest>['eventDays'][number]

	// Reactive variables (equivalent to React's useState)
	let activeTab = $state('editor');

	function handleCreateEventDay(e: Event) {
		e.preventDefault();
		formData.update((oldForm) => ({
			...oldForm,
			eventDays: [
				...oldForm.eventDays,
				{
					dayDate: new Date().toISOString().split('T')[0] ?? '2025-01-01',
					totalCapacity: 0,
					remainingCapacity: 0
				}
			]
		}));
	}

	function handleDeleteEventDay(e: Event, dayIndex: number) {
		e.preventDefault();
		formData.update((oldForm) => ({
			...oldForm,
			eventDays: [
				...oldForm.eventDays.slice(0, dayIndex),
				...oldForm.eventDays.slice(dayIndex + 1)
			]
		}));
	}

	// Service management
	function addService(): void {
		const newService: Service = {
			name: 'New Service',
			description: 'Description of the service',
			valueType: ValueType.Boolean
		};

		$formData = {
			...$formData,
			services: [...$formData.services, newService],
			packages: $formData.packages.map((pkg) => ({
				...pkg,
				benefits: [
					...pkg.benefits,
					{}
				]
			}))
		};

	}

	function removeService(serviceIndex: number): void {
		$formData = {
			...$formData,
			services: $formData.services.filter((service, index) => index !== serviceIndex),
			packages: $formData.packages.map((pkg) => ({
				...pkg,
				benefits: pkg.benefits.filter((value, index) => index !== serviceIndex)
			}))
		};
	}

	function moveService(serviceIndex: number, direction: 'up' | 'down'): void {
		if (
			(direction === 'up' && serviceIndex === 0) ||
			(direction === 'down' && serviceIndex === $formData.services.length - 1)
		) {
			return;
		}

		const newIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;
		const newServices = [...$formData.services];
		const [movedService] = newServices.splice(serviceIndex, 1);
		newServices.splice(newIndex, 0, movedService);

		$formData = {
			...$formData,
			services: newServices
		};
	}


	// Package management
	function addPackage(): void {
		const newPackage: Package = {
			name: 'New Package',
			price: 0,
			benefits: $formData.services.map(() => ({}))
		};

		$formData = {
			...$formData,
			packages: [...$formData.packages, newPackage]
		};
	}


	// Calculate capacity percentage
	function calculateCapacityPercentage(day: EventDay): number {
		return Math.round(((day.totalCapacity - day.remainingCapacity) / day.totalCapacity) * 100);
	}

	function removePackage(packageIndex: number): void {
		$formData = {
			...$formData,
			packages: $formData.packages.filter((pkg, index) => index !== packageIndex)
		};
	}

	function movePackage(packageIndex: number, direction: 'left' | 'right'): void {
		if (
			(direction === 'left' && packageIndex === 0) ||
			(direction === 'right' && packageIndex === $formData.packages.length - 1)
		) {
			return;
		}

		const newIndex = direction === 'left' ? packageIndex - 1 : packageIndex + 1;
		const newPackages = [...$formData.packages];
		const [movedPackage] = newPackages.splice(packageIndex, 1);
		newPackages.splice(newIndex, 0, movedPackage);

		$formData = {
			...$formData,
			packages: newPackages
		};
	}
</script>

<form action="?/updateBuyOption" method="post" use:enhance class="space-y-2">
	<div class="space-y-6 pb-6">
		<div class="flex justify-between items-center">
			<div>
				<h2 class="text-2xl font-semibold">{$_("components.editBuyOptions.buyOptionEditor")}</h2>
				<p class="text-muted-foreground">{$_("components.editBuyOptions.editorDescription")}</p>
			</div>
			<div class="flex gap-2">
				<Button type="submit" disabled={!isTainted($tainted)} class={cn(isTainted($tainted) ? "animate-pulse":null)}>
					<Save class="mr-2 size-4" />
					{$_("components.editBuyOptions.saveBuyOption")}
				</Button>
			</div>
		</div>

		<Tabs value={activeTab} onValueChange={(value) => {if (value) activeTab = value}}>
			<TabsList>
				<TabsTrigger value="editor">{$_("components.editBuyOptions.editor")}</TabsTrigger>
				<TabsTrigger value="preview">{$_("components.editBuyOptions.preview")}</TabsTrigger>
			</TabsList>

			<TabsContent value="editor" class="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>{$_("components.editBuyOptions.generalInformation")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid gap-4">
							<div class="grid gap-2">
								<Label for="buyOptionName">{$_("components.editBuyOptions.buyOptionName")}</Label>
								<Input
									id="buyOptionName"
									name="buyOptionName"
									bind:value={$formData.name}
								/>
							</div>
						</div>
						<section class="py-4 space-y-4">
							<div class="flex flex-nowrap justify-between gap-4 items-center">
								<h3 class="font-semibold text-lg grow">{$_("components.editBuyOptions.eventDays.header")}</h3>
								<Button onclick={handleCreateEventDay}>
									<Plus class="mr-2 size-4" />
									Add event day
								</Button>
							</div>
							<div class="space-y-4">
								{#if $formData.eventDays.length === 0}
									<div class="text-center py-4 text-muted-foreground">
										No event days added yet. Add days to allow organizations to select their preferred participation
										day.
									</div>
								{:else}
									<div class="grid gap-4">
										{#each $formData.eventDays as day, index}
											<div class="flex items-center justify-between p-4 border rounded-md">
												<div class="flex-1">
													<div class="flex items-center gap-2">
														<Calendar class="size-5 text-muted-foreground" />
														<LocalizedDate format="dddd, LL" date={day.dayDate} />
													</div>
													<div class="mt-2 space-y-1">
														<div class="flex justify-between text-sm">
															<span>Capacity: {day.totalCapacity} spots</span>
															<span class="text-muted-foreground">{day.remainingCapacity} remaining</span>
														</div>
														<Progress value={calculateCapacityPercentage(day)} class="h-2" />
													</div>
												</div>
												<div class="flex gap-2 ml-4">
													<Dialog>
														<DialogTrigger class={cn(buttonVariants({variant: 'ghost', size: 'icon'}))}>
															<Eye class="size-4" />
														</DialogTrigger>
														<DialogContent class="sm:max-w-[500px]">
															<DialogHeader>
																<DialogTitle>Edit Event Day</DialogTitle>
																<DialogDescription>Configure the event day details and capacity.</DialogDescription>
															</DialogHeader>
															<div class="grid gap-4 py-4">
																<div class="grid gap-2">
																	<Label for="eventDate">Event Date</Label>
																	<Input
																		id="eventDate"
																		type="date"
																		bind:value={$formData.eventDays[index].dayDate}
																	/>
																</div>
																<div class="grid gap-2">
																	<Label for="totalCapacity">Total Capacity</Label>
																	<Input
																		id="totalCapacity"
																		type="number"
																		min="1"
																		bind:value={$formData.eventDays[index].totalCapacity}
																	/>
																	<p class="text-sm text-muted-foreground">Maximum number of organizations that can
																		participate on this day</p>
																</div>
																<div class="grid gap-2">
																	<Label for="remainingCapacity">Remaining Capacity</Label>
																	<Input
																		id="remainingCapacity"
																		type="number"
																		min="0"
																		max={$formData.eventDays[index].totalCapacity}
																		bind:value={$formData.eventDays[index].remainingCapacity}
																	/>
																	<p class="text-sm text-muted-foreground">Number of spots still available for
																		booking</p>
																</div>
																<div class="mt-2">
																	<div class="text-sm mb-2">Capacity Usage</div>
																	<Progress value={calculateCapacityPercentage($formData.eventDays[index])}
																						class="h-2" />
																	<div class="flex justify-between text-sm mt-1">
																				<span>{$formData.eventDays[index].totalCapacity - $formData.eventDays[index].remainingCapacity}
																					booked</span>
																		<span class="text-muted-foreground">{$formData.eventDays[index].remainingCapacity}
																			remaining</span>
																	</div>
																</div>
															</div>
															<DialogFooter>
																<DialogClose class={buttonVariants({variant: "outline-solid"})}>
																	{$_("common.confirm")}
																</DialogClose>
															</DialogFooter>
														</DialogContent>
													</Dialog>
													<Button variant="ghost" size="icon" onclick={(e) => handleDeleteEventDay(e, index)}>
														<Trash2 class="size-4 text-destructive" />
													</Button>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</section>
						{#if $formData.eventDays.length > 1}
							<section class="py-4 space-y-4">
								<h3
									class="font-semibold text-lg grow">{$_("components.editBuyOptions.eventDays.signUpDays.header")}</h3>
								<Tabs bind:value={$signUpDaysProxy}>
									<TabsList>
										{#each $formData.eventDays as _someDay, dayIndex}
											<TabsTrigger
												value={(dayIndex + 1).toString()}>{$_('components.editBuyOptions.eventDays.signUpDays.days', {
												values: { days: (dayIndex + 1).toString() }
											})}</TabsTrigger>
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
							<CardTitle>{$_("components.editBuyOptions.services")}</CardTitle>
							<Button size="sm" onclick={addService}>
								<Plus class="mr-2 size-4" />
								{$_("components.editBuyOptions.addService")}
							</Button>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								{#each $formData.services as service, index}
									<div class="flex items-center justify-between p-2 border rounded-md">
										<div>
											<p class="font-medium">{service.name}</p>
											<p class="text-sm text-muted-foreground">{service.valueType.valueOf()}</p>
										</div>
										<div class="flex gap-1">
											<Button variant="ghost" size="icon" onclick={() => moveService(index, "up")}>
												<ArrowUp class="size-4" />
											</Button>
											<Button variant="ghost" size="icon" onclick={() => moveService(index, "down")}>
												<ArrowDown class="size-4" />
											</Button>
											<Dialog>
												<DialogTrigger class={cn(buttonVariants({variant: 'ghost', size: 'icon'}))}>
													<Eye class="size-4" />
												</DialogTrigger>
												<DialogContent class="sm:max-w-[500px]">
													<DialogHeader>
														<DialogTitle>{$_("components.editBuyOptions.editService")}</DialogTitle>
														<DialogDescription>{$_("components.editBuyOptions.serviceDescription")}</DialogDescription>
													</DialogHeader>
													<div class="grid gap-4 py-4">
														<div class="grid gap-2">
															<Label for="serviceName">{$_("components.editBuyOptions.serviceName")}</Label>
															<Input
																id="serviceName"
																bind:value={$formData.services[index].name}
															/>
														</div>
														<div class="grid gap-2">
															<Label
																for="serviceDescription">{$_("components.editBuyOptions.serviceDescription")}</Label>
															<Textarea
																id="serviceDescription"
																bind:value={$formData.services[index].description}
															/>
														</div>
														<Field
															class="flex flex-col gap-y-1 justify-end"
															form={superform}
															name={`services[${index}].valueType`}
														>
															<Control >
																{#snippet children({ props })}
																																<FormLabel>{$_("components.editBuyOptions.type")}</FormLabel>
																	<DropdownMenu.Root>
																		<DropdownMenu.Trigger>
																			{#snippet child({ props })}
																																				<Button class="my-2! p-2" variant="outline" {...props}>
																					{#if $formData.services[index].valueType === 'STRING'}
																						Textfeld für generische Werte
																					{:else if $formData.services[index].valueType === 'BOOLEAN'}
																						Enthalten (ja/nein)
																					{:else if $formData.services[index].valueType === 'INTEGER'}
																						Anzahl (z. B. 2 Stühle)
																					{/if}
																				</Button>
																																																						{/snippet}
																																		</DropdownMenu.Trigger>
																		<DropdownMenu.Content>
																			<DropdownMenu.RadioGroup
																				{...props}
																				bind:value={$formData.services[index].valueType}
																			>
																				<DropdownMenu.RadioItem
																					value="STRING">{$_("components.editBuyOptions.typeText")}</DropdownMenu.RadioItem>
																				<DropdownMenu.RadioItem
																					value="BOOLEAN">{$_("components.editBuyOptions.typeBoolean")}</DropdownMenu.RadioItem>
																				<DropdownMenu.RadioItem
																					value="INTEGER">{$_("components.editBuyOptions.typeNumeric")}</DropdownMenu.RadioItem>
																			</DropdownMenu.RadioGroup>
																		</DropdownMenu.Content>
																	</DropdownMenu.Root>
																																															{/snippet}
																														</Control>
														</Field>
													</div>
													<DialogFooter>
														<DialogClose
															class={buttonVariants({variant: "outline-solid"})}>{$_("common.confirm")}</DialogClose>
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
							<CardTitle>{$_("components.editBuyOptions.packages")}</CardTitle>
							<Button size="sm" onclick={addPackage}>
								<Plus class="mr-2 size-4" />
								{$_("components.editBuyOptions.addPackage")}
							</Button>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								{#each $formData.packages as pkg, index}
									<div class="flex items-center justify-between p-2 border rounded-md">
										<div>
											<p class="font-medium">{pkg.name}</p>
											<p class="text-sm text-muted-foreground">{$number((pkg.price ?? 0) / 100, {
												style: 'currency',
												currency: 'EUR',
												currencyDisplay: 'code'
											})}</p>
										</div>
										<div class="flex gap-1">
											<Button variant="ghost" size="icon" onclick={() => movePackage(index, "left")}>
												<ArrowUp class="size-4" />
											</Button>
											<Button variant="ghost" size="icon" onclick={() => movePackage(index, "right")}>
												<ArrowDown class="size-4" />
											</Button>
											<Dialog>
												<DialogTrigger class={cn(buttonVariants({variant: 'ghost', size: 'icon'}))}>
													<Eye class="size-4" />
												</DialogTrigger>
												<DialogContent class="sm:max-w-[500px]">
													<DialogHeader>
														<DialogTitle>{$_("components.editBuyOptions.editPackage")}</DialogTitle>
														<DialogDescription>{$_("components.editBuyOptions.editPackageDescription")}</DialogDescription>
													</DialogHeader>
													<div class="grid gap-4 py-4">
														<div class="grid gap-2">
															<Label for="packageName">{$_("components.editBuyOptions.packageName")}</Label>
															<Input
																id="packageName"
																bind:value={$formData.packages[index].name}
															/>
														</div>
														<div class="grid gap-2">
															<Label for="packagePrice">{$_("components.editBuyOptions.packagePrice")}</Label>
															<Input
																id="packagePrice"
																type="number"
																bind:value={$formData.packages[index].price}
															/>
														</div>
													</div>
													<DialogFooter>
														<DialogClose
															class={buttonVariants({variant: "outline-solid"})}>{$_("common.confirm")}</DialogClose>
													</DialogFooter>
												</DialogContent>
											</Dialog>
											<Button variant="ghost" size="icon" onclick={() => removePackage(index)}>
												<Trash2 class="size-4 text-destructive" />
											</Button>
										</div>
									</div>
								{/each}
							</div>
						</CardContent>
					</Card>
				</div>

				<!-- Package Values Matrix -->
				<Card>
					<CardHeader>
						<CardTitle>{$_("components.editBuyOptions.packageBenefitConfiguration")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead class="w-[200px]">{$_("components.editBuyOptions.service")}</TableHead>
										<TableHead class="w-[150px]">{$_("components.editBuyOptions.type")}</TableHead>
										{#each $formData.packages as pkg, index}
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
									{#each $formData.services as service, serviceIndex}
										<TableRow>
											<TableCell class="font-medium">{service.name}</TableCell>
											<TableCell>{service.valueType}</TableCell>
											{#each $formData.packages as pkg, index}
												<TableCell>
													{#if service.valueType === ValueType.Boolean}
														<div class="flex justify-center">
															<Switch
																bind:checked={$formData.packages[index].benefits[serviceIndex].booleanValue}
															/>
														</div>
													{:else if service.valueType === ValueType.Integer}
														<Input
															type="number"
															bind:value={$formData.packages[index].benefits[serviceIndex].numericValue}
															class="w-20 mx-auto"
														/>
													{:else}
														<Input
															type="text"
															bind:value={$formData.packages[index].benefits[serviceIndex].stringValue}
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
				<BuyOptionPreview buyOption={$formData} />
			</TabsContent>
		</Tabs>

	</div>
</form>
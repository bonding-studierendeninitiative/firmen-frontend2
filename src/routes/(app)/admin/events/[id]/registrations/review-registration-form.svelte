<script lang="ts">
	import { Calendar, Check, ChevronRight, Clock, Edit, MapPin, Package, Plus, Users, X } from 'lucide-svelte';

	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '@/components/ui/dialog';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Separator } from '@/components/ui/separator';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
	import { Textarea } from '@/components/ui/textarea';

	// Mock data for demonstration
	const registrationData = {
		id: 'REG-12345',
		status: 'pending',
		createdAt: '2025-02-15T10:30:00Z',
		organization: {
			name: 'TechCorp Solutions',
			address: '123 Innovation Drive, Tech City, TC 54321',
			logo: '/placeholder.svg?height=50&width=50'
		},
		contacts: [
			{ id: '1', name: 'Jane Smith', email: 'jane@techcorp.com', role: 'Primary Contact', phone: '+1 555-123-4567' },
			{ id: '2', name: 'John Doe', email: 'john@techcorp.com', role: 'Technical Contact', phone: '+1 555-987-6543' },
			{
				id: '3',
				name: 'Alex Johnson',
				email: 'alex@techcorp.com',
				role: 'Marketing Contact',
				phone: '+1 555-456-7890'
			}
		],
		event: {
			name: 'Tech Innovation Summit 2025',
			startDate: '2025-06-10',
			endDate: '2025-06-12',
			location: 'Convention Center, Tech City'
		},
		package: {
			name: 'Premium Exhibitor',
			price: '$5,000',
			benefits: [
				'10x10 booth space',
				'4 exhibitor passes',
				'Logo on event website',
				'Full-page ad in event guide',
				'Priority booth location'
			]
		},
		addons: [
			{
				name: 'Marketing Package A',
				type: 'package',
				price: '$1,500',
				items: [
					{ name: 'Social Media Promotion', price: '$500' },
					{ name: 'Email Newsletter Feature', price: '$750' },
					{ name: 'Press Release Distribution', price: '$250' }
				]
			},
			{
				name: 'Additional Services',
				type: 'individual',
				items: [
					{ name: 'Extra Exhibitor Pass', quantity: 2, price: '$200' },
					{ name: 'Lead Capture Device', quantity: 1, price: '$300' }
				]
			}
		],
		eventDays: ['2025-06-10', '2025-06-11', '2025-06-12'],
		registrationCount: 1,
		notes: 'First-time exhibitor. Interested in sponsorship opportunities for next year.'
	};
	const handleConfirm = () => {
		// Here you would typically make an API call to update the status
		console.log('Registration confirmed');
	};

	const handleReject = () => {
		// Here you would typically make an API call to update the status
		console.log('Registration rejected');
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

</script>
<Dialog open={open} onOpenChange={() => console.log('open changed')} class="max-w-4xl">
	<DialogContent class="max-w-4xl max-h-[90vh] p-0">
		<DialogHeader class="p-6 pb-2">
			<div class="flex items-center justify-between">
				<div>
					<DialogTitle class="text-2xl">Registration Review</DialogTitle>
					<DialogDescription class="mt-1">
						Review registration #{registrationData.id} for {registrationData.organization.name}
					</DialogDescription>
				</div>
				<Badge
					variant={registrationData.status === "confirmed" ? "success" : registrationData.status === "rejected" ? "destructive" : "outline"}
					class="text-sm px-3 py-1 capitalize"
				>
					{registrationData.status}
				</Badge>
			</div>
		</DialogHeader>

		<Tabs defaultValue="overview" class="w-full">
			<div class="px-6">
				<TabsList class="grid grid-cols-4 w-full">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="organization">Organization</TabsTrigger>
					<TabsTrigger value="package">Package & Addons</TabsTrigger>
					<TabsTrigger value="schedule">Schedule</TabsTrigger>
				</TabsList>
			</div>

			<ScrollArea class="h-[60vh] border-t mt-2">
				<TabsContent value="overview" class="p-6 pt-4">
					<div class="grid grid-cols-2 gap-6">
						<Card>
							<CardHeader class="pb-2">
								<CardTitle class="text-lg flex items-center">
									<Users class="h-5 w-5 mr-2" />
									Organization
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="space-y-2">
									<div class="flex items-start">
										<div class="mr-3 mt-1">
											<img
												src={registrationData.organization.logo || "/placeholder.svg"}
												alt={registrationData.organization.name}
												class="h-10 w-10 rounded-md"
											/>
										</div>
										<div>
											<h3 class="font-medium">{registrationData.organization.name}</h3>
											<p class="text-sm text-muted-foreground flex items-start">
												<MapPin class="h-3.5 w-3.5 mr-1 mt-0.5" />
												{registrationData.organization.address}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader class="pb-2">
								<CardTitle class="text-lg flex items-center">
									<Package class="h-5 w-5 mr-2" />
									Package
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="space-y-2">
									<div>
										<h3 class="font-medium">{registrationData.package.name}</h3>
										<p class="text-sm text-muted-foreground">{registrationData.package.price}</p>
									</div>
									<ul class="text-sm space-y-1 mt-2">
										{#each registrationData.package.benefits.slice(0, 3) as benefit, index}
											<li class="flex items-start">
												<Check class="h-3.5 w-3.5 mr-1.5 mt-0.5 text-green-500" />
												{benefit}
											</li>
										{/each}
										{#if registrationData.package.benefits.length > 3 }

											<li class="text-sm text-muted-foreground">
												+{registrationData.package.benefits.length - 3} more benefits
											</li>
										{/if}
									</ul>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader class="pb-2">
								<CardTitle class="text-lg flex items-center">
									<Calendar class="h-5 w-5 mr-2" />
									Event Days
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="space-y-2">
									<div class="grid gap-1">
										{#each registrationData.eventDays as day, index}
											<div class="flex items-center">
												<Badge variant="outline" class="mr-2">
													Day {index + 1}
												</Badge>
												<span>{formatDate(day)}</span>
											</div>
										{/each}
									</div>
									<p class="text-sm text-muted-foreground mt-2">
										<Clock class="h-3.5 w-3.5 inline mr-1" />
										Total registrations: {registrationData.registrationCount}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader class="pb-2">
								<CardTitle class="text-lg flex items-center">
									<Users class="h-5 w-5 mr-2" />
									Contacts
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div class="space-y-3">
									{#each registrationData.contacts as contact}
										<div class="text-sm">
											<div class="font-medium">{contact.name}</div>
											<div class="text-muted-foreground">{contact.role}</div>
											<div class="text-xs mt-1">
												{contact.email} • {contact.phone}
											</div>
										</div>
									{/each}
								</div>
							</CardContent>
						</Card>
					</div>

					<div class="mt-6">
						<h3 class="text-lg font-medium mb-2">Admin Notes</h3>
						<Textarea
							placeholder="Add notes about this registration..."
							class="min-h-[100px]"
							value={registrationData.notes}
						/>
					</div>
				</TabsContent>

				<TabsContent value="organization" class="p-6 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Organization Details</CardTitle>
							<CardDescription>Complete information about the registered organization</CardDescription>
						</CardHeader>
						<CardContent class="space-y-6">
							<div>
								<h3 class="text-lg font-medium mb-2">Organization Information</h3>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<div class="flex items-start">
											<div class="mr-3 mt-1">
												<img
													src={registrationData.organization.logo || "/placeholder.svg"}
													alt={registrationData.organization.name}
													class="h-16 w-16 rounded-md"
												/>
											</div>
											<div>
												<h3 class="font-medium text-xl">{registrationData.organization.name}</h3>
												<p class="text-sm text-muted-foreground flex items-start mt-1">
													<MapPin class="h-3.5 w-3.5 mr-1 mt-0.5" />
													{registrationData.organization.address}
												</p>
											</div>
										</div>
									</div>
									<div>
										<h4 class="font-medium mb-1">Registration Details</h4>
										<div class="text-sm space-y-1">
											<div class="flex justify-between">
												<span class="text-muted-foreground">Registration ID:</span>
												<span>{registrationData.id}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-muted-foreground">Submitted on:</span>
												<span>{new Date(registrationData.createdAt).toLocaleDateString()}</span>
											</div>
											<div class="flex justify-between">
												<span class="text-muted-foreground">Status:</span>
												<Badge
													variant={
	registrationData.status === "confirmed" ? "success" : registrationData.status === "rejected" ? "destructive" : "outline"
	}
													class="text-xs px-2 capitalize"
												>
													{registrationData.status}
												</Badge>
											</div>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							<div>
								<h3 class="text-lg font-medium mb-3">Contact People</h3>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									{#each registrationData.contacts as contact}
										<Card class="border">
											<CardHeader class="p-4 pb-2">
												<CardTitle class="text-base">{contact.name}</CardTitle>
												<CardDescription>{contact.role}</CardDescription>
											</CardHeader>
											<CardContent class="p-4 pt-0 text-sm space-y-1">
												<div class="flex items-center">
													<span class="text-muted-foreground w-16">Email:</span>
													<span>{contact.email}</span>
												</div>
												<div class="flex items-center">
													<span class="text-muted-foreground w-16">Phone:</span>
													<span>{contact.phone}</span>
												</div>
											</CardContent>
										</Card>
									{/each}
								</div>
							</div>

							<Separator />

							<div>
								<h3 class="text-lg font-medium mb-2">Notes</h3>
								<p class="text-sm">{registrationData.notes}</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="package" class="p-6 pt-4">
					<div class="grid gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Selected Package</CardTitle>
								<CardDescription>The package selected by the organization</CardDescription>
							</CardHeader>
							<CardContent>
								<div class="flex justify-between items-start">
									<div>
										<h3 class="text-xl font-medium">{registrationData.package.name}</h3>
										<p class="text-muted-foreground mt-1">Includes the following benefits:</p>
										<ul class="mt-3 space-y-1">
											{#each registrationData.package.benefits as benefit}
												<li class="flex items-start">
													<Check class="h-4 w-4 mr-2 mt-0.5 text-green-500" />
													<span>{benefit}</span>
												</li>
											{/each}
										</ul>
									</div>
									<div class="text-right">
										<div class="text-2xl font-bold">{registrationData.package.price}</div>
										<Button variant="outline" size="sm" class="mt-2">
											<Edit class="h-3.5 w-3.5 mr-1.5" />
											Change Package
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Addons & Services</CardTitle>
								<CardDescription>Additional services selected by the organization</CardDescription>
							</CardHeader>
							<CardContent>
								<div class="space-y-6">
									{#each registrationData.addons as addon}
										<div>
											<div class="flex justify-between items-center mb-2">
												<h3 class="text-lg font-medium">{addon.name}</h3>
												{#if addon.type === "package"}
													<Badge>{addon.price}</Badge>
												{/if}
											</div>
											<div class="pl-4 border-l-2 border-muted space-y-2">
												{#each addon.items as item}
													<div class="flex justify-between items-center">
														<div class="flex items-center">
															<ChevronRight class="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
															<span>
																{item.name}
																{#if item?.quantity}
																	<span class="text-muted-foreground ml-1">x{item.quantity}</span>
																	{/if}
	</span>
														</div>
														<Badge variant="outline">{item.price}</Badge>
													</div>
												{/each}
											</div>
										</div>
									{/each}
								</div>

								<div class="mt-6 flex justify-end">
									<Button variant="outline" size="sm">
										<Plus class="h-3.5 w-3.5 mr-1.5" />
										Add Addon
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="schedule" class="p-6 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Event Schedule</CardTitle>
							<CardDescription>Days the organization will be participating</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-6">
								<div>
									<h3 class="text-lg font-medium mb-2">Event Information</h3>
									<div class="grid grid-cols-2 gap-4">
										<div class="space-y-1">
											<div class="text-sm text-muted-foreground">Event Name</div>
											<div class="font-medium">{registrationData.event.name}</div>
										</div>
										<div class="space-y-1">
											<div class="text-sm text-muted-foreground">Location</div>
											<div class="font-medium">{registrationData.event.location}</div>
										</div>
										<div class="space-y-1">
											<div class="text-sm text-muted-foreground">Start Date</div>
											<div class="font-medium">{formatDate(registrationData.event.startDate)}</div>
										</div>
										<div class="space-y-1">
											<div class="text-sm text-muted-foreground">End Date</div>
											<div class="font-medium">{formatDate(registrationData.event.endDate)}</div>
										</div>
									</div>
								</div>

								<Separator />

								<div>
									<h3 class="text-lg font-medium mb-3">Selected Days</h3>
									<div class="space-y-4">
										{#each registrationData.eventDays as day, index}
											<Card class="border">
												<CardContent class="p-4 flex justify-between items-center">
													<div>
														<div class="font-medium">Day {index + 1}</div>
														<div class="text-sm text-muted-foreground">{formatDate(day)}</div>
													</div>
													<Button variant="outline" size="sm">
														<Edit class="h-3.5 w-3.5 mr-1.5" />
														Edit
													</Button>
												</CardContent>
											</Card>
										{/each}
									</div>
								</div>

								<Separator />

								<div>
									<div class="flex justify-between items-center mb-3">
										<h3 class="text-lg font-medium">Registration Summary</h3>
										<Badge variant="outline" class="text-base px-3 py-1">
											Total: {registrationData.registrationCount}
										</Badge>
									</div>
									<p class="text-sm text-muted-foreground">
										The organization has registered for {registrationData.eventDays.length} days with a total of{" "}
										{registrationData.registrationCount} registration(s).
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</ScrollArea>
		</Tabs>

		<DialogFooter class="p-6 pt-2 border-t">
			<div class="flex justify-between w-full">
				<Button variant="outline" on:click={() => {}}>
					Close
				</Button>
				<div class="flex gap-2">
					<Button variant="destructive" on:click={handleReject}>
						<X class="h-4 w-4 mr-2" />
						Reject Registration
					</Button>
					<Button on:click={handleConfirm}>
						<Check class="h-4 w-4 mr-2" />
						Confirm Registration
					</Button>
				</div>
			</div>
		</DialogFooter>
	</DialogContent>
</Dialog>
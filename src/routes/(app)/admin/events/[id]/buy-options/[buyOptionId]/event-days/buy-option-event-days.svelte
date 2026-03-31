<script lang="ts">
	import { _ } from '@services';
	import { Plus, Trash2, Calendar } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Card from '@/components/ui/card';
	import * as Dialog from '@/components/ui/dialog';
	import { changeAllowedSignUpDays, createBuyOptionEventDay } from '@/remote/functions/admin';
	import { Label } from '@/components/ui/label';
	import { Progress } from '@/components/ui/progress';
	import { LocalizedDate } from '@/@svelte/components';
	import * as Tabs from '@/components/ui/tabs';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import { cn } from '@/utils';
	import { slide } from 'svelte/transition';
	import EditEventDay from './edit-event-day.svelte';
	import type { InferInput, InferOutput } from 'valibot';
	import type { CreateBuyOptionEventDayInput, UpdateEventDayInput } from '@schema';
	import SuperDebug from 'sveltekit-superforms';

	interface Props {
		eventId: string;
		buyOptionId: string;
		version: number;
		eventDays: GetEventBuyOptionOutput['eventDays'];
		allowedSignUpDays: number;
		onDelete?: ({ eventDayId }: { eventDayId: string }) => Promise<void>;
		onCreate?: ({
			data,
			submit,
			form
		}: {
			data: InferInput<CreateBuyOptionEventDayInput>;
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
		}) => Promise<void>;
		onChangeAllowedSignUpDays?: ({
			allowedSignUpDays
		}: {
			allowedSignUpDays: number;
		}) => Promise<void>;
		onEdit?: ({
			data,
			submit,
			form
		}: {
			data: InferOutput<UpdateEventDayInput>;
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
		}) => Promise<void>;
	}
	let {
		eventId,
		buyOptionId,
		version,
		eventDays,
		allowedSignUpDays,
		onDelete,
		onCreate,
		onChangeAllowedSignUpDays,
		onEdit
	}: Props = $props();

	// Calculate capacity percentage
	function calculateCapacityPercentage(day: {
		totalCapacity?: number;
		remainingCapacity?: number;
	}): number {
		return Math.round(
			((Number(day.totalCapacity) - Number(day.remainingCapacity)) / Number(day.totalCapacity)) *
				100
		);
	}

	let createOpen = $state(false);
</script>

<!-- Event Days Management -->
<Card.Root>
	<Card.Header class="flex flex-nowrap justify-between gap-4 items-center flex-row">
		<Card.Title>{$_('components.editBuyOptions.eventDays.header')}</Card.Title>
		<Dialog.Root bind:open={createOpen}>
			<Dialog.Trigger class={cn(buttonVariants({ variant: 'default', size: 'sm' }))} type="button">
				<Plus class="mr-2 size-4" />
				Add event day
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[500px]">
				<form
					{...createBuyOptionEventDay.enhance(async ({ submit, form, data }) => {
						await onCreate?.({ data, submit, form });
						if (createBuyOptionEventDay.result?.id) {
							createOpen = false;
							form.reset();
						}
					})}
				>
					<input {...createBuyOptionEventDay.fields.eventId.as('hidden', eventId)} />
					<input {...createBuyOptionEventDay.fields.buyOptionId.as('hidden', buyOptionId)} />
					<input
						{...createBuyOptionEventDay.fields.version.as('number')}
						value={version}
						type="hidden"
					/>
					<Dialog.Header>
						<Dialog.Title>Add Event Day</Dialog.Title>
						<Dialog.Description>Configure the event day details and capacity.</Dialog.Description>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<div class="grid gap-2">
							<Label for="eventDate">Event Date</Label>
							<Input id="eventDate" {...createBuyOptionEventDay.fields.date.as('date')} />
						</div>
						<div class="grid gap-2">
							<Label for="totalCapacity">Total Capacity</Label>
							<Input
								id="totalCapacity"
								{...createBuyOptionEventDay.fields.totalCapacity.as('number')}
							/>
							<p class="text-sm text-muted-foreground">
								Maximum number of organizations that can participate on this day
							</p>
						</div>
					</div>
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants({ variant: 'outline' })} type="button">
							{$_('common.cancel')}
						</Dialog.Close>
						<Button type="submit">{$_('common.create')}</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
		<!-- Create Event Day Dialog -->
	</Card.Header>
	<Card.Content>
		<section class="py-4 space-y-4">
			{#if !eventDays || eventDays.length < 1}
				<div class="text-center py-4 text-muted-foreground">
					No event days added yet. Add days to allow organizations to select their preferred
					participation day.
				</div>
			{:else}
				<div class="grid gap-4">
					{#each eventDays as day (day.id)}
						<div out:slide class="flex items-center justify-between p-4 border rounded-md">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<Calendar class="size-5 text-muted-foreground" />
									<LocalizedDate format="dddd, LL" date={day.dayDate} />
								</div>
								<div class="mt-2 space-y-1">
									<div class="flex justify-between text-sm">
										<span>Capacity: {day.totalCapacity} spots</span>
										<span class="text-muted-foreground">
											{day.remainingCapacity} remaining
										</span>
									</div>
									<Progress value={calculateCapacityPercentage(day)} class="h-2" />
								</div>
							</div>
							<div class="flex gap-2 ml-4">
								<EditEventDay {day} {eventId} {buyOptionId} {version} {onEdit} />
								<!-- Edit Event Day Dialog -->
								<Button
									variant="ghost"
									size="icon"
									onclick={async (e) => await onDelete?.({ eventDayId: day.id! })}
								>
									<Trash2 class="size-4 text-destructive" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
		{#if Number(eventDays?.length) > 1}
			<section class="py-4 space-y-4">
				<h3 class="font-semibold text-lg grow">
					{$_('components.editBuyOptions.eventDays.signUpDays.header')}
				</h3>
				<Tabs.Root
					disabled={!!changeAllowedSignUpDays.pending}
					bind:value={
						() => allowedSignUpDays?.toString() ?? '1',
						async (value) => {
							if (value !== allowedSignUpDays.toString()) {
								await onChangeAllowedSignUpDays?.({
									allowedSignUpDays: Number(value)
								});
							}
						}
					}
				>
					<Tabs.List>
						{#each eventDays ?? [] as _someDay, dayIndex}
							<Tabs.Trigger value={(dayIndex + 1).toString()}
								>{$_('components.editBuyOptions.eventDays.signUpDays.days', {
									values: { days: (dayIndex + 1).toString() }
								})}</Tabs.Trigger
							>
						{/each}
					</Tabs.List>
				</Tabs.Root>
			</section>
		{/if}
	</Card.Content>
</Card.Root>

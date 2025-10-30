<script lang="ts">
	import { _, number } from '@services';
	import { Input } from '@/components/ui/input';
	import * as Card from '@/components/ui/card';
	import * as Table from '@/components/ui/table';
	import { createBuyOptionBenefit, updateBuyOptionBenefit } from '@/remote/functions/admin';

	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import { Switch } from '@/components/ui/switch';
	import { ValueType } from '@schema';
	import SuperDebug from 'sveltekit-superforms';
	interface Props {
		eventId: string;
		buyOptionId: string;
		getBuyOptionQuery: RemoteQuery<GetEventBuyOptionOutput>;
		version: number;
		services: GetEventBuyOptionOutput['services'];
		packages: GetEventBuyOptionOutput['packages'];
		benefits: GetEventBuyOptionOutput['benefits'];
	}
	let { eventId, buyOptionId, getBuyOptionQuery, version, services, packages, benefits }: Props =
		$props();
</script>

<!-- Package Values Matrix -->
<Card.Root class="col-span-2">
	<Card.Header>
		<Card.Title>{$_('components.editBuyOptions.packageBenefitConfiguration')}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="overflow-x-auto">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[200px]">{$_('components.editBuyOptions.service')}</Table.Head>
						<Table.Head class="w-[150px]">{$_('components.editBuyOptions.type')}</Table.Head>
						{#each packages ?? [] as pkg, index}
							<Table.Head class="text-center">
								{pkg.name} ({$number((pkg.price ?? 0) / 100, {
									style: 'currency',
									currency: 'EUR',
									currencyDisplay: 'code'
								})})
							</Table.Head>
						{/each}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each services ?? [] as service (service.id)}
						<Table.Row>
							<Table.Cell class="font-medium">{service.name}</Table.Cell>
							<Table.Cell>{service.valueType}</Table.Cell>
							{#each packages ?? [] as _pkg}
								{@const benefit = benefits?.find(
									(b) => b.serviceId === service.id && b.packageId === _pkg.id
								)}
								<Table.Cell>
									{#if service.valueType === ValueType.Boolean}
										<div class="flex justify-center">
											<Switch
												disabled={Boolean(
													updateBuyOptionBenefit.pending + createBuyOptionBenefit.pending
												)}
												bind:checked={
													() => benefit?.booleanValue ?? false,
													(v) => {
														const benefitId = benefit?.id;
														if (!benefitId) {
															createBuyOptionBenefit({
																eventId,
																buyOptionId,
																serviceId: service.id!,
																packageId: _pkg.id!,
																booleanValue: v,
																version: version!
															}).updates(
																getBuyOptionQuery.withOverride((buyOption) => {
																	if (!buyOption.benefits) {
																		buyOption.benefits = [];
																	}
																	buyOption.benefits.push({
																		id: 'temp-id-' + Math.random().toString(36).substr(2, 9),
																		serviceId: service.id!,
																		packageId: _pkg.id!,
																		booleanValue: v
																	});
																	buyOption.version = (buyOption.version ?? 0) + 1;
																	return buyOption;
																})
															);
														} else {
															updateBuyOptionBenefit({
																eventId,
																buyOptionId,
																benefitId,
																booleanValue: v,
																version: version!
															}).updates(
																getBuyOptionQuery.withOverride((buyOption) => {
																	if (!benefitId) return buyOption;
																	return {
																		...buyOption,
																		benefits: buyOption.benefits?.map((b) => {
																			if (benefitId === b.id) {
																				return {
																					...b,
																					booleanValue: v
																				};
																			}
																			return b;
																		}),
																		version: (buyOption.version ?? 0) + 1
																	};
																})
															);
														}
													}
												}
												type="button"
											/>
										</div>
									{:else if service.valueType === ValueType.Integer}
										<Input
											type="number"
											disabled={Boolean(
												updateBuyOptionBenefit.pending + createBuyOptionBenefit.pending
											)}
											bind:value={
												() => benefit?.numericValue ?? '',
												(v) => {
													if (!benefit?.id) {
														createBuyOptionBenefit({
															eventId,
															buyOptionId,
															serviceId: service.id!,
															packageId: _pkg.id!,
															numericValue: Number(v),
															version: version!
														}).updates(
															getBuyOptionQuery.withOverride((buyOption) => {
																if (!buyOption.benefits) {
																	buyOption.benefits = [];
																}
																buyOption.benefits.push({
																	id: 'temp-id-' + Math.random().toString(36).substr(2, 9),
																	serviceId: service.id!,
																	packageId: _pkg.id!,
																	numericValue: Number(v)
																});
																buyOption.version = (buyOption.version ?? 0) + 1;
																return buyOption;
															})
														);
													} else {
														updateBuyOptionBenefit({
															eventId,
															buyOptionId,
															benefitId: benefit?.id ?? '',
															numericValue: Number(v),
															version: version!
														}).updates(getBuyOptionQuery);
													}
												}
											}
											class="w-20 mx-auto"
										/>
									{:else}
										<Input
											type="text"
											disabled={Boolean(
												updateBuyOptionBenefit.pending + createBuyOptionBenefit.pending
											)}
											bind:value={
												() => benefit?.stringValue ?? '',
												(v) => {
													if (!benefit?.id) {
														createBuyOptionBenefit({
															eventId,
															buyOptionId,
															serviceId: service.id!,
															packageId: _pkg.id!,
															stringValue: v,
															version: version!
														}).updates(
															getBuyOptionQuery.withOverride((buyOption) => {
																if (!buyOption.benefits) {
																	buyOption.benefits = [];
																}
																buyOption.benefits.push({
																	id: 'temp-id-' + Math.random().toString(36).substr(2, 9),
																	serviceId: service.id!,
																	packageId: _pkg.id!,
																	stringValue: v
																});
																buyOption.version = (buyOption.version ?? 0) + 1;
																return buyOption;
															})
														);
													} else {
														updateBuyOptionBenefit({
															eventId,
															buyOptionId,
															benefitId: benefit?.id ?? '',
															stringValue: v,
															version: version!
														}).updates(
															getBuyOptionQuery.withOverride((buyOption) => {
																if (buyOption.benefits) {
																	const ben = buyOption.benefits.find((b) => b.id === benefit?.id);
																	if (ben) {
																		ben.stringValue = v;
																		buyOption.version = (buyOption.version ?? 0) + 1;
																	}
																}
																return buyOption;
															})
														);
													}
												}
											}
											class="w-full"
										/>
									{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Content>
</Card.Root>

<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Eye, EyeOff, CheckCircle, X } from '@lucide/svelte';

	interface Props {
		id?: string;
		name?: string;
		value?: string;
		placeholder?: string;
		label?: string;
		disabled?: boolean;
		required?: boolean;
		showStrength?: boolean;
		showRequirements?: boolean;
		className?: string;
		classNames?: {
			container?: string;
			label?: string;
			input?: string;
			button?: string;
			strength?: string;
			requirements?: string;
		};
		localization?: any;
		onInput?: (value: string) => void;
		onChange?: (value: string) => void;
	}

	let {
		id = 'password',
		name = 'password',
		value = $bindable(''),
		placeholder = '',
		label = '',
		disabled = false,
		required = false,
		showStrength = false,
		showRequirements = false,
		className = '',
		classNames = {},
		localization = {},
		onInput,
		onChange
	}: Props = $props();

	let showPassword = $state(false);

	// Password validation
	let passwordValidation = $derived({
		minLength: value.length >= 8,
		hasNumber: /\d/.test(value),
		hasLower: /[a-z]/.test(value),
		hasUpper: /[A-Z]/.test(value),
		hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
	});

	let passwordStrength = $derived.by(() => {
		if (!value) return { score: 0, label: '', color: '' };

		let score = 0;
		if (passwordValidation.minLength) score += 1;
		if (passwordValidation.hasNumber) score += 1;
		if (passwordValidation.hasLower) score += 1;
		if (passwordValidation.hasUpper) score += 1;
		if (passwordValidation.hasSpecial) score += 1;

		if (score <= 1)
			return {
				score,
				label: localization.WEAK || 'Weak',
				color: 'bg-red-500'
			};
		if (score <= 3)
			return {
				score,
				label: localization.MEDIUM || 'Medium',
				color: 'bg-yellow-500'
			};
		if (score <= 4)
			return {
				score,
				label: localization.STRONG || 'Strong',
				color: 'bg-blue-500'
			};
		return {
			score,
			label: localization.VERY_STRONG || 'Very Strong',
			color: 'bg-green-500'
		};
	});

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		onInput?.(value);
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		onChange?.(value);
	}
</script>

<div class={cn('space-y-2', classNames?.container)}>
	{#if label}
		<Label for={id} class={classNames?.label}>
			{label}
			{#if required}
				<span class="text-destructive">*</span>
			{/if}
		</Label>
	{/if}

	<div class="relative">
		<Input
			{id}
			{name}
			type={showPassword ? 'text' : 'password'}
			{value}
			{placeholder}
			{disabled}
			{required}
			oninput={handleInput}
			onchange={handleChange}
			class={cn('pr-10', className, classNames?.input)}
		/>
		<Button
			type="button"
			variant="ghost"
			size="sm"
			class={cn('absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent', classNames?.button)}
			onclick={() => (showPassword = !showPassword)}
			{disabled}
		>
			{#if showPassword}
				<EyeOff class="size-4" />
			{:else}
				<Eye class="size-4" />
			{/if}
		</Button>
	</div>

	{#if showStrength && value}
		<div class={cn('space-y-2', classNames?.strength)}>
			<!-- Strength bar -->
			<div class="flex items-center gap-2">
				<div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
					<div
						class={cn('h-full transition-all duration-300', passwordStrength.color)}
						style={`width: ${(passwordStrength.score / 5) * 100}%`}
					></div>
				</div>
				<span class="text-xs font-medium">
					{passwordStrength.label}
				</span>
			</div>
		</div>
	{/if}

	{#if showRequirements && value}
		<div class={cn('space-y-1 text-xs', classNames?.requirements)}>
			<div
				class={cn(
					'flex items-center gap-2',
					passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'
				)}
			>
				{#if passwordValidation.minLength}
					<CheckCircle class="size-3 text-green-600" />
				{:else}
					<X class="size-3 text-muted-foreground" />
				{/if}
				{localization.MIN_8_CHARACTERS || 'At least 8 characters'}
			</div>
			<div
				class={cn(
					'flex items-center gap-2',
					passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'
				)}
			>
				{#if passwordValidation.hasNumber}
					<CheckCircle class="size-3 text-green-600" />
				{:else}
					<X class="size-3 text-muted-foreground" />
				{/if}
				{localization.CONTAINS_NUMBER || 'Contains a number'}
			</div>
			<div
				class={cn(
					'flex items-center gap-2',
					passwordValidation.hasLower ? 'text-green-600' : 'text-muted-foreground'
				)}
			>
				{#if passwordValidation.hasLower}
					<CheckCircle class="size-3 text-green-600" />
				{:else}
					<X class="size-3 text-muted-foreground" />
				{/if}
				{localization.CONTAINS_LOWERCASE || 'Contains lowercase letter'}
			</div>
			<div
				class={cn(
					'flex items-center gap-2',
					passwordValidation.hasUpper ? 'text-green-600' : 'text-muted-foreground'
				)}
			>
				{#if passwordValidation.hasUpper}
					<CheckCircle class="size-3 text-green-600" />
				{:else}
					<X class="size-3 text-muted-foreground" />
				{/if}
				{localization.CONTAINS_UPPERCASE || 'Contains uppercase letter'}
			</div>
			<div
				class={cn(
					'flex items-center gap-2',
					passwordValidation.hasSpecial ? 'text-green-600' : 'text-muted-foreground'
				)}
			>
				{#if passwordValidation.hasSpecial}
					<CheckCircle class="size-3 text-green-600" />
				{:else}
					<X class="size-3 text-muted-foreground" />
				{/if}
				{localization.CONTAINS_SPECIAL || 'Contains special character'}
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	let {
		result
	}: {
		result: {
			ua: string;
			browser?: { name?: string; version?: string; major?: string };
			engine?: { name?: string; version?: string };
			os?: { name?: string; version?: string };
			device?: Record<string, any>;
			cpu?: Record<string, any>;
			[k: string]: any;
		};
	} = $props();

	const safe = (v?: string) => (v ? v : 'Unknown');
	const compactBrowser = () =>
		result?.browser?.name
			? `${result.browser.name}${result.browser?.version ? ` ${result.browser.version}` : ''}`
			: 'Unknown browser';
	const compactOS = () =>
		result?.os?.name
			? `${result.os.name}${result.os?.version ? ` ${result.os.version}` : ''}`
			: 'Unknown OS';
</script>

<!-- Wrapper uses utility classes so this can be used inside a <tr> or <li>.
     For table rows, just place the component in a <td>. -->
<div class="flex flex-col gap-0.5 text-sm">
	<div class="flex items-center gap-3">
		<div class="font-medium text-slate-900 dark:text-slate-100 truncate">{compactBrowser()}</div>
		<div class="text-xs text-slate-500 dark:text-slate-400 truncate">• {compactOS()}</div>
		{#if result?.engine?.name}
			<div class="ml-2 text-xs text-slate-400 truncate">
				({result.engine.name}{result.engine?.version ? ` ${result.engine.version}` : ''})
			</div>
		{/if}
	</div>

	<!-- Raw UA small, truncated; full UA available via title on hover -->
	<div
		class="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[60ch]"
		title={result?.ua ?? ''}
		aria-label="Raw user agent"
	>
		{result?.ua ?? ''}
	</div>
</div>

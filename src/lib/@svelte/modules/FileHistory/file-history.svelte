<script lang="ts">
    import { Badge } from "@/components/ui/badge";
    import { _, dayjs } from "@services";
	import type { DocumentFeedbackOutput } from "@api/client";
	import { LocalizedDate } from "@/@svelte/components";

    interface Props {
        history: DocumentFeedbackOutput[];
    }

    let { history, ...rest }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>
<div {...rest}>
    <h4 class="font-semibold mb-2">
        {$_('modules.file-history.title')}
    </h4>
    <div class="space-y-3">
        {#each history
            ?.toSorted(
                ({ timestamp: atimestamp }, { timestamp: btimestamp }) =>
                    dayjs(btimestamp).valueOf() - dayjs(atimestamp).valueOf()
            ) ?? [] as fileEvent}
            <div
                class="border-l-2 pl-3"
                class:border-yellow-500={fileEvent.feedbackType === 'change-request'}
                class:border-green-500={fileEvent.feedbackType === 'confirmation'}
                class:border-red-500={fileEvent.feedbackType === 'rejection'}
            >
                <div class="flex items-center">
                    <Badge variant="secondary">{$_(`common.catalogue-data-history.${fileEvent.feedbackType?.toLowerCase()}`)}</Badge>
                </div>
                {#if fileEvent.message}
                    <p class="text-xs mt-1 text-gray-600 dark:text-gray-400">{fileEvent.message}</p>
                {/if}
                <LocalizedDate date={fileEvent.timestamp} />
            </div>
        {/each}
    </div>
</div>
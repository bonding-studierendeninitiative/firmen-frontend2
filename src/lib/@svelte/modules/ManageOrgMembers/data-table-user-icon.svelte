<script lang="ts">
	import * as Avatar from "@/components/ui/avatar"
	interface Props {
		src: string;
		userName: string;
	}

	let { src, userName }: Props = $props();
</script>
<Avatar.Root class="size-6">
	<Avatar.Image src={src} alt={userName} />
	<Avatar.Fallback>{userName[0]}</Avatar.Fallback>
</Avatar.Root>


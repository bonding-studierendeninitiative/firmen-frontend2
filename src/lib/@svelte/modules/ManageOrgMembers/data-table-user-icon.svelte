<script lang="ts">
	export let src: string;
	export let userName: string;
	import * as Avatar from "@/components/ui/avatar"
</script>
<Avatar.Root class="w-6 h-6">
	<Avatar.Image src={src} alt={userName} />
	<Avatar.Fallback>{userName[0]}</Avatar.Fallback>
</Avatar.Root>


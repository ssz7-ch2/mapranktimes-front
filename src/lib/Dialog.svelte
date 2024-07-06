<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		showDialog: boolean;
		children: Snippet;
	};
	let { showDialog = $bindable(), children }: Props = $props();
</script>

{#if showDialog}
	<div
		class="fixed flex items-center justify-center top-0 left-0 w-screen h-screen z-[1000]"
		in:fade={{ duration: 150 }}
		out:fade={{ duration: 100 }}
	>
		<div
			class="absolute w-full h-full bg-black cursor-pointer opacity-50"
			onclick={() => (showDialog = false)}
			aria-hidden="true"
		></div>
		<div
			class="z-[1001] w-full max-w-[576px] max-h-[65%] overflow-y-scroll bg-scroll pointer-fine:hide-scroll text-center bg-neutral-800 mx-3 px-2 py-3 md:px-5 md:py-4 rounded-md shadow-2xl shadow-black"
		>
			{@render children()}
		</div>
	</div>
{/if}

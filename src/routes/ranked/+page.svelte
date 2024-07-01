<script>
	import MainLayout from '$lib/MainLayout.svelte';
	export let data;
</script>

<MainLayout beatmapSets={data.beatmapSets}>
	<h1 class="font-mono font-bold text-3xl md:text-4xl mt-6 mb-3 md:mt-8 md:mb-4">Ranked Maps</h1>
</MainLayout>

<script lang="ts">
	import type { BeatmapSet } from '$lib/types/beatmap.types';
	import VirtualList from '$lib/VirtualList.svelte';
	import { chunk } from 'lodash-es';
	import BeatmapSetItem from './BeatmapSetItem.svelte';

	type Props = {
		beatmapSets: BeatmapSet[];
	};
	let { beatmapSets }: Props = $props();
</script>

{#snippet beatmapSetItem(items: BeatmapSet[][])}
	<div>
		{#each items as row}
			<div class="flex flex-row w-full gap-3 md:gap-5 mb-3 md:mb-5">
				{#each row as beatmapSet (beatmapSet.id)}
					<div class="w-full md:w-1/2">
						<BeatmapSetItem {beatmapSet} />
					</div>
				{/each}
			</div>
		{/each}
	</div>
{/snippet}

<VirtualList
	items={chunk(beatmapSets, 2)}
	itemHeight={164}
	itemBuffer={5}
	itemSnippet={beatmapSetItem}
/>

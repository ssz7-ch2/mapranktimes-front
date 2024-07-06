<script lang="ts">
	import ModeIcon from './ModeIcon.svelte';
	import type { BeatmapSet, Mode } from './types/beatmap.types';
	import { selectedMode } from '../stores';

	type Props = {
		beatmapSets: readonly BeatmapSet[];
	};

	let { beatmapSets }: Props = $props();
	const modeList: Mode[] = ['osu', 'taiko', 'catch', 'mania'];
</script>

<div class="flex items-center leading-none mb-2 md:mb-3 gap-2 font-light text-[17px]">
	<button
		title={`${beatmapSets?.length ?? 0} maps`}
		class="opacity-60 hover:opacity-100 transition-opacity"
		style="opacity:{$selectedMode === -1 ? 1 : undefined}; color:{$selectedMode === -1
			? '#FFDD55'
			: undefined}"
		onclick={() => ($selectedMode = -1)}
	>
		Any
	</button>
	{#each modeList as { }, i}
		<button
			title={`${
				beatmapSets?.filter((beatmapSet) =>
					beatmapSet.beatmaps.some((beatmap) => beatmap.mode == i)
				).length ?? 0
			} maps`}
			class="opacity-60 hover:opacity-100 transition-opacity"
			style="opacity:{$selectedMode === i ? 1 : undefined}; filter:{$selectedMode === i
				? 'brightness(0) saturate(100%) invert(75%) sepia(80%) saturate(326%) hue-rotate(358deg) brightness(101%) contrast(105%)'
				: undefined}"
			onclick={() => ($selectedMode = $selectedMode === i ? -1 : i)}
		>
			<ModeIcon mode={i} width={18} height={18} class="select-none overflow-hidden" />
		</button>
	{/each}
</div>

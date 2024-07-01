<script lang="ts">
	import FilterTextBox from './FilterTextBox.svelte';
	import ToggleSwitch from './ToggleSwitch.svelte';
	import type { BeatmapSet } from './types/beatmap.types';

	type Props = {
		filter: ((beatmapSet: BeatmapSet) => boolean) | null;
		filterOn: boolean;
		filterString: string | null;
	};

	let {
		filter = $bindable(),
		filterOn = $bindable(),
		filterString = $bindable()
	}: Props = $props();
</script>

<div class="flex flex-row gap-5 mb-3 md:mb-5 w-full items-center justify-center">
	<div class="hidden md:block">
		<ToggleSwitch
			switchWidth={40}
			color="#FFDD55"
			bind:value={filterOn}
			class="font-mono whitespace-nowrap gap-3"
			condition={() => filterString !== null}
		>
			<p class="select-none pt-[1.6px]">Enable Filter</p>
		</ToggleSwitch>
	</div>

	<FilterTextBox bind:filter bind:filterString bind:filterOn class="w-full md:w-96 text-lg" />
</div>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { msToTime, secToDate } from './utils/date';
	import type { BeatmapSet } from './types/beatmap.types';
	import { filter, filterOn, selectedMode } from '../stores';

	type Props = {
		onclick?(): void;
		beatmapSets: readonly BeatmapSet[];
		probability: number;
		showEarly: boolean;
	};

	let { onclick, beatmapSets = $bindable(), probability, showEarly }: Props = $props();

	let time = $state<Date>(new Date(Math.ceil(Date.now() / 1000) * 1000));

	let timeLeft = $derived.by(() => {
		if (beatmapSets.length === 0) return NaN;

		// update rankEarly
		let updateBeatmapSets = false;
		for (const beatmapSet of beatmapSets) {
			if (time < secToDate(beatmapSet.rank_date_early ?? beatmapSet.rank_date)) break;

			// if 12 minutes have passed since the ranking process started
			// the map can't be ranked early anymore
			if (
				beatmapSet.probability &&
				beatmapSet.probability >= probability &&
				time.getTime() > Math.ceil((beatmapSet.rank_date_early! * 1000) / 600000) * 600000 + 120000
			) {
				beatmapSet.probability = 0;
				beatmapSet.rank_date_early = beatmapSet.rank_date;
				updateBeatmapSets = true;
			}
		}
		if (updateBeatmapSets) beatmapSets = [...beatmapSets];

		const filteredSets = beatmapSets
			.filter(
				(beatmapSet) =>
					$selectedMode === -1 ||
					beatmapSet.beatmaps.some((beatmap) => beatmap.mode == $selectedMode)
			)
			.filter((beatmapSet) => ($filterOn && $filter ? $filter(beatmapSet) : true))
			.filter((beatmapSet) => !beatmapSet.unresolved);

		if (filteredSets.length === 0) return NaN;

		let beatmapSet = filteredSets[0];
		let rankDate = beatmapSet.rank_date * 1000;
		if (showEarly && beatmapSet.probability !== null && beatmapSet.probability >= probability)
			rankDate = beatmapSet.rank_date_early! * 1000;

		return rankDate - time.getTime();
	});

	const unsubscribe = selectedMode.subscribe(() => {
		time = new Date(Math.ceil(Date.now() / 1000) * 1000);
	});
	onDestroy(unsubscribe);

	onMount(() => {
		const interval = setInterval(
			() => (time = new Date(Math.ceil(Date.now() / 1000) * 1000)),
			1000
		);
		return () => clearInterval(interval);
	});
</script>

<div class="mt-10 mb-5 md:mt-14 md:mb-7">
	<div class={timeLeft < 0 ? 'w-[268.63px] md:w-[345.38px] flex flex-row-reverse' : ''}>
		<button
			style={timeLeft <= 0 ? 'color: #1FA009' : ''}
			class="font-mono text-[56px] md:text-7xl font-bold leading-none cursor-pointer"
			{onclick}
		>
			{msToTime(timeLeft)}
		</button>
	</div>
	<div>
		<h1
			class="font-mono text-neutral-600 text-2xl md:text-4xl font-bold leading-none whitespace-nowrap -m-1.5 md:-m-3"
		>
			{time?.toLocaleTimeString() ?? '\u00A0'}
		</h1>
	</div>
</div>

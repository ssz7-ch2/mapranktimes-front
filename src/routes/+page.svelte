<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import MainLayout from '$lib/MainLayout.svelte';
	import Slider from '$lib/Slider.svelte';
	import TimeLeft from '$lib/TimeLeft.svelte';
	import { onMount } from 'svelte';
	import { probabilityCutoff, showEarly } from '../stores';
	import ToggleSwitch from '$lib/ToggleSwitch.svelte';
	import type { Tables } from '$lib/types/database.types';
	import type { BeatmapSet, BeatmapSetDatabase } from '$lib/types/beatmap.types';
	import ViteWorker from '../worker?worker';
	import { secToDate } from '$lib/utils/date';
	let { data } = $props();

	let beatmapSets = $state.frozen(data.beatmapSets ?? []);
	let showDialog = $state(false);

	let worker: Worker;

	const connectDatabase = () => {
		worker = new ViteWorker();
		worker.onmessage = async (event: { data: Tables<'updates'> }) => {
			const { updated_maps, deleted_maps, timestamp } = event.data;
			let data: BeatmapSetDatabase[] | null = null;
			if (updated_maps.length > 0) {
				await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1200 + 800)));

				const res = await fetch('/api/getupdated', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ timestamp, updated_maps })
				});
				const updatedMaps = await res.json();

				data = updatedMaps;
			}

			let updatedBeatmapSets = [...beatmapSets];
			if (deleted_maps.length > 0) {
				updatedBeatmapSets = updatedBeatmapSets.filter(
					(beatmapSet) => !deleted_maps.includes(beatmapSet.id)
				);
			}

			if (data) {
				data.forEach((item) => {
					const index = updatedBeatmapSets.findIndex((beatmapSet) => beatmapSet.id === item.id);
					if (index >= 0) {
						if (item.beatmaps) {
							item.beatmaps =
								typeof item.beatmaps === 'string' ? JSON.parse(item.beatmaps) : item.beatmaps;
							updatedBeatmapSets[index] = item as BeatmapSet;
						} else {
							updatedBeatmapSets[index].unresolved = item.unresolved;
						}
					} else {
						if (item.beatmaps) {
							// new qualified map
							item.beatmaps =
								typeof item.beatmaps === 'string' ? JSON.parse(item.beatmaps) : item.beatmaps;
							updatedBeatmapSets.push(item as BeatmapSet);
						} else {
							console.log('missing map from beatmapsets', item.id);
							console.log(item);
							console.log(updatedBeatmapSets);
						}
					}
				});

				// it's possible for the maps to become out of order
				updatedBeatmapSets.sort((a, b) =>
					a.rank_date_early === b.rank_date_early
						? a.queue_date! - b.queue_date!
						: a.rank_date_early! - b.rank_date_early!
				);
			}

			localStorage.setItem('beatmapSets', JSON.stringify(updatedBeatmapSets));

			beatmapSets = updatedBeatmapSets;

			console.log('beatmapsets updated', new Date().toISOString());
		};
	};

	onMount(() => {
		const probability = localStorage.getItem('probability');
		if (probability) {
			$probabilityCutoff = parseFloat(probability);
		}

		if (data.beatmapSets) localStorage.setItem('beatmapSets', JSON.stringify(data.beatmapSets));
		else {
			// database is dead so use local storage in the meantime
			const localBeatmapSetsString = localStorage.getItem('beatmapSets');
			if (localBeatmapSetsString) {
				const localBeatmapSets: BeatmapSet[] = JSON.parse(localBeatmapSetsString);
				if (localBeatmapSets[0].rank_date) {
					beatmapSets = localBeatmapSets.filter(
						(beatmapSet) => Date.now() - secToDate(beatmapSet.rank_date).getTime() < 10 * 60000
					);
					console.log('local beatmapsets loaded');
				} else {
					// remove old version
					localStorage.removeItem('beatmapSets');
					console.log('removed old beatmapsets');
				}
			}
		}

		connectDatabase();
	});
</script>

<MainLayout {beatmapSets}>
	<TimeLeft
		bind:beatmapSets
		probability={$probabilityCutoff}
		showEarly={$showEarly}
		onclick={() => (showDialog = !showDialog)}
	/>
</MainLayout>

<Dialog bind:showDialog>
	<h1 class="font-bold text-4xl mt-4 leading-none">Info</h1>
	<div class="text-xs text-neutral-500 mb-1">
		Contact:{' '}
		<a href="https://osu.ppy.sh/users/sometimes" target="_blank" rel="noreferrer"> osu! </a>{' '}
		- <span class="select-all cursor-pointer">sometimes#9353</span>
	</div>
	<p class="text-sm font-normal mb-1 text-yellow">
		*Click on timer to open this info dialog again*
	</p>
	<hr class="border-neutral-400 mt-3" />
	<div class="font-extralight text-center">
		<div class="px-2">
			<h2 class="text-xl mt-3 font-medium">Timer</h2>
			<p>
				If timer is <span class="text-[#1FA009] font-normal">green</span>, then the next map is
				being ranked. Map will disappear from page when map is ranked (usually within a minute).
				<br />
				If the first map is unresolved, the timer will use the next map.
			</p>
			<hr class="border-neutral-400 mt-3" />
			<h2 class="text-xl mt-3 font-medium">Filter</h2>
			<p>
				<span class="text-neutral-300">Filter terms: </span>
				<b>spin</b>, <b>stars</b>, <b>len</b>, <b>unresolved</b>
			</p>
			<div>
				<span class="text-sm text-neutral-300">Example: </span>
				<div class="font-mono bg-black my-0.5 py-0.5 px-2 rounded inline-block">
					spin{'>'}0 stars{'<='}3 len{'<'}120
				</div>
			</div>
			<p>
				will show mapsets with map(s) that have more than 0 spinners, are at most 3 stars, and are
				shorter than 2 min.
			</p>
			<hr class="border-neutral-400 mt-3" />
			<h2 class="text-xl mt-3 font-medium">Rank Early</h2>
			<p>
				Maps with <span class="text-yellow font-medium">*</span> are likely to be ranked early. The
				number after <span class="text-yellow font-medium">*</span> is the probability. Note - the rank
				early time shown is the earliest possible time the map can get ranked, not the exact time.
			</p>
			<hr class="border-neutral-400 mt-3" />
			<h2 class="text-xl mt-3 font-medium text-center">More Info</h2>
			<div class="mx-auto text-left text-sm">
				<ul class="list-disc ml-4 marker:text-neutral-400">
					<li>All times are in local time</li>
					<li>Page updates on minutes 2, 3, 4, 5, 6, 8, 11 (repeated every 20 minutes)</li>
					<li>98% of maps are ranked within 8 minutes</li>
					<li>
						<a
							href="https://docs.google.com/spreadsheets/d/1bCgPBLKmHQkkviqOc3UJVy2NMggSeo8zhMVP7Yde97M/edit?usp=sharing"
							target="_blank"
							class="text-neutral-400"
							rel="noreferrer"
						>
							Old Google Sheets Link
						</a>
					</li>
				</ul>
			</div>
			<div class="flex gap-1 items-center">
				<span class="whitespace-nowrap text-sm leading-none">Early Cutoff</span>
				<Slider
					class="w-full h-10 cursor-pointer slider px-2"
					sliderTrackClass="h-2 pointer-fine:h-1 rounded-full bg-neutral-500 slider-track"
					sliderThumbClass="h-4 w-4 pointer-fine:h-2 pointer-fine:w-4 bg-yellow rounded-full outline-none slider-thumb"
					trackColor="#ffdd55d9"
					trackColorBase="rgb(115, 115, 115)"
					onChange={(value) => {
						$probabilityCutoff = value / 100 / 2;
					}}
					onAfterChange={(value) => {
						localStorage.setItem('probability', (value / 100 / 2).toString());
					}}
					startingValue={$probabilityCutoff * 2 * 100}
					max={20}
				/>
				<span class="whitespace-nowrap font-medium text-sm w-8 shrink-0 leading-none">
					{($probabilityCutoff * 100).toFixed(1)}%
				</span>
			</div>
			<div class="flex justify-center">
				<ToggleSwitch
					switchWidth={35}
					color="#FFDD55"
					bind:value={$showEarly}
					class="whitespace-nowrap gap-2"
				>
					<p class="select-none text-sm">Show Early Time</p>
				</ToggleSwitch>
			</div>
		</div>
	</div>
</Dialog>

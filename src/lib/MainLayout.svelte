<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import ModeSelect from './ModeSelect.svelte';
	import type { BeatmapSet } from './types/beatmap.types';
	import Filter from './Filter.svelte';
	import BeatmapSetList from './beatmapsets/BeatmapSetList.svelte';
	import { filter, filterOn, largeScreen, touchDevice } from '../stores';
	import { selectedMode } from '../stores';
	import { audioPlayer } from './utils/audio';
	import { debounce } from 'lodash-es';
	import Slider from './Slider.svelte';

	type Props = {
		beatmapSets: readonly BeatmapSet[];
		children: Snippet;
	};
	let { beatmapSets, children }: Props = $props();

	let isOverSlider = $state(false);
	let volumeSliderRef: HTMLDivElement;
	let defaultVolume = $state(50);

	let filteredBeatmapsets = $derived.by(() => {
		if (!$filterOn || !$filter) return beatmapSets;

		return beatmapSets.filter($filter);
	});

	const detectMediaChange = (
		mediaQuery: string,
		setValue: (value: boolean) => void,
		callback?: (value: boolean) => void
	) => {
		const mql = matchMedia(mediaQuery);
		setValue && setValue(mql.matches);
		if (callback) callback(mql.matches);

		const onMediaChange = (e: MediaQueryListEvent) => {
			setValue && setValue(e.matches);
			if (callback) callback(e.matches);
		};
		mql.addEventListener('change', onMediaChange);
	};

	const closeVolumeSlider = debounce((target: HTMLElement) => {
		target.style.bottom = '-40px';
	}, 1000);

	onMount(() => {
		detectMediaChange('(pointer:coarse)', (value) => ($touchDevice = value));
		detectMediaChange(
			'(min-width:48em)',
			(value) => ($largeScreen = value),
			(value) => {
				if (value === false) $filterOn = true;
			}
		);

		audioPlayer.setUp();
		audioPlayer.setOnPause(() => {
			if (!isOverSlider) closeVolumeSlider(volumeSliderRef);
		});
		audioPlayer.setOnPlay(() => {
			closeVolumeSlider.cancel();
			volumeSliderRef.style.bottom = '0px';
		});
		const volume = localStorage.getItem('volume');
		if (volume) {
			audioPlayer.setVolume(parseInt(volume));
			defaultVolume = parseInt(volume);
		}
	});
</script>

<main
	class="min-h-screen font-sans flex flex-col w-full items-center text-center px-3 md:px-5 mx-auto md:max-w-[1024px] max-w-[448px]"
>
	{@render children()}
	<ModeSelect {beatmapSets} />
	<Filter />

	<div class="flex-grow w-full">
		<BeatmapSetList
			beatmapSets={$selectedMode === -1
				? filteredBeatmapsets
				: filteredBeatmapsets.filter((beatmapSet) =>
						beatmapSet.beatmaps.some((beatmap) => beatmap.mode === $selectedMode)
					)}
		/>
	</div>

	<footer class="mb-2 -mt-1 md:-mt-3 w-full">
		<div class="text-center text-xs text-neutral-600">
			<a href="https://osu.ppy.sh/users/sometimes" target="_blank" rel="noreferrer"> osu! </a>{' '}
			- <span class="select-all cursor-pointer">sometimes#9353</span> -{' '}
			<a href="https://anilist.co/user/sometimes/" target="_blank" rel="noreferrer">
				AniList
			</a>{' '}
		</div>
	</footer>
</main>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed bottom-[-40px] h-min w-full flex flex-row justify-end z-[500] transition-all pointer-events-none"
	onmouseenter={() => {
		if (!$touchDevice) isOverSlider = true;
	}}
	onmouseleave={() => {
		if (!$touchDevice) {
			if (!audioPlayer.isPlaying()) closeVolumeSlider(volumeSliderRef);
			isOverSlider = false;
		}
	}}
	bind:this={volumeSliderRef}
>
	<div
		class="w-full md:w-96 flex flex-row items-center bg-neutral-800 md:rounded-tl pl-3.5 pointer-events-auto"
		style="box-shadow: 0 0 10px rgba(0,0,0,0.6)"
	>
		<span class="whitespace-nowrap font-medium text-sm">Audio Volume</span>
		<Slider
			class="w-full h-10 cursor-pointer slider px-2"
			sliderTrackClass="h-2 pointer-fine:h-1 rounded-full bg-neutral-500 slider-track"
			trackColor="#ffdd55d9"
			trackColorBase="rgb(115, 115, 115)"
			sliderThumbClass="h-4 w-4 pointer-fine:h-2 pointer-fine:w-4 bg-yellow rounded-full outline-none slider-thumb"
			onChange={(value) => audioPlayer.setVolume(value)}
			onAfterChange={(value) => localStorage.setItem('volume', value.toString())}
			startingValue={defaultVolume}
		/>
	</div>
</div>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import ModeSelect from './ModeSelect.svelte';
	import type { BeatmapSet } from './types/beatmap.types';
	import Filter from './Filter.svelte';
	import BeatmapSetList from './beatmapsets/BeatmapSetList.svelte';
	import { largeScreen, touchDevice } from '../stores';

	type Props = {
		beatmapSets: BeatmapSet[];
		children: Snippet;
	};
	let { beatmapSets, children }: Props = $props();

	let filter = $state<null | ((beatmapSet: BeatmapSet) => boolean)>(null);
	let filterOn = $state(false);
	let filterString = $state<string | null>(null);

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
			console.log(mediaQuery, e.matches);
		};
		mql.addEventListener('change', onMediaChange);
	};

	onMount(() => {
		detectMediaChange('(pointer:coarse)', (value) => ($touchDevice = value));
		detectMediaChange(
			'(min-width:48em)',
			(value) => ($largeScreen = value),
			(value) => {
				if (value === false) filterOn = true;
			}
		);
	});
</script>

<main
	class="min-h-screen font-sans flex flex-col w-full items-center text-center px-3 md:px-5 mx-auto md:max-w-[1024px] max-w-[448px]"
>
	{@render children()}
	<ModeSelect {beatmapSets} />
	<Filter bind:filterOn bind:filterString bind:filter />

	<div class="flex-grow w-full">
		<BeatmapSetList {beatmapSets} />
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

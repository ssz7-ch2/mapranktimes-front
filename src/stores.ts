import { browser } from '$app/environment';
import type { BeatmapSet } from '$lib/types/beatmap.types';
import { writable } from 'svelte/store';

export const selectedMode = writable(browser ? parseInt(localStorage.getItem('mode') ?? '-1') : -1);
export const touchDevice = writable(false);
export const largeScreen = writable(true);
export const filter = writable<null | ((beatmapSet: BeatmapSet) => boolean)>(null);
export const filterOn = writable(browser ? localStorage.getItem('filterOn') === 'true' : false);
export const filterString = writable<string | null>(null);
export const probabilityCutoff = writable(0.01);
export const showEarly = writable(browser ? localStorage.getItem('showEarly') === 'true' : false);

selectedMode.subscribe((value) => {
	if (browser) localStorage.setItem('mode', value.toString());
});

showEarly.subscribe((value) => {
	if (browser) localStorage.setItem('showEarly', value.toString());
});

filterOn.subscribe((value) => {
	if (browser) localStorage.setItem('filterOn', value.toString());
});

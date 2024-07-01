import type { BeatmapSet } from '$lib/types/beatmap.types';
import { writable } from 'svelte/store';

export const selectedMode = writable(0);
export const filter = writable<((beatmapSet: BeatmapSet) => boolean) | null>(null);
export const filterOn = writable(false);
export const filterString = writable<null | string>(null);

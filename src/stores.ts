import type { BeatmapSet } from '$lib/types/beatmap.types';
import { writable } from 'svelte/store';

export const selectedMode = writable(0);
export const touchDevice = writable(false);
export const largeScreen = writable(true);

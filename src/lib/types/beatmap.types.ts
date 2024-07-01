import type { Json } from './database.types';

export type BeatmapSet = {
	id: number;
	queue_date: number | null;
	rank_date: number;
	rank_date_early: number | null;
	artist: string;
	title: string;
	mapper: string;
	mapper_id: number;
	probability: number | null;
	unresolved: boolean;
	beatmaps: Beatmap[];
};

export type Beatmap = {
	id: number;
	ver: string;
	spin: number;
	sr: number;
	len: number;
	mode: number;
};

export type BeatmapSetDatabase = {
	id: number;
	queue_date: number | null;
	rank_date: number;
	rank_date_early: number | null;
	artist: string;
	title: string;
	mapper: string;
	mapper_id: number;
	probability: number | null;
	unresolved: boolean;
	beatmaps: Json;
};

export type Mode = 'osu' | 'taiko' | 'catch' | 'mania';

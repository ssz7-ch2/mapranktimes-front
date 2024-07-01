import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Database } from '$lib/types/database.types';
import type { Beatmap } from '$lib/types/beatmap.types';

export async function load() {
	const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

	const { data, error: supabaseError } = await supabase
		.from('beatmapsets')
		.select('*')
		.is('queue_date', null);

	console.log('getranked');

	if (!data || supabaseError) throw error(404, { message: `Failed to get ranked maps.` });

	return {
		beatmapSets: data
			.map((beatmapSet) => {
				const parsedBeatmaps: Beatmap[] =
					typeof beatmapSet.beatmaps === 'string'
						? JSON.parse(beatmapSet.beatmaps)
						: beatmapSet.beatmaps;
				return {
					...beatmapSet,
					beatmaps: parsedBeatmaps.sort((a, b) => a.mode - b.mode)
				};
			})
			.sort((a, b) => b.rank_date - a.rank_date)
	};
}

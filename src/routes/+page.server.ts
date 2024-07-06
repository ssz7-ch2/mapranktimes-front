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
		.not('queue_date', 'is', null);

	console.log('getqualified');

	if (!data || supabaseError) {
		console.log('Failed to get qualified maps.');
		return { beatmapSets: null };
		// throw error(404, { message: `Failed to get qualified maps.` })
	}

	const beatmapSets = data
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
		.sort((a, b) =>
			a.rank_date_early === b.rank_date_early
				? a.queue_date! - b.queue_date!
				: a.rank_date_early! - b.rank_date_early!
		);

	return {
		beatmapSets
	};
}

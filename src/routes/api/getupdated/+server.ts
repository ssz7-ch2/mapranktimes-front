import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import type { Database } from '$lib/types/database.types.js';

export async function POST({ request }) {
	const { updated_maps: updatedMaps, timestamp } = await request.json();

	if (!timestamp) return json({ error: `Failed to get updated maps.` }, { status: 404 });

	console.log('getupdated');

	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN
	});
	const dataCached = await redis.get(`updates-${timestamp}`);

	if (dataCached) {
		return json(typeof dataCached === 'string' ? JSON.parse(dataCached) : dataCached, {
			status: 200
		});
	}

	const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

	const { data, error } = await supabase.from('beatmapsets').select('*').in('id', updatedMaps);

	if (!data || error) return json({ error: `Failed to get updated maps.` }, { status: 404 });
	return json(data, { status: 200 });
}

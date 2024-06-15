import { createClient } from "@supabase/supabase-js";

const handler = async (req, res) => {
  const { query } = req;
  const { id } = query;

  res.setHeader("Cache-Control", "s-maxage=3600");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("beatmapsets")
    .select("id, rank_date, rank_date_early, artist, title, probability, beatmaps")
    .eq("id", id);

  if (!data || error) {
    res.status(404).json({ error: `Beatmapset with id: ${id} not found.` });
  } else {
    const beatmapSet = data[0];
    beatmapSet.beatmaps = JSON.parse(beatmapSet.beatmaps);
    beatmapSet.rank_date = new Date(beatmapSet.rank_date * 1000);
    beatmapSet.rank_date_early = new Date(beatmapSet.rank_date_early * 1000);
    beatmapSet.rank_early = (beatmapSet.probability ?? 0) >= 0.01;
    delete beatmapSet.probability;
    res.status(200).json(beatmapSet);
  }
};

export default handler;

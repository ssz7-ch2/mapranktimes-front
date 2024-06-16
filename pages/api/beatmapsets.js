import { createClient } from "@supabase/supabase-js";

const handler = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=3600");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("beatmapsets")
    .select("id, rank_date, rank_date_early, artist, title, probability, beatmaps")
    .not("queue_date", "is", null);

  if (!data || error) {
    res.status(404).json({ error: `Failed to get beatmapsets.` });
  } else {
    data.forEach((beatmapSet) => {
      beatmapSet.beatmaps = JSON.parse(beatmapSet.beatmaps);
      beatmapSet.rank_date = new Date(beatmapSet.rank_date * 1000);
      beatmapSet.rank_date_early = new Date(beatmapSet.rank_date_early * 1000);
      beatmapSet.rank_early = (beatmapSet.probability ?? 0) >= 0.01;
      delete beatmapSet.probability;
    });
    res.status(200).json(data.sort((a, b) => a.rank_date_early - b.rank_date_early));
  }
};

export default handler;

import { createClient } from "@supabase/supabase-js";

const handler = async (req, res) => {
  // move cache to upstash if vercel runs out?
  res.setHeader("Cache-Control", "s-maxage=150");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("beatmapsets")
    .select("*")
    .not("queue_date", "is", null);

  console.log("getqualified");

  if (!data || error) {
    res.status(404).json({ error: `Failed to get qualified maps.` });
  } else {
    res.status(200).json(data);
  }
};

export default handler;
